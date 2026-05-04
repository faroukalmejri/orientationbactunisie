import React from "react";
import { motion } from "framer-motion";
import { FiliereRow, Category, Trend, YearFilter } from "../utils/logic";
import { MapPin, Building2 } from "lucide-react";

interface FiliereCardProps {
  item: FiliereRow;
  effectiveScore: number;
  diff: number;
  category: Category;
  probability: number;
  trend: Trend;
  yearFilter: YearFilter;
}

const categoryConfig: Record<Category, { label: string; bg: string; text: string; border: string }> = {
  "مضمون":    { label: "مضمون",    bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "تنافسي": { label: "تنافسي", bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200"   },
  "طموح":    { label: "طموح",    bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200"    },
};

const probabilityColor = (p: number) => {
  if (p >= 65) return { bar: "bg-emerald-500", text: "text-emerald-700" };
  if (p >= 40) return { bar: "bg-amber-500",   text: "text-amber-700"   };
  return             { bar: "bg-red-500",       text: "text-red-700"     };
};

const trendConfig: Record<Trend, { icon: string; label: string; color: string }> = {
  up:     { icon: "📈", label: "في ارتفاع", color: "text-red-600 bg-red-50 border-red-100" },
  down:   { icon: "📉", label: "في انخفاض", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  stable: { icon: "➡️", label: "مستقر",    color: "text-slate-500 bg-slate-50 border-slate-100" },
};

function ScoreYearBox({
  year,
  score,
  active,
}: {
  year: string;
  score: number | null | undefined;
  active: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center rounded-lg px-3 py-2 text-center transition-colors ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      <span className="text-[10px] font-medium mb-0.5 opacity-80">{year}</span>
      <span className={`text-sm font-bold leading-tight ${!score ? "opacity-40" : ""}`}>
        {score != null ? score.toFixed(2) : "—"}
      </span>
    </div>
  );
}

export function FiliereCard({
  item,
  effectiveScore,
  diff,
  category,
  probability,
  trend,
  yearFilter,
}: FiliereCardProps) {
  const cat = categoryConfig[category];
  const prob = probabilityColor(probability);
  const trendInfo = trendConfig[trend];

  const highlightYear = (year: "2023" | "2024" | "2025") => {
    if (yearFilter === year) return true;
    if (yearFilter === "2025" && year === "2025") return true;
    if ((yearFilter === "الكل" || yearFilter === "معدل") && year === "2025") return true;
    return false;
  };

  const safeDiff = diff ?? 0;
  const diffPositive = safeDiff >= 0;

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
      layout
    >
      <div
        className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
        data-testid={`card-filiere-${item.code_specialite}`}
      >
        {/* Top accent strip */}
        <div className={`h-1 w-full ${cat.bg.replace("bg-", "bg-").replace("-50", "-400")}`} />

        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-[15px] leading-snug text-slate-800 flex-1">
              {item.nom_specialite}
            </h3>
            <span
              className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}
            >
              {cat.label}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{item.institution}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{item.universite}</span>
              {item.region && (
                <>
                  <span className="mx-1">·</span>
                  <span className="font-medium text-primary/80">{item.region}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scores row */}
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-[10px] text-slate-400 font-medium mb-2 uppercase tracking-wide">المعدلات السابقة</p>
          <div className="grid grid-cols-3 gap-2">
            <ScoreYearBox year="2023" score={item.score_2023} active={highlightYear("2023")} />
            <ScoreYearBox year="2024" score={item.score_2024} active={highlightYear("2024")} />
            <ScoreYearBox year="2025" score={item.score_2025} active={highlightYear("2025")} />
          </div>
        </div>

        {/* Diff + Probability */}
        <div className="px-4 py-3 flex gap-3 border-b border-slate-100">
          {/* Difference */}
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 font-medium mb-1.5 uppercase tracking-wide">الفارق</p>
            <div
              className={`rounded-xl px-3 py-2 text-center border ${
                diffPositive
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <span
                className={`text-xl font-bold tabular-nums ${
                  diffPositive ? "text-emerald-700" : "text-red-600"
                }`}
              >
                {diffPositive ? "+" : ""}
                {safeDiff.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Probability */}
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 font-medium mb-1.5 uppercase tracking-wide">احتمال القبول</p>
            <div className="flex flex-col gap-1.5">
              <span className={`text-xl font-bold ${prob.text}`}>{probability}%</span>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${prob.bar}`}
                  style={{ width: `${probability}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Trend footer */}
        <div className="px-4 py-2.5">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${trendInfo.color}`}
          >
            <span>{trendInfo.icon}</span>
            <span>{trendInfo.label}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
