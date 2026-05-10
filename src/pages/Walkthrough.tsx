import { Upload, Cpu, BarChart3, Heart, Shield, Lightbulb, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload an Image',
    description: 'Drag and drop or browse to upload a photo of the sky, landscape, or urban environment. Supported formats include JPG, PNG, and WebP.',
    tip: 'For best results, use images with visible sky or atmospheric conditions.',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
  },
  {
    icon: Cpu,
    title: 'AI Model Processing',
    description: 'Our trained Keras deep learning model analyzes the image features including color patterns, haze levels, and visual clarity to determine air quality conditions.',
    tip: 'The model processes the image through multiple convolutional layers to extract atmospheric features.',
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'bg-teal-50',
  },
  {
    icon: BarChart3,
    title: 'AQI Prediction',
    description: 'The model outputs a predicted AQI category (Good, Moderate, Unhealthy, etc.) along with a confidence score indicating prediction reliability.',
    tip: 'Higher confidence scores indicate more reliable predictions.',
    color: 'from-cyan-500 to-sky-500',
    bgColor: 'bg-cyan-50',
  },
  {
    icon: Heart,
    title: 'Health Insights',
    description: 'Based on the predicted AQI level, the system provides health implications and recommendations for outdoor activities.',
    tip: 'Sensitive groups should pay special attention to AQI levels above 100.',
    color: 'from-sky-500 to-blue-500',
    bgColor: 'bg-sky-50',
  },
];

const aqiScale = [
  { range: '0 - 50', category: 'Good', color: '#22c55e', desc: 'Air quality is satisfactory, and air pollution poses little or no risk.' },
  { range: '51 - 100', category: 'Moderate', color: '#eab308', desc: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive.' },
  { range: '101 - 150', category: 'Unhealthy for Sensitive Groups', color: '#f97316', desc: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.' },
  { range: '151 - 200', category: 'Unhealthy', color: '#ef4444', desc: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.' },
  { range: '201 - 300', category: 'Very Unhealthy', color: '#a855f7', desc: 'Health alert: The risk of health effects is increased for everyone.' },
  { range: '301 - 500', category: 'Hazardous', color: '#991b1b', desc: 'Health warning of emergency conditions: everyone is more likely to be affected.' },
];

export default function Walkthrough() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold mb-4">
          <Lightbulb className="w-3.5 h-3.5" />
          How It Works
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
          System <span className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">Walkthrough</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
          Understand how our Smart AQI Monitoring System works, from image upload to health recommendations.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-6 mb-16">
        {steps.map((step, idx) => (
          <div key={step.title} className="relative">
            <div className="flex items-start gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              {/* Step Number + Icon */}
              <div className="shrink-0 flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold text-slate-300">STEP {idx + 1}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-3">{step.description}</p>
                <div className={`${step.bgColor} rounded-lg p-3 border border-slate-100`}>
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-teal-700 leading-relaxed">{step.tip}</p>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              {idx < steps.length - 1 && (
                <div className="hidden sm:flex items-center shrink-0">
                  <ArrowRight className="w-5 h-5 text-slate-200" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AQI Scale Reference */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">AQI Scale Reference</h2>
        <p className="text-sm text-slate-400 text-center mb-8">Understanding the Air Quality Index categories</p>

        <div className="grid gap-3">
          {aqiScale.map((item) => (
            <div
              key={item.category}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/70 backdrop-blur border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="shrink-0 w-20 text-center py-2 rounded-lg text-white text-sm font-bold"
                style={{ backgroundColor: item.color }}
              >
                {item.range}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 mb-0.5">{item.category}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
