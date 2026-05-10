export interface PollutantLevel {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'moderate' | 'unhealthy' | 'hazardous';
  color: string;
}

export interface AQIResult {
  classLabel: string;
  category: string;
  confidence: number;
  color: string;
  description: string;
  healthImplication: string;
  sensitiveGroups: string[];
  recommendations: string[];
  outdoorActivity: string;
  maskRequired: boolean;
  ventilationAdvice: string;
}

export const AQI_CATEGORIES: Record<string, {
  min: number;
  max: number;
  color: string;
  description: string;
  healthImplication: string;
  primaryPollutant: string;
  sensitiveGroups: string[];
  recommendations: string[];
  outdoorActivity: string;
  maskRequired: boolean;
  ventilationAdvice: string;
}> = {
  'Good': {
    min: 0, max: 50, color: '#22c55e',
    description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    healthImplication: 'Air quality is considered satisfactory, and air pollution poses little or no risk. No health concerns are associated with this level.',
    primaryPollutant: 'PM2.5 or O3',
    sensitiveGroups: [],
    recommendations: [
      'Enjoy outdoor activities freely',
      'Great day for jogging, cycling, or walking in the park',
      'Open windows to let fresh air circulate indoors',
      'No protective measures needed',
    ],
    outdoorActivity: 'Ideal for all outdoor activities',
    maskRequired: false,
    ventilationAdvice: 'Open windows and doors for natural ventilation',
  },
  'Moderate': {
    min: 51, max: 100, color: '#eab308',
    description: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive.',
    healthImplication: 'Moderate air quality may cause respiratory symptoms in unusually sensitive individuals. The general public is not likely to be affected at this AQI range.',
    primaryPollutant: 'PM2.5 or O3',
    sensitiveGroups: ['Children', 'Elderly', 'People with respiratory conditions'],
    recommendations: [
      'Sensitive groups should consider reducing prolonged outdoor exertion',
      'Take breaks during outdoor exercise',
      'Watch for symptoms like coughing or shortness of breath',
      'Keep rescue medications accessible if you have asthma',
    ],
    outdoorActivity: 'Generally safe; sensitive groups should take precautions',
    maskRequired: false,
    ventilationAdvice: 'Normal ventilation is fine; consider air purifier for sensitive individuals',
  },
  'Unhealthy for Sensitive Groups': {
    min: 101, max: 150, color: '#f97316',
    description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
    healthImplication: 'People with respiratory diseases such as asthma, children, and the elderly may experience health effects. The general public is unlikely to be affected at this AQI range.',
    primaryPollutant: 'PM2.5, O3, or NO2',
    sensitiveGroups: ['Children', 'Elderly', 'People with asthma', 'People with heart disease', 'Outdoor workers'],
    recommendations: [
      'Sensitive groups should reduce prolonged outdoor exertion',
      'Consider moving activities indoors or rescheduling',
      'Use an N95 mask if prolonged outdoor exposure is necessary',
      'Run air purifiers indoors on high settings',
      'Keep windows closed during peak pollution hours',
    ],
    outdoorActivity: 'Limit prolonged outdoor activity; sensitive groups should stay indoors',
    maskRequired: false,
    ventilationAdvice: 'Limit natural ventilation; use air purifiers with HEPA filters',
  },
  'Unhealthy': {
    min: 151, max: 200, color: '#ef4444',
    description: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
    healthImplication: 'Everyone may begin to experience health effects such as irritation, breathing difficulty, and aggravated respiratory conditions. Sensitive groups may experience more severe effects.',
    primaryPollutant: 'PM2.5, PM10, O3, or NO2',
    sensitiveGroups: ['Children', 'Elderly', 'People with asthma', 'People with heart disease', 'Outdoor workers', 'Pregnant women'],
    recommendations: [
      'Everyone should reduce outdoor exertion',
      'Avoid jogging, cycling, and other strenuous outdoor activities',
      'Wear an N95 mask when going outside',
      'Keep all windows and doors closed',
      'Run air purifiers continuously on high settings',
      'Stay hydrated and monitor for symptoms',
    ],
    outdoorActivity: 'Avoid outdoor activities; exercise indoors only',
    maskRequired: true,
    ventilationAdvice: 'Keep windows closed; rely on air purifiers and recirculated air',
  },
  'Very Unhealthy': {
    min: 201, max: 300, color: '#dc2626',
    description: 'Health alert: everyone may experience more serious health effects.',
    healthImplication: 'Health alert! Everyone may experience more serious health effects including significant respiratory irritation, aggravated heart and lung disease, and potential cardiovascular and respiratory damage.',
    primaryPollutant: 'PM2.5, PM10, SO2, or CO',
    sensitiveGroups: ['Everyone is at risk', 'Especially children, elderly, and those with pre-existing conditions'],
    recommendations: [
      'Avoid all outdoor physical activities',
      'Stay indoors with windows and doors sealed',
      'Wear N95 masks even for brief outdoor exposure',
      'Run multiple air purifiers if available',
      'Monitor air quality updates frequently',
      'Seek medical attention if experiencing breathing difficulty',
      'Consider relocating temporarily if possible',
    ],
    outdoorActivity: 'Avoid all outdoor activities; stay indoors',
    maskRequired: true,
    ventilationAdvice: 'Seal all windows; use air purifiers on maximum settings; avoid any outdoor air intake',
  },
  'Hazardous': {
    min: 301, max: 500, color: '#991b1b',
    description: 'Health warning of emergency conditions: everyone is more likely to be affected.',
    healthImplication: 'Health warning of emergency conditions! The entire population is likely to be affected with serious, potentially life-threatening health effects. Immediate precautions are necessary.',
    primaryPollutant: 'PM2.5, PM10, SO2, CO, or NO2',
    sensitiveGroups: ['Everyone is at serious risk'],
    recommendations: [
      'Emergency conditions: stay indoors at all times',
      'Seal all windows, doors, and any air gaps',
      'Wear N95 masks even indoors if air quality is compromised',
      'Run all available air purifiers on maximum',
      'Avoid any physical exertion',
      'Seek medical attention for any respiratory symptoms',
      'Follow emergency broadcast instructions',
      'Consider evacuation if conditions persist',
    ],
    outdoorActivity: 'No outdoor activity under any circumstances',
    maskRequired: true,
    ventilationAdvice: 'Complete seal of all openings; use multiple air purifiers; consider creating a clean room',
  },
};

export async function predictFromFile(file: File): Promise<AQIResult> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/predict', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null) as { detail?: string; error?: string } | null;
    const message = errorBody?.detail || errorBody?.error || `Prediction request failed (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<AQIResult>;
}

