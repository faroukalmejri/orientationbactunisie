import React from "react";
import { SortOption } from "../utils/logic";
import { ALL_REGIONS } from "../utils/regions";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";

interface FilterFormProps {
  domaines: string[];
  selectedDomaine: string;
  onDomaineChange: (domaine: string) => void;
  score: number | "";
  onScoreChange: (score: number | "") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

export function FilterForm({
  domaines,
  selectedDomaine,
  onDomaineChange,
  score,
  onScoreChange,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  selectedRegion,
  onRegionChange,
}: FilterFormProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="domaine-select" className="text-xs text-slate-500 font-medium">شعبتك</Label>
          <Select value={selectedDomaine} onValueChange={onDomaineChange}>
            <SelectTrigger id="domaine-select" data-testid="select-domaine" className="h-10">
              <SelectValue placeholder="اختر شعبتك" />
            </SelectTrigger>
            <SelectContent className="max-h-[220px] overflow-y-auto">
              {domaines.map((d) => (
                <SelectItem key={d} value={d} data-testid={`option-domaine-${d}`}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="score-input" className="text-xs text-slate-500 font-medium">معدلك</Label>
          <Input
            id="score-input"
            type="number"
            min="0"
            max="200"
            step="0.01"
            placeholder="مثال: 14.5"
            value={score}
            onChange={(e) => onScoreChange(e.target.value ? parseFloat(e.target.value) : "")}
            data-testid="input-score"
            className="h-10"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="region-select" className="text-xs text-slate-500 font-medium">الجهة</Label>
          <Select value={selectedRegion} onValueChange={onRegionChange}>
            <SelectTrigger id="region-select" data-testid="select-region" className="h-10">
              <SelectValue placeholder="كل الجهات" />
            </SelectTrigger>
            <SelectContent className="max-h-[220px] overflow-y-auto">
              <SelectItem value="الكل">كل الجهات</SelectItem>
              {ALL_REGIONS.map((r) => (
                <SelectItem key={r} value={r} data-testid={`option-region-${r}`}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="search-input" className="text-xs text-slate-500 font-medium">بحث</Label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="search-input"
              type="search"
              placeholder="شعبة أو مؤسسة..."
              className="pr-9 h-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sort-select" className="text-xs text-slate-500 font-medium">ترتيب حسب</Label>
          <Select value={sortOption} onValueChange={(v) => onSortChange(v as SortOption)}>
            <SelectTrigger id="sort-select" data-testid="select-sort" className="h-10">
              <SelectValue placeholder="ترتيب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prob-desc" data-testid="option-sort-prob-desc">أعلى احتمال قبول</SelectItem>
              <SelectItem value="prob-asc"  data-testid="option-sort-prob-asc">أدنى احتمال قبول</SelectItem>
              <SelectItem value="score-asc" data-testid="option-sort-score-asc">أقل معدل مطلوب</SelectItem>
              <SelectItem value="score-desc" data-testid="option-sort-score-desc">أعلى معدل مطلوب</SelectItem>
              <SelectItem value="alpha-asc" data-testid="option-sort-alpha-asc">أبجدياً (أ → ي)</SelectItem>
              <SelectItem value="alpha-desc" data-testid="option-sort-alpha-desc">أبجدياً (ي → أ)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
