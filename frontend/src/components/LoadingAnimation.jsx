import { motion } from 'framer-motion';
import { Database, BrainCircuit, Activity, Zap, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

const steps = [
  { icon: Database, text: 'Analyzing query structure...' },
  { icon: Activity, text: 'Detecting bottlenecks & full scans...' },
  { icon: BrainCircuit, text: 'Generating optimized execution path...' },
  { icon: Zap, text: 'Finalizing rewrite & extracting indexes...' },
];

export default function LoadingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bg-[#0a0d14] rounded-2xl border border-white/8 flex flex-col items-center justify-center p-8 shadow-2xl min-h-[620px]">

      {/* Spinner */}
      <div className="relative w-20 h-20 mb-10">
        <motion.div
          className="absolute inset-0 border-2 border-blue-500/15 rounded-full"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-2 border-2 border-t-blue-500 border-r-blue-400 border-b-transparent border-l-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <BrainCircuit className="w-7 h-7 text-blue-400" />
        </div>
      </div>

      <p className="text-sm font-semibold text-slate-400 mb-8 tracking-wide">AI is analyzing your query...</p>

      {/* Steps */}
      <div className="space-y-3 w-full max-w-xs">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isPast = index < currentStep;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: isActive || isPast ? 1 : 0.25,
                x: isActive || isPast ? 0 : -10,
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                isActive
                  ? 'bg-blue-500/8 border-blue-500/20'
                  : isPast
                  ? 'bg-emerald-500/5 border-emerald-500/15'
                  : 'bg-transparent border-transparent'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isActive ? 'bg-blue-500/15 text-blue-400' :
                isPast ? 'bg-emerald-500/15 text-emerald-400' :
                'bg-white/4 text-slate-600'
              }`}>
                {isPast
                  ? <Check className="w-4 h-4" />
                  : <step.icon className="w-4 h-4" />
                }
              </div>
              <span className={`text-xs font-medium ${
                isActive ? 'text-blue-300' :
                isPast ? 'text-emerald-400' :
                'text-slate-600'
              }`}>
                {step.text}
              </span>
              {isActive && (
                <div className="ml-auto flex gap-0.5">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 rounded-full bg-blue-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
