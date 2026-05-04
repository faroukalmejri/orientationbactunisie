import React, { useState, useMemo, useEffect } from "react";
import { useCSVData } from "../hooks/useCSVData";
import { FilterForm } from "../components/FilterForm";
import { ResultsList } from "../components/ResultsList";
import {
  SortOption,
  getEffectiveScore,
  getCategory,
  getProbability,
  computeTrend,
} from "../utils/logic";
import { useAuth } from "../context/AuthContext";
import { GraduationCap } from "lucide-react";

export default function Home() {
  const { data, loading, error } = useCSVData();
  const { profile, user } = useAuth();

  const [selectedBac, setSelectedBac] = useState<string>("");
  const [score, setScore] = useState<number | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("prob-desc");
  const [selectedRegion, setSelectedRegion] = useState<string>("الكل");
  const [profileSectionApplied, setProfileSectionApplied] = useState(false);

  // Distinct BAC sections from the data
  const bacSections = useMemo(() => {
    if (!data) return [];
    const unique = new Set(data.map((r) => r.baccalaureat).filter(Boolean));
    return Array.from(unique).sort();
  }, [data]);

  // Auto-select section from user profile (runs once when profile + sections are ready)
  useEffect(() => {
    if (profileSectionApplied) return;
    if (bacSections.length === 0) return;

    const section = profile?.section ?? user?.user_metadata?.section ?? null;

    if (section && bacSections.includes(section)) {
      setSelectedBac(section);
      setProfileSectionApplied(true);
    } else if (!section && !selectedBac) {
      setSelectedBac(bacSections[0]);
      setProfileSectionApplied(true);
    }
  }, [bacSections, profile, user, profileSectionApplied, selectedBac]);

  // Always use weighted average (الكل) as the reference score method
  const YEAR_FILTER = "الكل" as const;

  const processedResults = useMemo(() => {
    if (!data || score === "" || !selectedBac) return [];

    const numScore = Number(score);

    const mapped = data
      .filter((row) => row.baccalaureat === selectedBac)
      .map((row) => {
        const effectiveScore = getEffectiveScore(row, YEAR_FILTER);
        if (effectiveScore === null) return null;

        const diff = numScore - effectiveScore;
        if (diff < -10) return null;

        const trend = computeTrend(row);
        const category = getCategory(diff);
        const probability = getProbability(diff, trend);

        return { item: row, effectiveScore, diff, category, probability, trend };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    let results = selectedRegion === "الكل"
      ? mapped
      : mapped.filter((r) => r.item.region === selectedRegion);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.item.nom_specialite?.toLowerCase().includes(q) ||
          r.item.institution?.toLowerCase().includes(q) ||
          r.item.universite?.toLowerCase().includes(q)
      );
    }

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
        case "score-asc":  return a.effectiveScore - b.effectiveScore;
        case "score-desc": return b.effectiveScore - a.effectiveScore;
        case "alpha-asc":  return a.item.nom_specialite.localeCompare(b.item.nom_specialite, "ar");
        case "alpha-desc": return b.item.nom_specialite.localeCompare(a.item.nom_specialite, "ar");
        default:           return 0;
      }
    });

    return results;
  }, [data, score, selectedBac, searchQuery, sortOption, selectedRegion]);

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
    <div className="min-h-full bg-slate-50 pb-20 pt-6">
      <header className="bg-primary text-primary-foreground py-10 px-6 rounded-b-[2.5rem] shadow-sm mb-10 mx-4 rounded-t-2xl">
        <div className="container mx-auto max-w-7xl flex flex-col items-center text-center">
          <div className="bg-primary-foreground/10 p-4 rounded-full mb-4">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">توجيه الباكالوريا</h1>
          <p className="text-primary-foreground/80 text-base md:text-lg max-w-2xl">
            اكتشف الشعب المتاحة بناءً على معدلك. أدخل معدلك لترى توقعات القبول في مختلف الجامعات التونسية.
          </p>
          {profile?.section && (
            <div className="mt-3 bg-primary-foreground/15 px-4 py-1.5 rounded-full text-sm font-medium">
              شعبتك: {profile.section}
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        <section className="-mt-16 relative z-10">
          <FilterForm
            domaines={bacSections}
            selectedDomaine={selectedBac}
            onDomaineChange={setSelectedBac}
            score={score}
            onScoreChange={setScore}
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
            <ResultsList results={processedResults} loading={loading} yearFilter={YEAR_FILTER} />
          </section>
        )}
      </main>
    </div>
  );
}
