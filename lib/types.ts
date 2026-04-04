export type InsightImpact = 'positive' | 'negative' | 'neutral';

export type InsightCard = {
  id: string;
  title: string;
  summary: string;
  impact: InsightImpact;
  evidence: string[];
  metricDelta: string;
};

export type PerformanceReport = {
  reportDate: string;
  windowLabel: string;
  primaryMetricLabel: string;
  sessionCount: number;
  averageNormalizedGrade: number | null;
  insights: InsightCard[];
};
