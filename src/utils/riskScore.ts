export function calculateRiskScore(
  crit: number,
  high: number,
  mod: number,
  low: number,
  outdated: number,
  sastCount: number = 0,
): number {
  if (sastCount > 0) return 100;

  const score = crit * 25 + high * 15 + mod * 5 + low * 2 + outdated * 1;
  return Math.min(score, 100);
}

export function getRiskColor(score: number): string {
  if (score === 0) return "#10b981";
  if (score <= 20) return "#f59e0b";
  if (score <= 50) return "#ea580c";
  if (score <= 80) return "#be123c";
  return "#881337";
}

export function getRiskLabel(score: number): string {
  if (score === 0) return "A";
  if (score <= 20) return "B";
  if (score <= 50) return "C";
  if (score <= 80) return "D";
  return "F";
}

export function getDonutChartOffset(
  score: number,
  circumference: number,
): number {
  return circumference - (score / 100) * circumference;
}
