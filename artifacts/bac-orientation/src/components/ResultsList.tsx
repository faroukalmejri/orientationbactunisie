import React from "react";
import { motion } from "framer-motion";
import { CSVRow, Category, Trend } from "../utils/logic";
import { FiliereCard } from "./FiliereCard";
import { Inbox } from "lucide-react";

interface ResultItem {
  item: CSVRow;
  effectiveScore: number;
  category: Category;
  probability: number;
  trend: Trend;
}

interface ResultsListProps {
  results: ResultItem[];
  loading: boolean;
}

export function ResultsList({ results, loading }: ResultsListProps) {
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
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dashed border-border" data-testid="empty-state">
        <Inbox className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-bold text-foreground mb-2">لا توجد نتائج</h3>
        <p className="text-muted-foreground max-w-md">
          لم نتمكن من العثور على شعب تطابق معايير البحث ومعدلك. حاول تعديل المعدل أو شروط البحث.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">النتائج المتاحة</h2>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium" data-testid="results-count">
          {results.length} شعبة
        </span>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {results.map((result) => (
          <FiliereCard
            key={result.item.code_specialite}
            item={result.item}
            effectiveScore={result.effectiveScore}
            category={result.category}
            probability={result.probability}
            trend={result.trend}
          />
        ))}
      </motion.div>
    </div>
  );
}
