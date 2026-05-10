# Backend Connection Setup Guide

## Overview

Your backend is now configured to:
1. **Load the AI model** - VGG16 for air pollution classification
2. **Expose REST API** - For frontend integration

## Installation

```bash
cd backend
pip install -r requirements.txt
```

## API Endpoints

### 1. Health Check
```
GET /api/health
```
Response:
```json
{
  "status": "ok",
  "modelLoaded": true
}
```

### 2. Predict Air Quality
```
POST /api/predict
Content-Type: multipart/form-data

image: <image_file>
```

Response:
```json
{
  "category": "Good",
  "confidence": 0.95,
  "aqiValue": 45,
  "color": "#22c55e",
  "description": "Air quality is satisfactory...",
  "healthImplication": "...",
  "primaryPollutant": "PM2.5 or O3",
  "pollutants": [...],
  "sensitiveGroups": [],
  "recommendations": [...],
  "outdoorActivity": "Ideal for all outdoor activities",
  "maskRequired": false,
  "ventilationAdvice": "..."
}
```

## How It Works

1. **Frontend sends image** → POST /api/predict with image file
2. **Backend processes** → Loads model, preprocesses image, makes prediction
3. **Returns results** → JSON response with AQI details
4. **Frontend displays** → User sees prediction with recommendations

## Running the Server

```bash
cd backend
python app.py
```

Server will run on `http://localhost:8000`

## Key Features

- ✅ CORS enabled for frontend communication
- ✅ Error handling for missing images
- ✅ Image preprocessing (224x224 normalization)
- ✅ Detailed health recommendations by AQI category

## Comparison with Reference Repository

**Reference repo (nileshparab42/Air-Pollution-Classification):**
- Simple Flask app, no database
- Just loads model and predicts
- Returns basic prediction

**Your setup:**
- Flask API integration
- Returns detailed AQI information
- Better UX with richer AQI insights
