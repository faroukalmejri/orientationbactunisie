import React, { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, Briefcase } from "lucide-react";

interface GuideEntry {
  domain: string;
  color: string;
  icon: string;
  programs: { name: string; duration: string; jobs: string[] }[];
}

const guide: GuideEntry[] = [
  {
    domain: "العلوم والتكنولوجيا",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: "💻",
    programs: [
      {
        name: "هندسة المعلوماتية",
        duration: "٥ سنوات",
        jobs: ["مهندس برمجيات", "مطور ويب", "متخصص أمن معلومات", "مدير مشاريع تقنية"],
      },
      {
        name: "الهندسة الكهربائية",
        duration: "٥ سنوات",
        jobs: ["مهندس كهرباء", "مهندس اتصالات", "متخصص طاقة متجددة"],
      },
      {
        name: "الرياضيات والإحصاء",
        duration: "٣ سنوات (ليسانس)",
        jobs: ["إحصائي", "محلل بيانات", "باحث أكاديمي", "محلل مالي"],
      },
    ],
  },
  {
    domain: "العلوم الصحية",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: "🏥",
    programs: [
      {
        name: "الطب البشري",
        duration: "٧ سنوات",
        jobs: ["طبيب عام", "طبيب متخصص", "باحث طبي"],
      },
      {
        name: "الصيدلة",
        duration: "٦ سنوات",
        jobs: ["صيدلاني", "مفتش دواء", "باحث في الأدوية"],
      },
      {
        name: "طب الأسنان",
        duration: "٦ سنوات",
        jobs: ["طبيب أسنان", "أخصائي تقويم", "باحث في طب الفم"],
      },
    ],
  },
  {
    domain: "الاقتصاد والتصرف",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: "📊",
    programs: [
      {
        name: "إدارة الأعمال",
        duration: "٣–٥ سنوات",
        jobs: ["مدير مشاريع", "محلل استراتيجي", "مدير تسويق"],
      },
      {
        name: "المحاسبة والمالية",
        duration: "٣–٥ سنوات",
        jobs: ["محاسب", "مراجع مالي", "مستشار ضريبي"],
      },
      {
        name: "التجارة الدولية",
        duration: "٣ سنوات",
        jobs: ["متخصص تجارة خارجية", "مدير تصدير", "مستشار جمارك"],
      },
    ],
  },
  {
    domain: "الآداب والعلوم الإنسانية",
    color: "bg-violet-100 text-violet-700 border-violet-200",
    icon: "📚",
    programs: [
      {
        name: "آداب عربية",
        duration: "٣ سنوات",
        jobs: ["أستاذ", "صحفي", "مترجم", "كاتب"],
      },
      {
        name: "التاريخ والحضارة",
        duration: "٣ سنوات",
        jobs: ["مؤرخ", "أرشيفي", "مرشد سياحي", "باحث في التراث"],
      },
      {
        name: "علم النفس",
        duration: "٣–٥ سنوات",
        jobs: ["معالج نفسي", "مرشد تربوي", "باحث اجتماعي"],
      },
    ],
  },
];

export default function GuidePage() {
  const [openDomain, setOpenDomain] = useState<string | null>(guide[0].domain);
  const [openProgram, setOpenProgram] = useState<string | null>(null);

  return (
    <div className="min-h-full bg-slate-50 pb-20 pt-6 px-4" dir="rtl">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-amber-100 p-3 rounded-2xl">
            <BookOpen className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">دليل التوجيه</h1>
            <p className="text-slate-500 text-sm">استعرض التخصصات الجامعية وآفاقها المهنية</p>
          </div>
        </div>

        <div className="space-y-3">
          {guide.map((entry) => (
            <div key={entry.domain} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* Domain header */}
              <button
                onClick={() => setOpenDomain(openDomain === entry.domain ? null : entry.domain)}
                className="w-full flex items-center gap-3 px-5 py-4 text-right hover:bg-slate-50 transition-colors"
              >
                <span className="text-2xl">{entry.icon}</span>
                <span className="flex-1 font-bold text-slate-800">{entry.domain}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${entry.color}`}>
                  {entry.programs.length} تخصصات
                </span>
                {openDomain === entry.domain
                  ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                }
              </button>

              {/* Programs */}
              {openDomain === entry.domain && (
                <div className="border-t border-slate-100 divide-y divide-slate-100">
                  {entry.programs.map((prog) => (
                    <div key={prog.name}>
                      <button
                        onClick={() => setOpenProgram(openProgram === prog.name ? null : prog.name)}
                        className="w-full flex items-center gap-3 px-5 py-3.5 text-right hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-slate-700 text-sm">{prog.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">مدة الدراسة: {prog.duration}</p>
                        </div>
                        {openProgram === prog.name
                          ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          : <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        }
                      </button>

                      {openProgram === prog.name && (
                        <div className="px-5 pb-4">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                            <p className="text-xs font-semibold text-slate-500">آفاق مهنية</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {prog.jobs.map((job) => (
                              <span
                                key={job}
                                className={`text-xs font-medium px-3 py-1 rounded-full border ${entry.color}`}
                              >
                                {job}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          المعلومات الواردة تقريبية وقد تتغير وفق السياسات الجامعية
        </p>
      </div>
    </div>
  );
}
