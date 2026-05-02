import { useState, useEffect } from "react";
import Papa from "papaparse";
import csvUrl from "@assets/Data_Last_Score_Bac_23_24_25_2_1777759966038.csv?url";
import { CSVRow } from "../utils/logic";
import { getRegionFromRow } from "../utils/regions";

export function useCSVData() {
  const [data, setData] = useState<CSVRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(csvUrl);
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData: CSVRow[] = results.data.map((row: any) => {
              const universite = row.universite?.trim() || "";
              const etablissement = row.etablissement?.trim() || "";
              return {
                domaine: row.domaine?.trim() || "",
                universite,
                etablissement,
                code_specialite: row.code_specialite,
                specialite: row.specialite?.trim() || "",
                score_2023: row.score_2023 ? parseFloat(row.score_2023) : null,
                score_2024: row.score_2024 ? parseFloat(row.score_2024) : null,
                score_2025: row.score_2025 ? parseFloat(row.score_2025) : null,
                region: getRegionFromRow(universite, etablissement),
              };
            });
            setData(parsedData);
            setLoading(false);
          },
          error: (err: any) => {
            setError(err.message);
            setLoading(false);
          },
        });
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}
