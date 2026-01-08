export type UserLevel = 'beginner' | 'intermediate' | 'sprint';

export interface SelfTestState {
  knowsContainers: boolean; // 分清 List 和 DataFrame
  knowsSyntax: boolean;     // 手写 drop_duplicates
  knowsNormalization: boolean; // 理解归一化
}

export interface StudyPlanModule {
  id: string;
  title: string;
  subTitle: string;
  dateRange: string;
  hoursAllocated: number;
  percentage: number;
  color: string; // Tailwind color class specific
  items: string[];
  tools?: string[]; // Recommended weapons/tools
  notes?: string;
}

export interface PlanState {
  pressure: number; // 0-100+
  pressureLevel: 'easy' | 'medium' | 'high' | 'survival';
  totalEnergy: number;
  modules: StudyPlanModule[];
  recommendation?: string; // Strategic advice
}

export interface UserInput {
  daysRemaining: number;
  dailyHours: number;
  level: UserLevel;
  selfTest: SelfTestState;
}