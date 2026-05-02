import React from "react";
import { motion } from "framer-motion";
import { CSVRow, Category, Trend, YearFilter } from "../utils/logic";
import { FiliereCard } from "./FiliereCard";
import { Inbox } from "lucide-react";

interface ResultItem {
  item: CSVRow;
  effectiveScore: number;
  diff: number;
  category: Category;
  probability: number;
  trend: Trend;
}

interface ResultsListProps {
  results: ResultItem[];
  loading: boolean;
  yearFilter: YearFilter;
}

export function ResultsList({ results, loading, yearFilter }: ResultsListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200"
        data-testid="empty-state"
      >
        <Inbox className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-bold text-foreground mb-2">لا توجد نتائج</h3>
        <p className="text-muted-foreground max-w-md">
          لم نتمكن من العثور على شعب تطابق معايير البحث ومعدلك. حاول تعديل المعدل أو شروط البحث.
        </p>
      </div>
    );
  }

  const safe         = results.filter(r => r.category === "مضمون").length;
  const competitive  = results.filter(r => r.category === "تنافسي").length;
  const reach        = results.filter(r => r.category === "طموح").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-semibold text-slate-800 ml-auto">النتائج المتاحة</h2>
        <span
          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold"
          data-testid="results-count"
        >
          {results.length} شعبة
        </span>
        {safe > 0 && (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-medium">
            {safe} مضمون
          </span>
        )}
        {competitive > 0 && (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-medium">
            {competitive} تنافسي
          </span>
        )}
        {reach > 0 && (
          <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-medium">
            {reach} طموح
          </span>
        )}
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.04 } },
        }}
        initial="hidden"
        animate="show"
      >
        {results.map((result) => (
          <FiliereCard
            key={result.item.code_specialite}
            item={result.item}
            effectiveScore={result.effectiveScore}
            diff={result.diff}
            category={result.category}
            probability={result.probability}
            trend={result.trend}
            yearFilter={yearFilter}
          />
        ))}
      </motion.div>
    </div>
  );
}
