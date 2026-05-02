import React, { useState, useMemo, useEffect } from "react";
import { useCSVData } from "../hooks/useCSVData";
import { FilterForm } from "../components/FilterForm";
import { ResultsList } from "../components/ResultsList";
import {
  YearFilter,
  SortOption,
  getEffectiveScore,
  getCategory,
  getProbability,
  computeTrend,
} from "../utils/logic";
import { GraduationCap } from "lucide-react";

export default function Home() {
  const { data, loading, error } = useCSVData();

  const [selectedDomaine, setSelectedDomaine] = useState<string>("");
  const [score, setScore] = useState<number | "">("");
  const [yearFilter, setYearFilter] = useState<YearFilter>("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("prob-desc");
  const [selectedRegion, setSelectedRegion] = useState<string>("الكل");

  const domaines = useMemo(() => {
    if (!data) return [];
    const unique = new Set(data.map((r) => r.domaine).filter(Boolean));
    return Array.from(unique).sort();
  }, [data]);

  useEffect(() => {
    if (domaines.length > 0 && !selectedDomaine) {
      setSelectedDomaine(domaines[0]);
    }
  }, [domaines, selectedDomaine]);

  const processedResults = useMemo(() => {
    if (!data || score === "" || !selectedDomaine) return [];

    const numScore = Number(score);

    const mapped = data
      .filter((row) => row.domaine === selectedDomaine)
      .map((row) => {
        const effectiveScore = getEffectiveScore(row, yearFilter);
        if (effectiveScore === null) return null;

        const diff = numScore - effectiveScore;
        if (diff < -10) return null;

        const trend = computeTrend(row);
        const category = getCategory(diff);
        const probability = getProbability(diff, trend);

        return { item: row, effectiveScore, diff, category, probability, trend };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    // Region filter
    let results = selectedRegion === "الكل"
      ? mapped
      : mapped.filter((r) => r.item.region === selectedRegion);

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.item.specialite?.toLowerCase().includes(q) ||
          r.item.etablissement?.toLowerCase().includes(q) ||
          r.item.universite?.toLowerCase().includes(q)
      );
    }

    // Sort
    results = [...results].sort((a, b) => {
      switch (sortOption) {
        case "prob-desc":
          return b.probability !== a.probability
            ? b.probability - a.probability
            : b.diff - a.diff;
        case "prob-asc":
          return a.probability !== b.probability
            ? a.probability - b.probability
            : a.diff - b.diff;
        case "score-asc":
          return a.effectiveScore - b.effectiveScore;
        case "score-desc":
          return b.effectiveScore - a.effectiveScore;
        case "alpha-asc":
          return a.item.specialite.localeCompare(b.item.specialite, "ar");
        case "alpha-desc":
          return b.item.specialite.localeCompare(a.item.specialite, "ar");
        default:
          return 0;
      }
    });

    return results;
  }, [data, score, selectedDomaine, yearFilter, searchQuery, sortOption, selectedRegion]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <div className="bg-red-50 p-6 rounded-xl text-center max-w-md">
          <h2 className="text-xl font-bold mb-2">خطأ في تحميل البيانات</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-primary text-primary-foreground py-12 px-6 rounded-b-[2.5rem] shadow-sm mb-10">
        <div className="container mx-auto max-w-7xl flex flex-col items-center text-center">
          <div className="bg-primary-foreground/10 p-4 rounded-full mb-6">
            <GraduationCap className="w-12 h-12" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">توجيه الباكالوريا</h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl">
            اكتشف الشعب المتاحة بناءً على معدلك. أدخل معدلك وشعبتك لترى توقعات القبول في مختلف الجامعات التونسية.
          </p>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        <section className="-mt-20 relative z-10">
          <FilterForm
            domaines={domaines}
            selectedDomaine={selectedDomaine}
            onDomaineChange={setSelectedDomaine}
            score={score}
            onScoreChange={setScore}
            yearFilter={yearFilter}
            onYearFilterChange={setYearFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortOption={sortOption}
            onSortChange={setSortOption}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
          />
        </section>

        {score === "" ? (
          <div className="text-center py-20 opacity-60">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-medium text-foreground">الرجاء إدخال معدلك لرؤية النتائج</h2>
          </div>
        ) : (
          <section>
            <ResultsList results={processedResults} loading={loading} yearFilter={yearFilter} />
          </section>
        )}
      </main>
    </div>
  );
}
