import React, { useState } from "react";
import { Calculator, Plus, Trash2 } from "lucide-react";

interface Subject {
  id: number;
  name: string;
  grade: string;
  coef: string;
}

let nextId = 1;

function makeSubject(): Subject {
  return { id: nextId++, name: "", grade: "", coef: "1" };
}

export default function CalculatorPage() {
  const [subjects, setSubjects] = useState<Subject[]>([makeSubject(), makeSubject(), makeSubject()]);

  function updateSubject(id: number, field: keyof Subject, value: string) {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  function addSubject() {
    setSubjects((prev) => [...prev, makeSubject()]);
  }

  function removeSubject(id: number) {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  }

  const result = (() => {
    let totalWeighted = 0;
    let totalCoef = 0;
    for (const s of subjects) {
      const g = parseFloat(s.grade);
      const c = parseFloat(s.coef);
      if (!isNaN(g) && !isNaN(c) && c > 0) {
        totalWeighted += g * c;
        totalCoef += c;
      }
    }
    if (totalCoef === 0) return null;
    return (totalWeighted / totalCoef).toFixed(3);
  })();

  return (
    <div className="min-h-full bg-slate-50 pb-20 pt-6 px-4" dir="rtl">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-emerald-100 p-3 rounded-2xl">
            <Calculator className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">حساب المعدل</h1>
            <p className="text-slate-500 text-sm">أدخل درجاتك ومعاملاتها لحساب معدلك التقديري</p>
          </div>
        </div>

        {/* Result card */}
        {result !== null && (
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-3xl p-7 mb-6 text-center shadow-lg shadow-emerald-500/25">
            <p className="text-emerald-100 text-sm font-medium mb-1">معدلك التقديري</p>
            <p className="text-6xl font-black tracking-tight">{result}</p>
            <p className="text-emerald-100 text-sm mt-1">من 20</p>
          </div>
        )}

        {/* Table header */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-[1fr_80px_80px_40px] gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
            <span>المادة</span>
            <span className="text-center">الدرجة /20</span>
            <span className="text-center">المعامل</span>
            <span />
          </div>

          <div className="divide-y divide-slate-100">
            {subjects.map((s) => (
              <div key={s.id} className="grid grid-cols-[1fr_80px_80px_40px] gap-2 px-4 py-2.5 items-center">
                <input
                  type="text"
                  placeholder="اسم المادة"
                  value={s.name}
                  onChange={(e) => updateSubject(s.id, "name", e.target.value)}
                  className="text-sm bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-300 w-full"
                />
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  max="20"
                  step="0.01"
                  value={s.grade}
                  onChange={(e) => updateSubject(s.id, "grade", e.target.value)}
                  className="text-sm text-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-full"
                  dir="ltr"
                />
                <input
                  type="number"
                  placeholder="1"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={s.coef}
                  onChange={(e) => updateSubject(s.id, "coef", e.target.value)}
                  className="text-sm text-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-full"
                  dir="ltr"
                />
                <button
                  onClick={() => removeSubject(s.id)}
                  disabled={subjects.length <= 1}
                  className="flex items-center justify-center text-slate-300 hover:text-red-400 disabled:opacity-0 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-slate-100">
            <button
              onClick={addSubject}
              className="flex items-center gap-2 text-sm text-primary font-semibold hover:opacity-80 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              إضافة مادة
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          المعدل المحسوب تقديري فقط ولا يمثل نتيجة رسمية
        </p>
      </div>
    </div>
  );
}
