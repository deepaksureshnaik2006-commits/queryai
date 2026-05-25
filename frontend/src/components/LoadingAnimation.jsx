import { motion } from 'framer-motion';
import { Loader2, Database, BrainCircuit, Activity, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

const steps = [
  { icon: Database, text: 'Analyzing query structure...' },
  { icon: Activity, text: 'Detecting bottlenecks & full scans...' },
  { icon: BrainCircuit, text: 'Generating optimized execution path...' },
  { icon: Zap, text: 'Finalizing rewrite & extracting indexes...' }
];

export default function LoadingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000); // Change step every 2s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bg-[#0f111a] rounded-2xl border border-gray-800 flex flex-col items-center justify-center p-8 shadow-2xl backdrop-blur-xl min-h-[600px]">
      <div className="relative w-24 h-24 mb-12">
        <motion.div 
          className="absolute inset-0 border-4 border-blue-500/20 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="absolute inset-2 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <BrainCircuit className="w-8 h-8 text-blue-400" />
        </div>
      </div>

      <div className="space-y-6 w-full max-w-sm">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isPast = index < currentStep;
          
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isActive || isPast ? 1 : 0.3, x: isActive || isPast ? 0 : -20 }}
              className={`flex items-center gap-4 p-4 rounded-xl border ${isActive ? 'bg-blue-500/10 border-blue-500/30' : isPast ? 'bg-green-500/5 border-green-500/20' : 'bg-transparent border-transparent'}`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500/20 text-blue-400' : isPast ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-600'}`}>
                {isPast ? <Zap className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
              </div>
              <span className={`font-semibold text-sm ${isActive ? 'text-blue-100' : isPast ? 'text-green-400' : 'text-gray-600'}`}>
                {step.text}
              </span>
              {isActive && (
                <Loader2 className="w-4 h-4 animate-spin text-blue-500 ml-auto" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
