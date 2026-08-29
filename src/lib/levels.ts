export interface LevelInfo {
  level: number;
  title: string;
  minRep: number;
  maxRep: number | null;
  progressPercent: number;
  repToNext: number | null;
}

export const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Field Researcher', minRep: 0 },
  { level: 2, title: 'Intelligence Analyst', minRep: 50 },
  { level: 3, title: 'Verified Investigator', minRep: 150 },
  { level: 4, title: 'Senior Operative', minRep: 300 },
  { level: 5, title: 'Lead Archivist', minRep: 500 },
  { level: 6, title: 'Section Chief', minRep: 1000 },
];

export function calculateLevel(reputation: number): LevelInfo {
  let currentLevel = LEVEL_THRESHOLDS[0];
  let nextLevel = LEVEL_THRESHOLDS[1];

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (reputation >= LEVEL_THRESHOLDS[i].minRep) {
      currentLevel = LEVEL_THRESHOLDS[i];
      nextLevel = LEVEL_THRESHOLDS[i + 1] || null;
    } else {
      break;
    }
  }

  let progressPercent = 100;
  let repToNext = null;

  if (nextLevel) {
    const range = nextLevel.minRep - currentLevel.minRep;
    const progress = reputation - currentLevel.minRep;
    progressPercent = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
    repToNext = nextLevel.minRep - reputation;
  }

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    minRep: currentLevel.minRep,
    maxRep: nextLevel ? nextLevel.minRep - 1 : null,
    progressPercent,
    repToNext
  };
}
