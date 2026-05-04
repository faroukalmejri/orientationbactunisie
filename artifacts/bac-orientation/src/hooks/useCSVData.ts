import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { FiliereRow } from "../utils/logic";
import { getRegionFromRow } from "../utils/regions";

function nullIfZero(v: unknown): number | null {
  const n = Number(v);
  return isNaN(n) || n === 0 ? null : n;
}

// Backward-compat export name — callers still import { useCSVData }
export function useCSVData() {
  const [data, setData] = useState<FiliereRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: rows, error: sbError } = await supabase
          .from("orientations")
          .select("*");

        if (sbError) {
          console.warn("[orientations] Supabase fetch warning:", sbError.message);
          setData([]);
        } else {
          const mapped: FiliereRow[] = (rows ?? []).map((row: any) => {
            const universite  = row.universite?.trim()  ?? "";
            const institution = row.institution?.trim() ?? "";
            return {
              domaine:         row.domaine?.trim()        ?? "",
              code_specialite: String(row.code_specialite ?? ""),
              nom_specialite:  row.nom_specialite?.trim() ?? "",
              universite,
              institution,
              baccalaureat:    row.baccalaureat?.trim()   ?? "",
              score_2023:      nullIfZero(row.score_2023),
              score_2024:      nullIfZero(row.score_2024),
              score_2025:      nullIfZero(row.score_2025),
              region:          getRegionFromRow(universite, institution),
            };
          });
          setData(mapped);
        }
      } catch (err: any) {
        setError(err.message ?? "حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}
