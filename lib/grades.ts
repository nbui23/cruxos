const BOULDER_GRADES = ['VB', 'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17'] as const;
const YDS_GRADES = ['5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d', '5.11a', '5.11b', '5.11c', '5.11d', '5.12a', '5.12b', '5.12c', '5.12d', '5.13a', '5.13b', '5.13c', '5.13d'] as const;
const FRENCH_GRADES = ['5c', '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+', '7b', '7b+', '7c', '7c+', '8a', '8a+', '8b', '8b+'] as const;

export type GradeScale = 'BOULDER_V' | 'YDS' | 'FRENCH';

const SCALE_MAP: Record<GradeScale, readonly string[]> = {
  BOULDER_V: BOULDER_GRADES,
  YDS: YDS_GRADES,
  FRENCH: FRENCH_GRADES,
};

export function normalizeGrade(scale: GradeScale, grade: string): number {
  const values = SCALE_MAP[scale];
  const normalized = grade.trim().toUpperCase();
  const index = values.findIndex((value) => value.toUpperCase() === normalized);

  if (index === -1) {
    throw new Error('Unsupported ' + scale + ' grade: ' + grade);
  }

  return index;
}
