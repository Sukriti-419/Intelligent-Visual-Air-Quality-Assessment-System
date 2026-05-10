import { Wind, Brain, Database, Shield, Globe, Users, Target, Zap } from 'lucide-react';

const team = [
  { name: 'AI Research Team', role: 'Model Development & Training', icon: Brain },
  { name: 'Engineering Team', role: 'System Architecture & Deployment', icon: Zap },
  { name: 'Environmental Scientists', role: 'Domain Expertise & Validation', icon: Globe },
];

const values = [
  { icon: Target, title: 'Accuracy', desc: 'Rigorous model training and validation to ensure reliable AQI predictions.' },
  { icon: Shield, title: 'Transparency', desc: 'Clear confidence scores and explainable results for every prediction.' },
  { icon: Globe, title: 'Accessibility', desc: 'Making air quality monitoring available to everyone, everywhere.' },
  { icon: Users, title: 'Community', desc: 'Building tools that empower communities to take action on air quality.' },
];

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
          <Users className="w-3.5 h-3.5" />
          Our Story
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
          About <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Smart AQI</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          We are a team of AI researchers, engineers, and environmental scientists dedicated to making air quality monitoring accessible, accurate, and actionable through cutting-edge deep learning technology.
        </p>
      </div>

      {/* Mission */}
      <div className="relative mb-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <Wind className="w-10 h-10 mb-4 text-emerald-200" />
          <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
          <p className="text-emerald-100 leading-relaxed max-w-2xl">
            To democratize air quality monitoring by leveraging deep learning and computer vision, enabling anyone with a smartphone to assess air quality conditions from a simple photograph. We believe that access to clean air information is a fundamental right, and our technology makes it possible.
          </p>
        </div>
      </div>

      {/* How It's Built */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">How It's Built</h2>
        <p className="text-sm text-slate-400 text-center mb-8">The technology behind Smart AQI</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Brain,
              title: 'Deep Learning Model',
              desc: 'A Keras-based convolutional neural network trained on thousands of labeled atmospheric images to classify AQI categories with high accuracy.',
            },
            {
              icon: Database,
              title: 'Comprehensive Dataset',
              desc: 'Our model was trained on a diverse dataset of environmental images paired with ground-truth AQI measurements from monitoring stations.',
            },
            {
              icon: Shield,
              title: 'Validated Results',
              desc: 'Every prediction includes a confidence score, and our model has been validated against EPA standards for air quality classification.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-5 rounded-xl bg-white/70 backdrop-blur border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-2">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Our Values</h2>
        <p className="text-sm text-slate-400 text-center mb-8">What drives us forward</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 p-5 rounded-xl bg-white/70 backdrop-blur border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Our Team</h2>
        <p className="text-sm text-slate-400 text-center mb-8">The people behind the project</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {team.map(({ name, role, icon: Icon }) => (
            <div key={name} className="p-6 rounded-xl bg-white/70 backdrop-blur border border-slate-100 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-3">
                <Icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">{name}</h3>
              <p className="text-xs text-slate-400">{role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
