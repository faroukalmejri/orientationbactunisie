import React, { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";
import { useCSVData } from "../hooks/useCSVData";
import { ALL_REGIONS } from "../utils/regions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Loader2 } from "lucide-react";

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
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("فشل إنشاء الحساب");

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: authData.user.id,
        name,
        phone,
        region,
        section,
        email,
      });

      if (profileError) throw profileError;

      setLocation("/");
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
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
