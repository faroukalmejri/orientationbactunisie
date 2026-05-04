// ── Core types ─────────────────────────────────────────────────────────────

export type YearFilter = "الكل" | "معدل" | "2023" | "2024" | "2025";
export type Category   = "مضمون" | "تنافسي" | "طموح";
export type Trend      = "up" | "down" | "stable";
export type SortOption = "prob-desc" | "prob-asc" | "score-asc" | "score-desc" | "alpha-asc" | "alpha-desc";

/**
 * One row from the `orientations` Supabase table.
 * Each row = one programme × one BAC section.
 */
export interface FiliereRow {
  domaine:         string;          // Field-of-study category (e.g. "الهندسة")
  code_specialite: string;          // Programme code (TEXT)
  nom_specialite:  string;          // Programme name
  universite:      string;
  institution:     string;          // Institution / faculty name
  baccalaureat:    string;          // BAC section this row applies to
  score_2023?:     number | null;
  score_2024?:     number | null;
  score_2025?:     number | null;
  region:          string;          // Derived from universite/institution
}

/** @deprecated Use FiliereRow — kept for backward compatibility. */
export type CSVRow = FiliereRow;

// ── Score helpers ───────────────────────────────────────────────────────────

export function computeTrend(row: FiliereRow): Trend {
  if (row.score_2025 != null && row.score_2023 != null) {
    if (row.score_2025 > row.score_2023 + 1) return "up";
    if (row.score_2025 < row.score_2023 - 1) return "down";
  }
  return "stable";
}

export function getEffectiveScore(row: FiliereRow, yearFilter: YearFilter): number | null {
  const s23 = row.score_2023;
  const s24 = row.score_2024;
  const s25 = row.score_2025;

  if (yearFilter === "2023") return s23 ?? null;
  if (yearFilter === "2024") return s24 ?? null;
  if (yearFilter === "2025") return s25 ?? null;

  const scores = [s23, s24, s25].filter((s): s is number => s != null);
  if (scores.length === 0) return null;

  if (yearFilter === "معدل") {
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  // "الكل" → weighted average (2025×3, 2024×2, 2023×1)
  let sum = 0, weights = 0;
  if (s25 != null) { sum += s25 * 3; weights += 3; }
  if (s24 != null) { sum += s24 * 2; weights += 2; }
  if (s23 != null) { sum += s23 * 1; weights += 1; }
  return sum / weights;
}

export function getCategory(diff: number): Category {
  if (diff >= 5)  return "مضمون";
  if (diff >= -5) return "تنافسي";
  return "طموح";
}

export function getProbability(diff: number, trend: Trend): number {
  let base = 0;
  if      (diff >= 10) base = 95;
  else if (diff >= 5)  base = 80;
  else if (diff >= 0)  base = 65;
  else if (diff >= -5) base = 40;
  else if (diff >= -10)base = 20;
  else                 base = 5;

  if (trend === "up")   base -= 5;
  if (trend === "down") base += 5;

  return Math.max(5, Math.min(95, base));
}
