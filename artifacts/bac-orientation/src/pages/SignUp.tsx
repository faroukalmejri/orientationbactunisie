import React, { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";
import { useCSVData } from "../hooks/useCSVData";
import { ALL_REGIONS } from "../utils/regions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Loader2, CheckCircle } from "lucide-react";

export default function SignUp() {
  const [, setLocation] = useLocation();
  const { data } = useCSVData();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("");
  const [section, setSection] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const domaines = useMemo(() => {
    if (!data) return [];
    const unique = new Set(data.map((r) => r.domaine).filter(Boolean));
    return Array.from(unique).sort();
  }, [data]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !phone || !email || !password || !region || !section) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Sign up — pass profile data as metadata so the DB trigger picks it up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone, region, section },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("فشل إنشاء الحساب");

      const userId = authData.user.id;
      console.log("[signup] user created, id:", userId);

      // Step 2: If we have an active session (email confirmation disabled),
      // insert the profile directly. If not, the DB trigger handles it.
      if (authData.session) {
        console.log("[signup] session active — inserting profile directly");
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert([{ id: userId, name, phone, region, section, email }]);

        if (profileError) {
          // Non-fatal: trigger may have already inserted it
          console.warn("[signup] profile upsert warning:", profileError.message);
        } else {
          console.log("[signup] profile inserted successfully");
        }
        setLocation("/");
      } else {
        // Email confirmation required — profile will be created by DB trigger on confirm
        console.log("[signup] email confirmation required");
        setNeedsConfirmation(true);
      }
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("already registered") || msg.includes("User already registered")) {
        setError("هذا البريد الإلكتروني مسجل مسبقاً. جرب تسجيل الدخول.");
      } else {
        setError(msg || "حدث خطأ غير متوقع");
      }
      console.error("[signup] error:", err);
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
            أرسلنا رابط تأكيد إلى <span className="font-semibold text-slate-700">{email}</span>.
            بعد التأكيد، سيتم حفظ بياناتك تلقائياً.
          </p>
          <button
            onClick={() => setLocation("/signin")}
            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            الذهاب إلى تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex bg-primary/10 p-3 rounded-full mb-3">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">إنشاء حساب جديد</h1>
          <p className="text-slate-500 text-sm mt-1">انضم لمنصة توجيه الباكالوريا</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="signup-form">

            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs text-slate-500 font-medium">الاسم الكامل</Label>
              <Input
                id="name"
                type="text"
                placeholder="أدخل اسمك الكامل"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="input-name"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs text-slate-500 font-medium">رقم الهاتف</Label>
              <Input
                id="phone"
                type="text"
                placeholder="مثال: 22 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                data-testid="input-phone"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-slate-500 font-medium">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-email"
                className="h-10 text-left"
                dir="ltr"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs text-slate-500 font-medium">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="6 أحرف على الأقل"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-password"
                className="h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500 font-medium">الجهة</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger data-testid="select-region" className="h-10">
                    <SelectValue placeholder="اختر جهتك" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_REGIONS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500 font-medium">شعبة الباك</Label>
                <Select value={section} onValueChange={setSection}>
                  <SelectTrigger data-testid="select-section" className="h-10">
                    <SelectValue placeholder="اختر شعبتك" />
                  </SelectTrigger>
                  <SelectContent>
                    {domaines.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5" data-testid="signup-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60"
              data-testid="btn-signup"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              إنشاء الحساب
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            لديك حساب؟{" "}
            <button
              onClick={() => setLocation("/signin")}
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
