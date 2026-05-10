import { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Image, Loader2, Sparkles, Wind, BarChart3, Camera } from 'lucide-react';
import ResultCard from '../components/ResultCard';
import { predictFromFile } from '../services/aqi';
import type { AQIResult } from '../services/aqi';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [result, setResult] = useState<AQIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setErrorMessage('');
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }, [handleFile]);

  useEffect(() => {
    let cancelled = false;

    const checkBackend = async () => {
      try {
        const response = await fetch('/api/health');
        if (!response.ok) throw new Error('Backend health check failed');
        if (!cancelled) setServiceStatus('ready');
      } catch {
        if (!cancelled) {
          setServiceStatus('error');
          setErrorMessage('Start the Python backend to enable predictions.');
        }
      }
    };

    checkBackend();

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePredict = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setErrorMessage('');

    try {
      setServiceStatus('loading');
      const res = await predictFromFile(file);
      setResult(res);
      setServiceStatus('ready');
    } catch (err) {
      console.error(err);
      setServiceStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Prediction service is unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview('');
    setResult(null);
    setErrorMessage('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Intelligent Visual Air Quality Assessment System
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
          Smart AQI <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Monitoring</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
          Upload an image of the sky or environment and our AI model will analyze air quality conditions in real-time.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Camera, title: 'Upload Image', desc: 'Drag & drop or browse' },
          { icon: Wind, title: 'AI Analysis', desc: 'Deep learning prediction' },
          { icon: BarChart3, title: 'AQI Report', desc: 'Detailed health insights' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3 p-4 rounded-xl bg-white/70 backdrop-blur border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{title}</p>
              <p className="text-xs text-slate-400">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Area */}
      {!result && (
        <div className="mb-8">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
              dragOver
                ? 'border-emerald-400 bg-emerald-50/50 scale-[1.01]'
                : preview
                  ? 'border-emerald-200 bg-white/60'
                  : 'border-slate-200 bg-white/50 hover:border-emerald-300 hover:bg-emerald-50/30'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />

            {preview ? (
              <div className="p-4">
                <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); reset(); }}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs font-medium hover:bg-black/80 transition-colors backdrop-blur-sm"
                  >
                    Remove
                  </button>
                </div>
                <p className="mt-3 text-sm text-slate-500 text-center truncate">{file?.name}</p>
              </div>
            ) : (
              <div className="p-10 sm:p-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-emerald-600" />
                </div>
                <p className="text-base font-semibold text-slate-700 mb-1">Drop your image here</p>
                <p className="text-sm text-slate-400">or click to browse files</p>
                <p className="text-xs text-slate-300 mt-3">Supports JPG, PNG, WebP</p>
              </div>
            )}
          </div>

          {/* Predict Button */}
          {file && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handlePredict}
                disabled={loading}
                className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Image className="w-5 h-5" />
                    Analyze AQI
                  </>
                )}
              </button>
            </div>
          )}

          {/* Model Status */}
          {serviceStatus !== 'idle' && (
            <div className="mt-4 text-center">
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${
                serviceStatus === 'loading' ? 'bg-amber-50 text-amber-600' :
                serviceStatus === 'ready' ? 'bg-emerald-50 text-emerald-600' :
                'bg-rose-50 text-rose-600'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  serviceStatus === 'loading' ? 'bg-amber-400 animate-pulse' :
                  serviceStatus === 'ready' ? 'bg-emerald-400' :
                  'bg-rose-400'
                }`} />
                {serviceStatus === 'loading' ? 'Calling backend model...' :
                 serviceStatus === 'ready' ? 'Backend model ready' :
                 'Backend unavailable'}
              </span>
            </div>
          )}

          {errorMessage && (
            <p className="mt-3 text-center text-sm text-rose-600">{errorMessage}</p>
          )}
        </div>
      )}

      {/* Result */}
      {result && preview && (
        <div className="space-y-6">
          <ResultCard result={result} imageUrl={preview} imageName={file?.name || ''} />
          <div className="flex justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              Analyze Another Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
