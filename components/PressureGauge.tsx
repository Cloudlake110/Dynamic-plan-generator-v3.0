import React from 'react';

interface Props {
  pressure: number;
  level: 'easy' | 'medium' | 'high' | 'survival';
}

const PressureGauge: React.FC<Props> = ({ pressure, level }) => {
  // Clamp pressure 0-100 for visual consistency, though logic allows >100
  const visualPressure = Math.min(100, Math.max(0, pressure));
  const rotation = (visualPressure / 100) * 180 - 90; // -90deg to 90deg

  const getColor = () => {
    switch (level) {
      case 'easy': return '#3b82f6'; // Blue
      case 'medium': return '#22c55e'; // Green
      case 'high': return '#f97316'; // Orange
      case 'survival': return '#ef4444'; // Red
    }
  };

  const color = getColor();
  const glowClass = level === 'survival' ? 'animate-pulse' : '';

  return (
    <div className="relative w-64 h-32 mx-auto mb-4 overflow-hidden">
      {/* Background Arc */}
      <div className="absolute top-0 left-0 w-full h-64 rounded-full border-[12px] border-slate-800 border-b-0 box-border"></div>
      
      {/* Dynamic Arc */}
      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 200 100">
        <path 
          d="M 20 100 A 80 80 0 0 1 180 100" 
          fill="none" 
          stroke="#1e293b" 
          strokeWidth="20" 
          strokeLinecap="round"
        />
        <path 
          d="M 20 100 A 80 80 0 0 1 180 100" 
          fill="none" 
          stroke={color} 
          strokeWidth="20" 
          strokeLinecap="round"
          strokeDasharray="251.2"
          strokeDashoffset={251.2 - (251.2 * (visualPressure / 100))}
          className={`transition-all duration-1000 ease-out ${glowClass}`}
        />
      </svg>

      {/* Needle */}
      <div 
        className="absolute bottom-0 left-1/2 w-1 h-28 bg-white origin-bottom rounded-full shadow-[0_0_10px_white] transition-transform duration-700 ease-out z-10"
        style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
      >
        <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-white rounded-full"></div>
      </div>

      {/* Center Cap */}
      <div className="absolute bottom-[-8px] left-1/2 w-8 h-8 bg-slate-200 rounded-full transform -translate-x-1/2 z-20 border-4 border-slate-900"></div>

      {/* Labels */}
      <div className="absolute bottom-2 left-4 text-xs font-mono text-slate-500">0%</div>
      <div className="absolute bottom-2 right-4 text-xs font-mono text-slate-500">100%</div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className={`text-2xl font-bold font-mono transition-colors duration-300`} style={{ color }}>
          {pressure > 100 ? '爆表' : pressure}
        </div>
        <div className="text-[10px] uppercase tracking-widest text-slate-400">压力值</div>
      </div>
    </div>
  );
};

export default PressureGauge;