export type InsightImpact = 'positive' | 'negative' | 'neutral';

export type InsightCard = {
  id: string;
  title: string;
  summary: string;
  impact: InsightImpact;
  evidence: string[];
  metricDelta: string;
  sampleSize?: {
    leftCount: number;
    rightCount: number;
  };
};

export type WeeklyGuidance = {
  status: 'ready' | 'needs-more-data';
  title: string;
  summary: string;
  evidence: string[];
  nextStep: string;
};

export type PerformanceReport = {
  reportDate: string;
  windowLabel: string;
  primaryMetricLabel: string;
  sessionCount: number;
  averageNormalizedGrade: number | null;
  insights: InsightCard[];
  weeklyGuidance: WeeklyGuidance;
};
