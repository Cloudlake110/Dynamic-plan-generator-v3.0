import React from 'react';
import { StudyPlanModule } from '../types';
import { CheckCircle2, AlertTriangle, Zap, BookOpen, Wrench, ArrowRight } from 'lucide-react';

interface Props {
  module: StudyPlanModule;
  index: number;
}

const PlanCard: React.FC<Props> = ({ module, index }) => {
  const getIcon = () => {
    if (module.id === 'm1') return <Zap size={18} />;
    if (module.id === 'm2') return <BookOpen size={18} />;
    if (module.id === 'survival') return <AlertTriangle size={18} />;
    if (module.id === 'm3') return <CheckCircle2 size={18} />;
    return <BookOpen size={18} />;
  };

  return (
    <div className="relative pl-8 pb-8 border-l-2 border-slate-700 last:border-0 last:pb-0">
      {/* Timeline Dot */}
      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-slate-900 ${module.color} shadow-[0_0_8px_currentColor]`}></div>
      
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-500 transition-colors group">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-md bg-slate-900 ${module.color.replace('bg-', 'text-')}`}>
              {getIcon()}
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-200">{module.title}</h3>
              <p className="text-xs text-slate-400 font-mono">{module.dateRange}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold bg-slate-900 px-2 py-1 rounded text-slate-300">
              {module.hoursAllocated}h
            </span>
          </div>
        </div>

        {/* Subtitle / Focus */}
        <div className="mb-3">
          <span className="text-xs uppercase tracking-wider text-cyan-500 font-bold">
            [{module.subTitle}]
          </span>
        </div>

        {/* Dynamic Progress/Items */}
        <div className="space-y-2 mb-4">
          {module.items.map((item, idx) => {
            const isTheory = item.includes('理论法规');
            return (
              <div key={idx} className={`flex items-center text-xs ${isTheory ? 'text-amber-300' : 'text-slate-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${isTheory ? 'bg-amber-400' : module.color} opacity-70`}></div>
                <span>{item}</span>
              </div>
            );
          })}
        </div>

        {/* Ecosystem Tools */}
        {module.tools && module.tools.length > 0 && (
          <div className="mb-3 border-t border-slate-700/50 pt-3">
             <div className="flex items-center gap-2 mb-2">
               <Wrench size={12} className="text-slate-500" />
               <span className="text-[10px] font-bold text-slate-500 uppercase">推荐武器</span>
             </div>
             <div className="flex flex-wrap gap-2">
               {module.tools.map((tool, tIdx) => (
                 <span key={tIdx} className="inline-flex items-center gap-1 text-[10px] bg-slate-900 border border-slate-600 text-cyan-400 px-2 py-1 rounded hover:bg-slate-800 cursor-pointer transition-colors">
                   {tool}
                   <ArrowRight size={8} />
                 </span>
               ))}
             </div>
          </div>
        )}

        {/* SOP Note */}
        {module.notes && (
          <div className={`mt-2 p-2 rounded text-[10px] leading-relaxed border-l-2 ${module.id === 'survival' ? 'bg-red-900/20 border-red-500 text-red-200' : 'bg-slate-900/50 border-cyan-500/50 text-cyan-100'}`}>
            <span className="font-bold mr-1">SOP:</span>
            {module.notes}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanCard;