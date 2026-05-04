import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";
import { ALL_REGIONS } from "../utils/regions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface FieldErrors {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  region?: string;
  section?: string;
  consent?: string;
}

interface Touched {
  name: boolean;
  phone: boolean;
  email: boolean;
  password: boolean;
  region: boolean;
  section: boolean;
  consent: boolean;
}

function validate(
  fields: { name: string; phone: string; email: string; password: string; region: string; section: string; consent: boolean },
  touched: Touched
): FieldErrors {
  const errors: FieldErrors = {};

  if (touched.name && !fields.name.trim())
    errors.name = "الاسم الكامل مطلوب";

  if (touched.phone && !fields.phone.trim())
    errors.phone = "رقم الهاتف مطلوب";

  if (touched.email) {
    if (!fields.email.trim()) errors.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      errors.email = "صيغة البريد الإلكتروني غير صحيحة";
  }

  if (touched.password) {
    if (!fields.password) errors.password = "كلمة المرور مطلوبة";
    else if (fields.password.length < 6) errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
  }

  if (touched.region && !fields.region)
    errors.region = "الجهة مطلوبة";

  if (touched.section && !fields.section)
    errors.section = "شعبة الباك مطلوبة";

  if (touched.consent && !fields.consent)
    errors.consent = "يجب قبول استقبال التحديثات للمتابعة";

  return errors;
}

function isFormValid(fields: { name: string; phone: string; email: string; password: string; region: string; section: string; consent: boolean }): boolean {
  return (
    !!fields.name.trim() &&
    !!fields.phone.trim() &&
    !!fields.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) &&
    fields.password.length >= 6 &&
    !!fields.region &&
    !!fields.section &&
    fields.consent
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1" role="alert">
      <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
      <p className="text-xs text-red-500">{msg}</p>
    </div>
  );
}

export default function SignUp() {
  const [, setLocation] = useLocation();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("");
  const [section, setSection] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [domaines, setDomaines] = useState<string[]>([]);

  const [touched, setTouched] = useState<Touched>({
    name: false, phone: false, email: false,
    password: false, region: false, section: false, consent: false,
  });

  const fields = { name, phone, email, password, region, section, consent };
  const errors = validate(fields, touched);
  const canSubmit = isFormValid(fields) && !loading;

  function touch(field: keyof Touched) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function touchAll() {
    setTouched({ name: true, phone: true, email: true, password: true, region: true, section: true, consent: true });
  }

  // Fetch distinct BAC sections from Supabase orientations table
  useEffect(() => {
    supabase
      .from("orientations")
      .select("baccalaureat")
      .order("baccalaureat")
      .then(({ data: rows }) => {
        if (rows && rows.length > 0) {
          const unique = Array.from(new Set(rows.map((r: any) => r.baccalaureat).filter(Boolean)));
          setDomaines(unique as string[]);
        }
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    touchAll();
    setSubmitError(null);

    if (!isFormValid(fields)) return;

    setLoading(true);
    const consentAt = new Date().toISOString();

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            region,
            section,
            marketing_consent: consent,
            marketing_consent_at: consentAt,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("فشل إنشاء الحساب");

      const userId = authData.user.id;

      if (authData.session) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert([{
            id: userId,
            name,
            phone,
            region,
            section,
            email,
            marketing_consent: consent,
            marketing_consent_at: consentAt,
          }]);

        if (profileError) {
          console.warn("[signup] profile upsert warning:", profileError.message);
        }
        setLocation("/app/orientation");
      } else {
        setNeedsConfirmation(true);
      }
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("already registered") || msg.includes("User already registered")) {
        setSubmitError("هذا البريد الإلكتروني مسجل مسبقاً. جرب تسجيل الدخول.");
      } else {
        setSubmitError(msg || "حدث خطأ غير متوقع");
      }
    } finally {
      setLoading(false);
    }
  }

  if (needsConfirmation) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-sm text-center bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="inline-flex bg-emerald-50 p-4 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">تحقق من بريدك الإلكتروني</h2>
          <p className="text-slate-500 text-sm mb-6">
            أرسلنا رابط تأكيد إلى{" "}
            <span className="font-semibold text-slate-700">{email}</span>.{" "}
            بعد التأكيد، سيتم حفظ بياناتك تلقائياً.
          </p>
          <button
            onClick={() => setLocation("/login")}
            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            الذهاب إلى تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-10" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex bg-primary/10 p-3 rounded-full mb-3">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">إنشاء حساب جديد</h1>
          <p className="text-slate-500 text-sm mt-1">انضم لمنصة توجيه الباكالوريا</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate data-testid="signup-form">

            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs text-slate-500 font-medium">
                الاسم الكامل <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="أدخل اسمك الكامل"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => touch("name")}
                data-testid="input-name"
                className={`h-10 ${touched.name && errors.name ? "border-red-400 focus-visible:ring-red-300" : ""}`}
              />
              <FieldError msg={touched.name ? errors.name : undefined} />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs text-slate-500 font-medium">
                رقم الهاتف <span className="text-red-400">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="مثال: 22 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => touch("phone")}
                data-testid="input-phone"
                className={`h-10 ${touched.phone && errors.phone ? "border-red-400 focus-visible:ring-red-300" : ""}`}
              />
              <FieldError msg={touched.phone ? errors.phone : undefined} />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs text-slate-500 font-medium">
                البريد الإلكتروني <span className="text-red-400">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => touch("email")}
                data-testid="input-email"
                className={`h-10 text-left ${touched.email && errors.email ? "border-red-400 focus-visible:ring-red-300" : ""}`}
                dir="ltr"
              />
              <FieldError msg={touched.email ? errors.email : undefined} />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs text-slate-500 font-medium">
                كلمة المرور <span className="text-red-400">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="6 أحرف على الأقل"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => touch("password")}
                data-testid="input-password"
                className={`h-10 ${touched.password && errors.password ? "border-red-400 focus-visible:ring-red-300" : ""}`}
              />
              <FieldError msg={touched.password ? errors.password : undefined} />
            </div>

            {/* Region + Section */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-slate-500 font-medium">
                  الجهة <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={region}
                  onValueChange={(v) => { setRegion(v); touch("region"); }}
                >
                  <SelectTrigger
                    data-testid="select-region"
                    className={`h-10 ${touched.region && errors.region ? "border-red-400" : ""}`}
                    onBlur={() => touch("region")}
                  >
                    <SelectValue placeholder="اختر جهتك" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[220px] overflow-y-auto">
                    {ALL_REGIONS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError msg={touched.region ? errors.region : undefined} />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-500 font-medium">
                  شعبة الباك <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={section}
                  onValueChange={(v) => { setSection(v); touch("section"); }}
                >
                  <SelectTrigger
                    data-testid="select-section"
                    className={`h-10 ${touched.section && errors.section ? "border-red-400" : ""}`}
                    onBlur={() => touch("section")}
                  >
                    <SelectValue placeholder="اختر شعبتك" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[220px] overflow-y-auto">
                    {domaines.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError msg={touched.section ? errors.section : undefined} />
              </div>
            </div>

            {/* Marketing consent */}
            <div className={`rounded-xl border p-4 transition-colors ${
              touched.consent && errors.consent
                ? "border-red-300 bg-red-50"
                : consent
                ? "border-primary/30 bg-primary/5"
                : "border-slate-200 bg-slate-50"
            }`}>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => { setConsent(e.target.checked); touch("consent"); }}
                    data-testid="checkbox-consent"
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      consent
                        ? "bg-primary border-primary"
                        : touched.consent && errors.consent
                        ? "border-red-400 bg-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {consent && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-600 leading-relaxed">
                  أوافق على استقبال رسائل بريد إلكتروني حول المحتوى التعليمي والتحديثات والحملات التسويقية من المنصة.
                  أفهم أنه يمكنني إلغاء الاشتراك في أي وقت.
                  <span className="text-red-400 mr-1">*</span>
                </span>
              </label>
              <FieldError msg={touched.consent ? errors.consent : undefined} />
            </div>

            {/* Submit error */}
            {submitError && (
              <div
                className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3"
                data-testid="signup-error"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
              data-testid="btn-signup"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جارٍ الإنشاء...
                </>
              ) : (
                "إنشاء الحساب"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            لديك حساب؟{" "}
            <button
              onClick={() => setLocation("/login")}
              className="text-primary font-semibold hover:underline"
              data-testid="link-signin"
            >
              تسجيل الدخول
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
