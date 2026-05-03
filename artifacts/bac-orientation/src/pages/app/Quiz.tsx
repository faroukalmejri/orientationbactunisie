import React, { useState } from "react";
import { Brain, ChevronLeft, RotateCcw, CheckCircle2 } from "lucide-react";

interface Question {
  id: number;
  text: string;
  options: { label: string; value: string }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "ما هو المجال الأكثر إثارة لاهتمامك؟",
    options: [
      { label: "العلوم والتكنولوجيا", value: "science" },
      { label: "الأدب والفنون والإنسانيات", value: "arts" },
      { label: "الاقتصاد والأعمال", value: "business" },
      { label: "الصحة والطب", value: "health" },
    ],
  },
  {
    id: 2,
    text: "ما نوع العمل الذي تفضله؟",
    options: [
      { label: "التحليل وحل المشكلات المعقدة", value: "analytical" },
      { label: "التواصل مع الناس ومساعدتهم", value: "social" },
      { label: "الإبداع والتصميم والابتكار", value: "creative" },
      { label: "التنظيم والإدارة والتخطيط", value: "managerial" },
    ],
  },
  {
    id: 3,
    text: "كيف تصف نفسك في العمل الجماعي؟",
    options: [
      { label: "قائد يوجّه الفريق", value: "leader" },
      { label: "منفذ يُنجز المهام بدقة", value: "executor" },
      { label: "مبدع يطرح أفكاراً جديدة", value: "innovator" },
      { label: "وسيط يحل النزاعات", value: "mediator" },
    ],
  },
  {
    id: 4,
    text: "أي من هذه المواد تجدها أكثر سهولة؟",
    options: [
      { label: "الرياضيات والفيزياء", value: "math" },
      { label: "التاريخ والجغرافيا", value: "humanities" },
      { label: "العلوم البيولوجية", value: "biology" },
      { label: "الاقتصاد والإحصاء", value: "economics" },
    ],
  },
  {
    id: 5,
    text: "ما هو هدفك المهني على المدى البعيد؟",
    options: [
      { label: "العمل في شركة كبرى أو مؤسسة دولية", value: "corporate" },
      { label: "فتح مشروع خاص بي", value: "entrepreneur" },
      { label: "العمل في الخدمة العامة أو التدريس", value: "public" },
      { label: "البحث العلمي والأكاديميا", value: "research" },
    ],
  },
];

const domainMap: Record<string, { title: string; programs: string[]; color: string }> = {
  science: {
    title: "العلوم والتكنولوجيا",
    programs: ["هندسة المعلوماتية", "الهندسة الكهربائية", "الفيزياء التطبيقية", "الرياضيات"],
    color: "bg-blue-100 text-blue-700",
  },
  arts: {
    title: "الآداب والإنسانيات",
    programs: ["آداب عربية", "الفلسفة", "التاريخ والحضارة", "الفنون التشكيلية"],
    color: "bg-violet-100 text-violet-700",
  },
  business: {
    title: "الاقتصاد والتصرف",
    programs: ["إدارة الأعمال", "المحاسبة", "التسويق", "المالية والبنوك"],
    color: "bg-amber-100 text-amber-700",
  },
  health: {
    title: "العلوم الصحية",
    programs: ["الطب البشري", "طب الأسنان", "الصيدلة", "علم التمريض"],
    color: "bg-emerald-100 text-emerald-700",
  },
};

function getResult(answers: string[]): keyof typeof domainMap {
  const counts: Record<string, number> = { science: 0, arts: 0, business: 0, health: 0 };
  const map: Record<string, keyof typeof domainMap> = {
    science: "science", analytical: "science", math: "science", research: "science",
    arts: "arts", creative: "arts", humanities: "arts", mediator: "arts",
    business: "business", managerial: "business", economics: "business", entrepreneur: "business",
    health: "health", social: "health", biology: "health", public: "health",
    leader: "business", executor: "science", innovator: "arts", corporate: "business",
  };
  for (const a of answers) {
    const domain = map[a];
    if (domain) counts[domain]++;
  }
  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]) as keyof typeof domainMap;
}

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [resultKey, setResultKey] = useState<keyof typeof domainMap | null>(null);

  function handleNext() {
    if (!selected) return;
    const newAnswers = [...answers, selected];
    if (current + 1 >= questions.length) {
      setResultKey(getResult(newAnswers));
      setDone(true);
    } else {
      setAnswers(newAnswers);
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  function reset() {
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setDone(false);
    setResultKey(null);
  }

  const result = resultKey ? domainMap[resultKey] : null;
  const progress = ((current) / questions.length) * 100;

  return (
    <div className="min-h-full bg-slate-50 pb-20 pt-6 px-4" dir="rtl">
      <div className="container mx-auto max-w-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-violet-100 p-3 rounded-2xl">
            <Brain className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">اختبار التوجيه</h1>
            <p className="text-slate-500 text-sm">اكتشف التخصص المناسب لشخصيتك واهتماماتك</p>
          </div>
        </div>

        {done && result ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-5">
            <div className="inline-flex bg-primary/10 p-5 rounded-full">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">نتيجتك</p>
              <h2 className="text-2xl font-black text-slate-800">{result.title}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-600 mb-3">التخصصات المقترحة:</p>
              <div className="space-y-2">
                {result.programs.map((p) => (
                  <div key={p} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${result.color}`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-2 mx-auto text-sm text-primary font-semibold hover:opacity-80 transition-opacity"
            >
              <RotateCcw className="w-4 h-4" />
              إعادة الاختبار
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
            {/* Progress */}
            <div className="h-1.5 bg-slate-100">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="p-6">
              <p className="text-xs text-slate-400 font-medium mb-4">
                السؤال {current + 1} من {questions.length}
              </p>
              <h2 className="text-lg font-bold text-slate-800 mb-6 leading-relaxed">
                {questions[current].text}
              </h2>
              <div className="space-y-2.5">
                {questions[current].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelected(opt.value)}
                    className={`w-full text-right px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-150 ${
                      selected === opt.value
                        ? "border-primary bg-primary/8 text-primary"
                        : "border-slate-200 text-slate-700 hover:border-primary/40 hover:bg-slate-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={!selected}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 rounded-xl disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all"
              >
                {current + 1 === questions.length ? "عرض النتيجة" : "السؤال التالي"}
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
