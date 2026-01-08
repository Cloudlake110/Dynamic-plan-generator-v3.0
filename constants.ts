export const SOP_MESSAGES = {
  desensitization: "SOP 原则：‘比喻先行’。不要死记硬背语法，把 DataFrame 想象成增强版的 Excel。",
  fortification: "攻坚策略：理论与实战必须混编。每天分配 1.5h 给法律/道德理论，其余时间全部写代码。",
  sprint: "肌肉记忆阶段：仅进行全真模拟。遇到报错直接调用 Code Doctor，不要浪费时间百度。",
  survival: "生存模式已激活：放弃所有系统性学习。只专注于历年真题的模式识别。"
};

export const ECOSYSTEM_TOOLS = {
  codeDoctor: "Code Doctor (报错诊断)",
  mnistLab: "MNIST 维度实验室",
  errorBook: "智能错题本",
  pandasSim: "Pandas 演练场"
};

export const SELF_TEST_QUESTIONS = [
  { id: 'knowsContainers', label: "我能分清 List 和 DataFrame 的区别" },
  { id: 'knowsSyntax', label: "我能手写 drop_duplicates 的语法" },
  { id: 'knowsNormalization', label: "我理解什么是归一化 (Normalization)" }
];

export const BASE_STUDY_LOAD_HOURS = {
  beginner: 120,
  intermediate: 80,
  sprint: 50
};

export const SURVIVAL_THRESHOLD_DAYS = 5; // Increased slightly for v3 logic