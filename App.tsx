import React, { useState, useEffect, useMemo } from 'react';
import { Settings, Share2, Copy, AlertOctagon, Activity, Home } from 'lucide-react';
import PressureGauge from './components/PressureGauge';
import PlanCard from './components/PlanCard';
import { UserInput, PlanState } from './types';
import { calculatePlan } from './services/planGenerator';
import { SELF_TEST_QUESTIONS } from './constants';

const PORTAL_URL = "https://ai-trainer-porama-system.vercel.app/";

const PortalButton = () => (
  <a
    href={PORTAL_URL}
    className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:-translate-y-1 group flex items-center gap-0 hover:gap-2 overflow-hidden border border-white/20"
    title="返回备考系统门户"
  >
    <Home className="w-6 h-6" />
    <span className="max-w-0 group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap opacity-0 group-hover:opacity-100 text-sm font-bold">
      返回门户
    </span>
  </a>
);

const App: React.FC = () => {
  // State
  const [daysRemaining, setDaysRemaining] = useState<number>(30);
  const [dailyHours, setDailyHours] = useState<number>(4);
  const [level, setLevel] = useState<UserInput['level']>('intermediate');
  const [selfTest, setSelfTest] = useState<UserInput['selfTest']>({
    knowsContainers: false,
    knowsSyntax: false,
    knowsNormalization: false,
  });
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  // Derived State (Real-time Calculation)
  const planData: PlanState = useMemo(() => {
    return calculatePlan({
      daysRemaining,
      dailyHours,
      level,
      selfTest
    });
  }, [daysRemaining, dailyHours, level, selfTest]);

  // Effects
  useEffect(() => {
    if (planData.pressureLevel === 'survival' && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(200);
    }
  }, [planData.pressureLevel]);

  const toggleSelfTest = (key: keyof UserInput['selfTest']) => {
    setSelfTest(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyPlan = () => {
    const text = `
=== AI 备考指挥中枢 v3.0 ===
总精力池：${planData.totalEnergy} 小时
压力等级：${getPressureLabel(planData.pressureLevel)}
指挥官建议：${planData.recommendation}

${planData.modules.map(m => `
[${m.title}]
重点：${m.subTitle} (${m.dateRange})
任务：
${m.items.map(i => `  - ${i}`).join('\n')}
${m.tools ? `🛠 调用工具：${m.tools.join(', ')}` : ''}
`).join('\n')}
========================================
注意：遇到报错请优先调用 Code Doctor，切勿手动排查超过 10 分钟。
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    });
  };

  const getPressureLabel = (level: string) => {
    switch (level) {
      case 'easy': return '游刃有余';
      case 'medium': return '适中';
      case 'high': return '极度高压';
      case 'survival': return '生存模式';
      default: return level;
    }
  };

  const getLevelLabel = (lvl: UserInput['level']) => {
     switch (lvl) {
        case 'beginner': return '小白';
        case 'intermediate': return '有基础';
        case 'sprint': return '高手/冲刺';
     }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-12">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0f172a]/95 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-cyan-500 flex items-center justify-center text-slate-900 font-bold">
              AI
            </div>
            <h1 className="font-bold text-lg tracking-tight text-white">
              Plan<span className="text-cyan-500">Gen</span>
              <span className="text-xs ml-2 text-slate-500 font-mono px-2 py-0.5 border border-slate-700 rounded-full">v3.0 Command</span>
            </h1>
          </div>
          <button 
            onClick={handleCopyPlan}
            className="flex items-center gap-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded transition-all active:scale-95"
          >
            {showCopySuccess ? (
              <span className="text-green-400">已提取!</span>
            ) : (
              <>
                <Copy size={14} />
                <span className="hidden sm:inline">导出指令集</span>
              </>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 grid md:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Controls & Gauge */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Dashboard Card */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
            
            <div className="mb-6 text-center">
              <h2 className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-4">实时压力表</h2>
              <PressureGauge pressure={planData.pressure} level={planData.pressureLevel} />
              
              <div className="mt-4 p-3 bg-slate-900/60 rounded border border-slate-700/50 text-left">
                 <div className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1">
                   <Activity size={10} /> 智能简报
                 </div>
                 <p className="text-xs text-cyan-100 leading-relaxed">
                   {planData.recommendation}
                 </p>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              {/* Level Selector */}
              <div>
                <label className="text-xs font-bold text-slate-400 mb-2 block">当前水平</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['beginner', 'intermediate', 'sprint'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLevel(lvl)}
                      className={`py-2 px-1 rounded text-[10px] font-bold uppercase transition-all border ${
                        level === lvl 
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                          : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'
                      }`}
                    >
                      {getLevelLabel(lvl)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lightning Rod Self-Test */}
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                 <label className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
                   <AlertOctagon size={12} className="text-yellow-500" />
                   避雷针自测 (动态调权)
                 </label>
                 <div className="space-y-3">
                   {SELF_TEST_QUESTIONS.map((q) => (
                     <label key={q.id} className="flex items-start gap-3 cursor-pointer group">
                       <div className={`mt-0.5 w-4 h-4 border rounded flex items-center justify-center transition-colors ${selfTest[q.id as keyof UserInput['selfTest']] ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600 bg-slate-800'}`}>
                         <input 
                           type="checkbox" 
                           className="hidden"
                           checked={selfTest[q.id as keyof UserInput['selfTest']]}
                           onChange={() => toggleSelfTest(q.id as keyof UserInput['selfTest'])}
                         />
                         {selfTest[q.id as keyof UserInput['selfTest']] && <span className="text-white text-[10px]">✓</span>}
                       </div>
                       <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{q.label}</span>
                     </label>
                   ))}
                 </div>
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div>
                    <div className="flex justify-between mb-1">
                    <label className="text-xs font-bold text-cyan-400">剩余天数</label>
                    <span className="text-xs font-mono text-white">{daysRemaining}天</span>
                    </div>
                    <input 
                    type="range" 
                    min="1" 
                    max="60" 
                    value={daysRemaining}
                    onChange={(e) => setDaysRemaining(Number(e.target.value))}
                    className="w-full cyber-input"
                    />
                </div>
                <div>
                    <div className="flex justify-between mb-1">
                    <label className="text-xs font-bold text-cyan-400">每日时长</label>
                    <span className="text-xs font-mono text-white">{dailyHours}小时</span>
                    </div>
                    <input 
                    type="range" 
                    min="1" 
                    max="12" 
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    className="w-full cyber-input"
                    />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Plan Feed */}
        <div className="md:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-cyan-500 rounded-full"></span>
              作战路线图 (Roadmap)
            </h2>
          </div>

          <div className="space-y-0">
            {planData.modules.map((module, index) => (
              <PlanCard key={module.id} module={module} index={index} />
            ))}
          </div>

          <div className="mt-8 text-center text-xs text-slate-600 font-mono border-t border-slate-800 pt-4">
            SYSTEM STATUS: ONLINE <br/>
            ECOSYSTEM LINKED: TRUE
          </div>
        </div>

      </main>
      
      <PortalButton />
    </div>
  );
};

export default App;