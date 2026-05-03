import React, { useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Loader2 } from "lucide-react";

export default function SignIn() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      setLocation("/app/orientation");
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("Invalid login credentials")) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else {
        setError(msg || "حدث خطأ غير متوقع");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex bg-primary/10 p-3 rounded-full mb-3">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">تسجيل الدخول</h1>
          <p className="text-slate-500 text-sm mt-1">مرحباً بك مجدداً</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="signin-form">

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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-password"
                className="h-10"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5" data-testid="signin-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60"
              data-testid="btn-signin"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              دخول
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            ليس لديك حساب؟{" "}
            <button
              onClick={() => setLocation("/signup")}
              className="text-primary font-semibold hover:underline"
              data-testid="link-signup"
            >
              إنشاء حساب
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
