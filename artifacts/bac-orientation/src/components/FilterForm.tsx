import React from "react";
import { YearFilter } from "../utils/logic";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";

interface FilterFormProps {
  domaines: string[];
  selectedDomaine: string;
  onDomaineChange: (domaine: string) => void;
  score: number | "";
  onScoreChange: (score: number | "") => void;
  yearFilter: YearFilter;
  onYearFilterChange: (filter: YearFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: "probability" | "score" | "alphabetical";
  onSortChange: (sort: "probability" | "score" | "alphabetical") => void;
}

export function FilterForm({
  domaines,
  selectedDomaine,
  onDomaineChange,
  score,
  onScoreChange,
  yearFilter,
  onYearFilterChange,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
}: FilterFormProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <Label htmlFor="domaine-select">شعبتك</Label>
          <Select value={selectedDomaine} onValueChange={onDomaineChange}>
            <SelectTrigger id="domaine-select" data-testid="select-domaine">
              <SelectValue placeholder="اختر شعبتك" />
            </SelectTrigger>
            <SelectContent>
              {domaines.map((d) => (
                <SelectItem key={d} value={d} data-testid={`option-domaine-${d}`}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="score-input">معدلك</Label>
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="search-input">بحث</Label>
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-input"
              type="search"
              placeholder="ابحث عن شعبة أو مؤسسة..."
              className="pr-9"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort-select">ترتيب حسب</Label>
          <Select value={sortOption} onValueChange={onSortChange as any}>
            <SelectTrigger id="sort-select" data-testid="select-sort">
              <SelectValue placeholder="ترتيب حسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="probability" data-testid="option-sort-probability">فرصة القبول (الأعلى)</SelectItem>
              <SelectItem value="score" data-testid="option-sort-score">المعدل المطلوب (الأقل)</SelectItem>
              <SelectItem value="alphabetical" data-testid="option-sort-alphabetical">أبجديا</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>طريقة حساب المعدل المرجعي</Label>
        <Tabs value={yearFilter} onValueChange={(v) => onYearFilterChange(v as YearFilter)}>
          <TabsList className="grid w-full max-w-2xl grid-cols-5" dir="rtl">
            <TabsTrigger value="الكل" data-testid="tab-year-all">الكل (مرجح)</TabsTrigger>
            <TabsTrigger value="معدل" data-testid="tab-year-avg">معدل</TabsTrigger>
            <TabsTrigger value="2025" data-testid="tab-year-2025">2025</TabsTrigger>
            <TabsTrigger value="2024" data-testid="tab-year-2024">2024</TabsTrigger>
            <TabsTrigger value="2023" data-testid="tab-year-2023">2023</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
