import React from 'react';
import { Brain, Lightbulb, TrendingUp, Target, Zap } from 'lucide-react';

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-3">
            <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
      
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start">
            <div className="w-5 h-5 bg-gray-200 rounded-full mr-3 mt-0.5"></div>
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GeneratingLoader({ status }: { status: string }) {
  const icons = [Brain, Lightbulb, TrendingUp, Target];
  const [currentIcon, setCurrentIcon] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = icons[currentIcon];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <CurrentIcon className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Zap className="w-8 h-8 text-yellow-500 animate-bounce" />
          </div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full animate-ping"
                style={{
                  left: `${20 + (i * 15)}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          AI is Crafting Your Ideas
        </h2>
        <p className="text-gray-600 mb-2">
          Analyzing your unique profile and market opportunities...
        </p>
        <p className="text-blue-600 font-medium mb-8 min-h-[24px] transition-all duration-300">
          {status}
        </p>
        
        {/* Progress animation */}
        <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
        
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" 
              style={{animationDelay: `${i * 0.2}s`}}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function StepTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  );
}