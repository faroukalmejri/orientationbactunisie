/**
 * Import orientations CSV into Supabase `orientations` table.
 *
 * Usage:
 *   pnpm --filter @workspace/scripts run import-orientations
 *
 * Required env vars (set in Replit Secrets):
 *   VITE_SUPABASE_URL        — your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY — service-role key (bypasses RLS)
 *   or VITE_SUPABASE_ANON_KEY — anon key (table must have insert policy or RLS disabled)
 */

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import Papa from "papaparse";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Supabase client ────────────────────────────────────────────────────────

const supabaseUrl = process.env.VITE_SUPABASE_URL ?? "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY    ?? "";

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing env vars. Set VITE_SUPABASE_URL and " +
    "SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY)."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// ── CSV path ───────────────────────────────────────────────────────────────

const CSV_PATH = path.resolve(
  __dirname,
  "../../../attached_assets/sd_par_dom_23_24_25_1777935301054.csv"
);

// ── Helpers ────────────────────────────────────────────────────────────────

function nullIfZero(v: unknown): number | null {
  const n = parseFloat(String(v ?? ""));
  return isNaN(n) || n === 0 ? null : n;
}

function trimStr(v: unknown): string {
  return String(v ?? "").trim();
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Reading CSV from:\n  ${CSV_PATH}\n`);

  if (!fs.existsSync(CSV_PATH)) {
    console.error("CSV file not found at the expected path.");
    process.exit(1);
  }

  // Strip BOM if present
  let csvText = fs.readFileSync(CSV_PATH, "utf-8");
  if (csvText.charCodeAt(0) === 0xfeff) csvText = csvText.slice(1);

  const parsed = Papa.parse(csvText, {
    header: true,
    dynamicTyping: false,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    console.warn("CSV parse warnings:", parsed.errors.slice(0, 5));
  }

  const rawRows = parsed.data as Record<string, string>[];
  console.log(`Parsed ${rawRows.length} rows from CSV.\n`);

  // Normalise headers: lowercase + underscores
  const normaliseKey = (k: string) => k.toLowerCase().replace(/\s+/g, "_");

  let skipped = 0;
  const rows = rawRows
    .map((raw) => {
      const r: Record<string, string> = {};
      for (const [k, v] of Object.entries(raw)) {
        r[normaliseKey(k)] = v;
      }
      return r;
    })
    .map((r) => ({
      domaine:         trimStr(r["domaine"]),
      code_specialite: trimStr(r["code_specialite"]),
      nom_specialite:  trimStr(r["nom_specialite"]),
      universite:      trimStr(r["universite"]),
      institution:     trimStr(r["institution"]),
      baccalaureat:    trimStr(r["baccalaureat"]),
      score_2023:      nullIfZero(r["score_2023"]),
      score_2024:      nullIfZero(r["score_2024"]),
      score_2025:      nullIfZero(r["score_2025"]),
    }))
    .filter((r) => {
      // Skip rows missing the essential fields
      if (!r.nom_specialite || !r.baccalaureat) {
        skipped++;
        return false;
      }
      return true;
    });

  console.log(`Valid rows to insert : ${rows.length}`);
  console.log(`Skipped (invalid)    : ${skipped}\n`);

  // ── Batch insert ──────────────────────────────────────────────────────────

  const BATCH = 500;
  let inserted = 0;

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await supabase.from("orientations").insert(batch);

    if (error) {
      console.error(`Batch ${Math.floor(i / BATCH) + 1} error:`, error.message);
    } else {
      inserted += batch.length;
      process.stdout.write(`\rInserted ${inserted} / ${rows.length} rows...`);
    }
  }

  console.log(`\n\nDone! ${inserted} rows inserted into \`orientations\`.\n`);

  // ── Verification sample ───────────────────────────────────────────────────

  const { data: sample, error: sampleErr } = await supabase
    .from("orientations")
    .select("*")
    .limit(5);

  if (sampleErr) {
    console.warn("Could not fetch sample:", sampleErr.message);
  } else {
    console.log("Sample of 5 inserted rows:");
    console.table(sample);
  }

  // ── Row count ─────────────────────────────────────────────────────────────

  const { count, error: countErr } = await supabase
    .from("orientations")
    .select("*", { count: "exact", head: true });

  if (!countErr) {
    console.log(`\nTotal rows in \`orientations\` table: ${count}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
