import React from "react";
import { useLocation } from "wouter";
import {
  GraduationCap,
  Calculator,
  Brain,
  BookOpen,
  ChevronLeft,
  CheckCircle2,
  ArrowLeft,
  Star,
  Users,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "أداة التوجيه",
    desc: "اكتشف الشعب المتاحة بناءً على معدل الباكالوريا الخاص بك مع احتمالات القبول الدقيقة.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Calculator,
    title: "حساب المعدل",
    desc: "احسب معدلك التقديري من درجاتك في مختلف المواد بدقة وسهولة.",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Brain,
    title: "اختبار التوجيه",
    desc: "اكتشف شعبتك المثالية من خلال اختبار ذكي يحلل اهتماماتك وقدراتك.",
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: BookOpen,
    title: "دليل التوجيه",
    desc: "دليل شامل عن جميع التخصصات الجامعية وآفاقها المهنية في تونس.",
    color: "bg-amber-100 text-amber-600",
  },
];

const steps = [
  {
    n: "١",
    title: "أدخل معدلك",
    desc: "اكتب معدل الباكالوريا وشعبتك الدراسية",
  },
  {
    n: "٢",
    title: "استعرض النتائج",
    desc: "شاهد قائمة الشعب المتاحة مرتبة حسب احتمالية القبول",
  },
  {
    n: "٣",
    title: "اختر مسارك",
    desc: "قارن الخيارات واتخذ قرارك بثقة",
  },
];

const stats = [
  { icon: Users, value: "+5000", label: "طالب استفاد" },
  { icon: GraduationCap, value: "+800", label: "تخصص جامعي" },
  { icon: Star, value: "٢٠٢٥", label: "بيانات محدّثة" },
  { icon: TrendingUp, value: "٩٨٪", label: "دقة التوقعات" },
];

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* ── Top nav ── */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-primary text-base">
          <GraduationCap className="w-5 h-5" />
          <span>توجيه الباك</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocation("/login")}
            className="text-sm font-medium text-slate-600 hover:text-primary px-3 py-1.5 rounded-lg transition-colors"
          >
            دخول
          </button>
          <button
            onClick={() => setLocation("/signup")}
            className="text-sm font-bold text-white bg-primary hover:opacity-90 px-4 py-1.5 rounded-full transition-opacity"
          >
            إنشاء حساب
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-emerald-600 text-white px-6 py-24 text-center">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative container mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Star className="w-3.5 h-3.5 fill-current" />
            منصة التوجيه الجامعي في تونس
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight tracking-tight">
            اختر مسارك الجامعي
            <br />
            <span className="text-white/80">بثقة وذكاء</span>
          </h1>
          <p className="text-white/75 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            منصة متكاملة تساعدك على اكتشاف الشعب الجامعية المناسبة لمعدلك، مع أدوات حساب المعدل واختبارات التوجيه.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setLocation("/signup")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-primary font-bold px-8 py-3.5 rounded-2xl hover:bg-white/90 active:scale-95 transition-all shadow-lg shadow-black/10 text-base"
            >
              ابدأ الآن مجاناً
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLocation("/login")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/15 backdrop-blur font-semibold px-8 py-3.5 rounded-2xl hover:bg-white/25 transition-all border border-white/25 text-base"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-slate-50 border-y border-slate-100 px-6 py-10">
        <div className="container mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="inline-flex bg-primary/10 p-2.5 rounded-xl mb-2">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-black text-slate-800">{value}</p>
              <p className="text-slate-500 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">كل ما تحتاجه في مكان واحد</h2>
            <p className="text-slate-500 text-lg">أدوات متكاملة تساعدك على اتخاذ أفضل قرار لمستقبلك</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="group bg-white border border-slate-100 rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default"
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2 text-base">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">كيف يعمل؟</h2>
            <p className="text-slate-500 text-lg">ثلاث خطوات بسيطة للحصول على توصيات دقيقة</p>
          </div>
          <div className="space-y-5">
            {steps.map(({ n, title, desc }, i) => (
              <div key={n} className="flex items-start gap-5">
                <div className="shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-black text-xl shadow-sm shadow-primary/30">
                  {n}
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 flex-1 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
                    <p className="text-slate-500 text-sm">{desc}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <CheckCircle2 className="w-5 h-5 text-primary/40 shrink-0 mt-0.5" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-20 text-center">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-gradient-to-br from-primary to-emerald-600 rounded-3xl p-12 text-white">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-3xl font-black mb-3">ابدأ رحلتك اليوم</h2>
            <p className="text-white/75 mb-8 text-base">أنشئ حسابك مجاناً وابدأ في استكشاف مسارك الجامعي</p>
            <button
              onClick={() => setLocation("/signup")}
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3.5 rounded-2xl hover:bg-white/90 active:scale-95 transition-all shadow-lg shadow-black/10 text-base"
            >
              إنشاء حساب مجاني
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 px-6 py-8 text-center text-slate-400 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <GraduationCap className="w-4 h-4 text-primary" />
          <span className="font-semibold text-slate-600">توجيه الباك</span>
        </div>
        <p>البيانات مأخوذة من نتائج الباكالوريا ٢٠٢٣–٢٠٢٥ · للاستخدام المرجعي فقط</p>
      </footer>
    </div>
  );
}
