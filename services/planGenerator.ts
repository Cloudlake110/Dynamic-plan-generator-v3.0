import { PlanState, StudyPlanModule, UserInput } from '../types';
import { SOP_MESSAGES, BASE_STUDY_LOAD_HOURS, SURVIVAL_THRESHOLD_DAYS, ECOSYSTEM_TOOLS } from '../constants';

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const calculatePlan = (input: UserInput): PlanState => {
  const { daysRemaining, dailyHours, level, selfTest } = input;
  
  // 1. Calculate Energy and Pressure
  const totalEnergy = daysRemaining * dailyHours;
  
  // Dynamic Base Load Calculation based on Self Test
  let baseLoad = BASE_STUDY_LOAD_HOURS[level];
  if (selfTest.knowsContainers) baseLoad -= 10;
  if (selfTest.knowsSyntax) baseLoad -= 10;
  if (selfTest.knowsNormalization) baseLoad -= 10;
  
  // Pressure Formula
  let pressure = Math.round((baseLoad / totalEnergy) * 60);
  
  // Survival Mode Override
  if (daysRemaining < SURVIVAL_THRESHOLD_DAYS) {
    pressure = 100;
  }

  let pressureLevel: PlanState['pressureLevel'] = 'easy';
  if (pressure >= 85) pressureLevel = 'high';
  else if (pressure >= 50) pressureLevel = 'medium';
  if (daysRemaining < SURVIVAL_THRESHOLD_DAYS) pressureLevel = 'survival';

  // 2. Strategic Advice Generation
  let recommendation = "";
  if (pressureLevel === 'easy') recommendation = "时间充裕，建议在[MNIST 维度实验室]多做实验，深挖原理。";
  else if (pressureLevel === 'medium') recommendation = "进度适中，请严格执行[Code Doctor]排错机制，保持节奏。";
  else if (pressureLevel === 'high') recommendation = "时间紧迫，启动[饱和攻击]策略，放弃低频考点。";
  else recommendation = "🚨 红色警报：全押真题，背诵模式，放弃理解。";


  // 3. Phase Allocation Logic (Stock-First Rule)
  const modules: StudyPlanModule[] = [];
  const startDate = new Date();
  let currentOffsetDays = 0;

  // Survival Mode Logic
  if (pressureLevel === 'survival') {
    modules.push({
      id: 'survival',
      title: '🚨 极速求生模式',
      subTitle: '全押真题',
      dateRange: `${formatDate(startDate)} - ${formatDate(addDays(startDate, daysRemaining))}`,
      hoursAllocated: totalEnergy,
      percentage: 100,
      color: 'bg-red-600',
      items: ['放弃理论推导', '背诵 Top 50 代码片段', '仅做模式识别'],
      tools: [ECOSYSTEM_TOOLS.errorBook],
      notes: SOP_MESSAGES.survival
    });
    return { pressure, pressureLevel, totalEnergy, modules, recommendation };
  }

  // --- Normal Logic v3.0 ---
  
  // Theory Injection: 12 hours fixed total, distributed later
  const theoryHoursTotal = 12;
  const netEnergy = Math.max(0, totalEnergy - theoryHoursTotal);

  // Default Weights (Beginner)
  let w_Phase1 = 0.20; // Desensitization
  let w_Phase2 = 0.50; // Fortification
  let w_Phase3 = 0.30; // Sprint

  // Level Adjustments (Stock-First)
  if (level === 'intermediate') {
    w_Phase1 = 0.05; // Shrink by ~75%
    w_Phase2 = 0.60;
    w_Phase3 = 0.35;
  } else if (level === 'sprint') {
    w_Phase1 = 0.00; // Remove entirely
    w_Phase2 = 0.50;
    w_Phase3 = 0.50; // Heavy simulation
  }

  // Self-Test Adjustments
  if (selfTest.knowsContainers && w_Phase1 > 0) {
    w_Phase2 += w_Phase1; // Shift weight to Ph2
    w_Phase1 = 0; 
  }

  // Calculate Hours per Phase
  const h_Phase1 = netEnergy * w_Phase1;
  const h_Phase2 = netEnergy * w_Phase2;
  const h_Phase3 = netEnergy * w_Phase3;

  // --- Generate Modules ---

  // Module 1: Desensitization (Conditional)
  if (h_Phase1 > 1) {
    const d_Phase1 = Math.max(1, Math.round((h_Phase1 / totalEnergy) * daysRemaining));
    modules.push({
      id: 'm1',
      title: '阶段 1：思维脱敏',
      subTitle: '代码文本化',
      dateRange: `${formatDate(addDays(startDate, currentOffsetDays))} - ${formatDate(addDays(startDate, currentOffsetDays + d_Phase1))}`,
      hoursAllocated: Math.round(h_Phase1),
      percentage: Math.round(w_Phase1 * 100),
      color: 'bg-blue-500',
      items: ['Python 容器逻辑', 'Series vs DataFrame', '环境搭建'],
      tools: [ECOSYSTEM_TOOLS.pandasSim],
      notes: SOP_MESSAGES.desensitization
    });
    currentOffsetDays += d_Phase1;
  }

  // Module 2: Fortification (Main Battle) + Theory Injection
  // Logic: Theory is injected here.
  const d_Phase2 = Math.max(1, Math.round(((h_Phase2 + theoryHoursTotal) / totalEnergy) * daysRemaining));
  
  // Determine Content breakdown for Ph2
  const p2_items = [];
  
  // Initial items based on level
  if (level === 'sprint') {
    p2_items.push('高频易错题自查 (启动项)');
  }
  
  p2_items.push(`2.x Pandas/NumPy 攻坚 (${selfTest.knowsSyntax ? '快速过' : '重点'})`);
  p2_items.push(`3.x 模型训练与评估 (${selfTest.knowsNormalization ? '实战' : '原理+实战'})`);
  p2_items.push('🔸 每日混编：理论法规 (1.5h/天)');

  modules.push({
    id: 'm2',
    title: '阶段 2：混合攻坚',
    subTitle: '理论实战双轨',
    dateRange: `${formatDate(addDays(startDate, currentOffsetDays))} - ${formatDate(addDays(startDate, currentOffsetDays + d_Phase2))}`,
    hoursAllocated: Math.round(h_Phase2 + theoryHoursTotal),
    percentage: Math.round(w_Phase2 * 100), // Visual percentage of code effort
    color: 'bg-emerald-500',
    items: p2_items,
    tools: [ECOSYSTEM_TOOLS.codeDoctor, ECOSYSTEM_TOOLS.mnistLab],
    notes: SOP_MESSAGES.fortification
  });
  currentOffsetDays += d_Phase2;

  // Module 3: Sprint (Simulation)
  const d_Phase3 = Math.max(1, daysRemaining - currentOffsetDays);
  modules.push({
    id: 'm3',
    title: '阶段 3：全真模拟舱',
    subTitle: '应激反应训练',
    dateRange: `${formatDate(addDays(startDate, currentOffsetDays))} - ${formatDate(addDays(startDate, daysRemaining))}`,
    hoursAllocated: Math.round(h_Phase3),
    percentage: Math.round(w_Phase3 * 100),
    color: 'bg-purple-600',
    items: ['全真模拟考 (3小时/次)', '错题本清零', '手速极限测试'],
    tools: [ECOSYSTEM_TOOLS.errorBook, ECOSYSTEM_TOOLS.codeDoctor],
    notes: SOP_MESSAGES.sprint
  });

  return {
    pressure,
    pressureLevel,
    totalEnergy,
    modules,
    recommendation
  };
};