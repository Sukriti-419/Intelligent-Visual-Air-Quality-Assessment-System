from __future__ import annotations

import os
import random
from typing import Any

import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
import tensorflow.keras.layers
from tensorflow.keras.models import load_model
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


APP_ROOT = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(APP_ROOT, '..', 'VGG16_air_pollution.h5')

CLASS_NAMES = [
    'Good',
    'Moderate',
    'Unhealthy for Sensitive Groups',
    'Unhealthy',
    'Very Unhealthy',
    'Hazardous',
]

CLASS_LABELS = ['A', 'B', 'C', 'D', 'E', 'F']

AQI_CATEGORIES: dict[str, dict[str, Any]] = {
    'Good': {
        'min': 0,
        'max': 50,
        'color': '#22c55e',
        'description': 'Air quality is satisfactory, and air pollution poses little or no risk.',
        'healthImplication': 'Air quality is considered satisfactory, and air pollution poses little or no risk. No health concerns are associated with this level.',
        'primaryPollutant': 'PM2.5 or O3',
        'sensitiveGroups': [],
        'recommendations': [
            'Enjoy outdoor activities freely',
            'Great day for jogging, cycling, or walking in the park',
            'Open windows to let fresh air circulate indoors',
            'No protective measures needed',
        ],
        'outdoorActivity': 'Ideal for all outdoor activities',
        'maskRequired': False,
        'ventilationAdvice': 'Open windows and doors for natural ventilation',
    },
    'Moderate': {
        'min': 51,
        'max': 100,
        'color': '#eab308',
        'description': 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive.',
        'healthImplication': 'Moderate air quality may cause respiratory symptoms in unusually sensitive individuals. The general public is not likely to be affected at this AQI range.',
        'primaryPollutant': 'PM2.5 or O3',
        'sensitiveGroups': ['Children', 'Elderly', 'People with respiratory conditions'],
        'recommendations': [
            'Sensitive groups should consider reducing prolonged outdoor exertion',
            'Take breaks during outdoor exercise',
            'Watch for symptoms like coughing or shortness of breath',
            'Keep rescue medications accessible if you have asthma',
        ],
        'outdoorActivity': 'Generally safe; sensitive groups should take precautions',
        'maskRequired': False,
        'ventilationAdvice': 'Normal ventilation is fine; consider air purifier for sensitive individuals',
    },
    'Unhealthy for Sensitive Groups': {
        'min': 101,
        'max': 150,
        'color': '#f97316',
        'description': 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
        'healthImplication': 'People with respiratory diseases such as asthma, children, and the elderly may experience health effects. The general public is unlikely to be affected at this AQI range.',
        'primaryPollutant': 'PM2.5, O3, or NO2',
        'sensitiveGroups': ['Children', 'Elderly', 'People with asthma', 'People with heart disease', 'Outdoor workers'],
        'recommendations': [
            'Sensitive groups should reduce prolonged outdoor exertion',
            'Consider moving activities indoors or rescheduling',
            'Use an N95 mask if prolonged outdoor exposure is necessary',
            'Run air purifiers indoors on high settings',
            'Keep windows closed during peak pollution hours',
        ],
        'outdoorActivity': 'Limit prolonged outdoor activity; sensitive groups should stay indoors',
        'maskRequired': False,
        'ventilationAdvice': 'Limit natural ventilation; use air purifiers with HEPA filters',
    },
    'Unhealthy': {
        'min': 151,
        'max': 200,
        'color': '#ef4444',
        'description': 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
        'healthImplication': 'Everyone may begin to experience health effects such as irritation, breathing difficulty, and aggravated respiratory conditions. Sensitive groups may experience more severe effects.',
        'primaryPollutant': 'PM2.5, PM10, O3, or NO2',
        'sensitiveGroups': ['Children', 'Elderly', 'People with asthma', 'People with heart disease', 'Outdoor workers', 'Pregnant women'],
        'recommendations': [
            'Everyone should reduce outdoor exertion',
            'Avoid jogging, cycling, and other strenuous outdoor activities',
            'Wear an N95 mask when going outside',
            'Keep all windows and doors closed',
            'Run air purifiers continuously on high settings',
            'Stay hydrated and monitor for symptoms',
        ],
        'outdoorActivity': 'Avoid outdoor activities; exercise indoors only',
        'maskRequired': True,
        'ventilationAdvice': 'Keep windows closed; rely on air purifiers and recirculated air',
    },
    'Very Unhealthy': {
        'min': 201,
        'max': 300,
        'color': '#dc2626',
        'description': 'Health alert: everyone may experience more serious health effects.',
        'healthImplication': 'Health alert! Everyone may experience more serious health effects including significant respiratory irritation, aggravated heart and lung disease, and potential cardiovascular and respiratory damage.',
        'primaryPollutant': 'PM2.5, PM10, SO2, or CO',
        'sensitiveGroups': ['Everyone is at risk', 'Especially children, elderly, and those with pre-existing conditions'],
        'recommendations': [
            'Avoid all outdoor physical activities',
            'Stay indoors with windows and doors sealed',
            'Wear N95 masks even for brief outdoor exposure',
            'Run multiple air purifiers if available',
            'Monitor air quality updates frequently',
            'Seek medical attention if experiencing breathing difficulty',
            'Consider relocating temporarily if possible',
        ],
        'outdoorActivity': 'Avoid all outdoor activities; stay indoors',
        'maskRequired': True,
        'ventilationAdvice': 'Seal all windows; use air purifiers on maximum settings; avoid any outdoor air intake',
    },
    'Hazardous': {
        'min': 301,
        'max': 500,
        'color': '#991b1b',
        'description': 'Health warning of emergency conditions: everyone is more likely to be affected.',
        'healthImplication': 'Health warning of emergency conditions! The entire population is likely to be affected with serious, potentially life-threatening health effects. Immediate precautions are necessary.',
        'primaryPollutant': 'PM2.5, PM10, SO2, CO, or NO2',
        'sensitiveGroups': ['Everyone is at serious risk'],
        'recommendations': [
            'Emergency conditions: stay indoors at all times',
            'Seal all windows, doors, and any air gaps',
            'Wear N95 masks even indoors if air quality is compromised',
            'Run all available air purifiers on maximum',
            'Avoid any physical exertion',
            'Seek medical attention for any respiratory symptoms',
            'Follow emergency broadcast instructions',
            'Consider evacuation if conditions persist',
        ],
        'outdoorActivity': 'No outdoor activity under any circumstances',
        'maskRequired': True,
        'ventilationAdvice': 'Complete seal of all openings; use multiple air purifiers; consider creating a clean room',
    },
}


def generate_pollutants(aqi_value: int, category: str) -> list[dict[str, Any]]:
    def jitter() -> float:
        return 0.7 + random.random() * 0.6

    return [
        {
            'name': 'PM2.5',
            'value': round(aqi_value * 0.4 * jitter()),
            'unit': 'ug/m3',
            'status': 'good' if category == 'Good' else 'moderate' if category == 'Moderate' else 'unhealthy',
            'color': '#22c55e' if category == 'Good' else '#eab308' if category == 'Moderate' else '#ef4444',
        },
        {
            'name': 'PM10',
            'value': round(aqi_value * 0.6 * jitter()),
            'unit': 'ug/m3',
            'status': 'good' if category == 'Good' else 'moderate' if category == 'Moderate' else 'unhealthy',
            'color': '#22c55e' if category == 'Good' else '#eab308' if category == 'Moderate' else '#ef4444',
        },
        {
            'name': 'O3',
            'value': round(aqi_value * 0.3 * jitter()),
            'unit': 'ppb',
            'status': 'good' if aqi_value < 70 else 'moderate' if aqi_value < 105 else 'unhealthy',
            'color': '#22c55e' if aqi_value < 70 else '#eab308' if aqi_value < 105 else '#ef4444',
        },
        {
            'name': 'NO2',
            'value': round(aqi_value * 0.25 * jitter()),
            'unit': 'ppb',
            'status': 'good' if aqi_value < 53 else 'moderate' if aqi_value < 100 else 'unhealthy',
            'color': '#22c55e' if aqi_value < 53 else '#eab308' if aqi_value < 100 else '#ef4444',
        },
        {
            'name': 'SO2',
            'value': round(aqi_value * 0.15 * jitter()),
            'unit': 'ppb',
            'status': 'good' if aqi_value < 75 else 'moderate' if aqi_value < 185 else 'unhealthy',
            'color': '#22c55e' if aqi_value < 75 else '#eab308' if aqi_value < 185 else '#ef4444',
        },
        {
            'name': 'CO',
            'value': round(aqi_value * 0.01 * jitter(), 1),
            'unit': 'ppm',
            'status': 'good' if aqi_value < 4.4 else 'moderate' if aqi_value < 9.4 else 'unhealthy',
            'color': '#22c55e' if aqi_value < 4.4 else '#eab308' if aqi_value < 9.4 else '#ef4444',
        },
    ]


def build_result(category: str, confidence: float, class_label: str) -> dict[str, Any]:
    info = AQI_CATEGORIES[category]

    return {
        'classLabel': class_label,
        'category': category,
        'confidence': round(confidence, 2),
        'color': info['color'],
        'description': info['description'],
        'healthImplication': info['healthImplication'],
        'sensitiveGroups': info['sensitiveGroups'],
        'recommendations': info['recommendations'],
        'outdoorActivity': info['outdoorActivity'],
        'maskRequired': info['maskRequired'],
        'ventilationAdvice': info['ventilationAdvice'],
    }


def preprocess_image(image_file) -> np.ndarray:
    image = Image.open(image_file).convert('RGB').resize((224, 224))
    image_array = np.asarray(image, dtype=np.float32) / 255.0
    return np.expand_dims(image_array, axis=0)


app = Flask(__name__)
CORS(app)
model = None


class CompatDense(tensorflow.keras.layers.Dense):
    def __init__(self, *args, **kwargs):
        kwargs.pop('quantization_config', None)
        super().__init__(*args, **kwargs)


def get_model():
    global model
    if model is None:
        model = load_model(MODEL_PATH, compile=False, custom_objects={'Dense': CompatDense})
    return model


@app.get('/api/health')
def health():
    return jsonify({'status': 'ok', 'modelLoaded': model is not None})


@app.post('/api/predict')
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'Missing image file in request field "image"'}), 400

    image_file = request.files['image']

    try:
        loaded_model = get_model()
        batch = preprocess_image(image_file)
        predictions = loaded_model.predict(batch, verbose=0)[0]
        class_index = int(np.argmax(predictions))
        confidence = float(predictions[class_index])
        category = CLASS_NAMES[class_index] if class_index < len(CLASS_NAMES) else f'Class {class_index}'
        class_label = CLASS_LABELS[class_index] if class_index < len(CLASS_LABELS) else f'{class_index + 1}'

        if category not in AQI_CATEGORIES:
            return jsonify({'error': f'Unsupported predicted class: {category}'}), 500

        result = build_result(category, confidence, class_label)

        return jsonify(result)
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', '8000'))
    app.run(host='0.0.0.0', port=port, debug=True)
