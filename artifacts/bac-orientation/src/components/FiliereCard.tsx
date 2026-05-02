import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CSVRow, Category, Trend } from "../utils/logic";
import { MapPin, Building2 } from "lucide-react";

interface FiliereCardProps {
  item: CSVRow;
  effectiveScore: number;
  category: Category;
  probability: number;
  trend: Trend;
}

export function FiliereCard({ item, effectiveScore, category, probability, trend }: FiliereCardProps) {
  const categoryColor = {
    "مضمون": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    "تنافسي": "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    "طموح": "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  }[category];

  const trendText = trend === "up" ? "📈 في ارتفاع" : trend === "down" ? "📉 في انخفاض" : "مستقر";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      layout
    >
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300 border-border group" data-testid={`card-filiere-${item.code_specialite}`}>
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-start mb-3 gap-4">
            <h3 className="font-bold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
              {item.specialite}
            </h3>
            <Badge variant="outline" className={`whitespace-nowrap ${categoryColor}`}>
              {category}
            </Badge>
          </div>

          <div className="space-y-2 mb-4 flex-grow">
            <div className="flex items-center text-sm text-muted-foreground">
              <Building2 className="w-4 h-4 ml-2 shrink-0" />
              <span className="truncate">{item.etablissement}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 ml-2 shrink-0" />
              <span className="truncate">{item.universite}</span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">المعدل المطلوب</span>
              <span className="font-semibold text-foreground bg-secondary/50 px-2 py-0.5 rounded-md inline-block w-fit">
                {effectiveScore.toFixed(2)}
              </span>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 mb-1">
                {trend !== "stable" && (
                  <span className="text-xs text-muted-foreground" title="التوجه">
                    {trendText}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">نسبة القبول</span>
              </div>
              <span className={`font-bold text-lg ${
                probability >= 80 ? 'text-green-600 dark:text-green-400' : 
                probability >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {probability}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
