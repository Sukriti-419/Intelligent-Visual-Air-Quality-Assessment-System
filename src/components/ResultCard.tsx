import { useEffect, useState } from 'react';
import { Gauge, AlertCircle, Shield, Activity, Wind, CheckCircle } from 'lucide-react';
import type { AQIResult } from '../services/aqi';

interface Props {
  result: AQIResult;
  imageUrl: string;
  imageName: string;
}

function getAqiIcon(category: string) {
  const colors: Record<string, string> = {
    'Good': '#22c55e',
    'Moderate': '#eab308',
    'Unhealthy for Sensitive Groups': '#f97316',
    'Unhealthy': '#ef4444',
    'Very Unhealthy': '#dc2626',
    'Hazardous': '#991b1b',
  };
  return colors[category] || '#64748b';
}

export default function ResultCard({ result, imageUrl, imageName }: Props) {
  const [visible, setVisible] = useState(false);
  const color = getAqiIcon(result.category);
  const confidencePercent = (result.confidence * 100).toFixed(1);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Main Result Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/60 overflow-hidden">
        {/* Top Banner */}
        <div
          className="relative px-6 sm:px-8 py-8 text-white overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${color}dd, ${color}99)` }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          
          <div className="relative">
            <p className="text-sm font-medium text-white/80 mb-2">VGG16 Model Prediction</p>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
                Class {result.classLabel}
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold">{result.category}</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              <p className="text-xl font-bold">Confidence: {confidencePercent}%</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Image Preview */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Analyzed Image</p>
            <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-[4/3] shadow-sm">
              <img src={imageUrl} alt={imageName} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-xs text-white/90 truncate">{imageName}</p>
              </div>
            </div>
          </div>

          {/* Confidence Bar */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Model Confidence</p>
            <div className="relative">
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-1000 ease-out"
                  style={{ width: `${result.confidence * 100}%`, backgroundColor: color }}
                />
              </div>
              <p className="text-sm font-bold text-slate-700 mt-2">{confidencePercent}%</p>
            </div>
          </div>

          {/* Health Implications */}
          <div className="space-y-3 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-slate-700" />
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Health Impact</p>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{result.healthImplication}</p>
          </div>

          {/* Sensitive Groups */}
          {result.sensitiveGroups.length > 0 && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-700" />
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vulnerable Groups</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.sensitiveGroups.map((group, idx) => (
                  <span key={idx} className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-200">
                    • {group}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Outdoor Activity */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-700" />
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Outdoor Activity</p>
            </div>
            <p className="text-sm text-slate-700 font-medium">{result.outdoorActivity}</p>
          </div>

          {/* Mask Required */}
          <div className="space-y-3 pt-4 flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: result.maskRequired ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)' }}>
            {result.maskRequired ? (
              <>
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-700">N95 Mask Required</p>
                  <p className="text-xs text-red-600">Wear protective masks for any outdoor exposure</p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-green-700">No Mask Required</p>
                  <p className="text-xs text-green-600">Air quality is safe for normal outdoor activities</p>
                </div>
              </>
            )}
          </div>

          {/* Ventilation Advice */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-slate-700" />
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ventilation Advice</p>
            </div>
            <p className="text-sm text-slate-700">{result.ventilationAdvice}</p>
          </div>

          {/* Recommendations */}
          <div className="space-y-3 pt-6 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recommendations</p>
            <ul className="space-y-2">
              {result.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-700">
                  <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 rounded-full font-bold text-xs" style={{ backgroundColor: color, color: 'white' }}>
                    {idx + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
