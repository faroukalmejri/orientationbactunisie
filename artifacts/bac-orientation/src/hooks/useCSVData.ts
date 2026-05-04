import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { FiliereRow } from "../utils/logic";

// Backward-compat alias — callers still import { useCSVData }
export function useCSVData() {
  const [data, setData] = useState<FiliereRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: rows, error: sbError } = await supabase
          .from("filieres")
          .select("*")
          .order("domaine");

        if (sbError) {
          // Table may not exist yet — treat as empty, not a fatal error
          console.warn("[filieres] Supabase fetch warning:", sbError.message);
          setData([]);
        } else {
          setData((rows ?? []) as FiliereRow[]);
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
