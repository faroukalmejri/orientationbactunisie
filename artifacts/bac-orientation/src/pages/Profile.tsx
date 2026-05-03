import React from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "wouter";
import { GraduationCap, User, Phone, Mail, MapPin, BookOpen, LogOut } from "lucide-react";

export default function Profile() {
  const { profile, user, signOut } = useAuth();
  const [, setLocation] = useLocation();

  async function handleSignOut() {
    await signOut();
    setLocation("/");
  }

  const fields = [
    { icon: User,      label: "الاسم",              value: profile?.name },
    { icon: Mail,      label: "البريد الإلكتروني",   value: profile?.email || user?.email },
    { icon: Phone,     label: "رقم الهاتف",          value: profile?.phone },
    { icon: MapPin,    label: "الجهة",               value: profile?.region },
    { icon: BookOpen,  label: "شعبة الباك",          value: profile?.section },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20" dir="rtl">
      <header className="bg-primary text-primary-foreground py-10 px-6 rounded-b-[2.5rem] shadow-sm mb-8">
        <div className="container mx-auto max-w-xl flex flex-col items-center text-center">
          <div className="bg-primary-foreground/15 p-5 rounded-full mb-4">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold">{profile?.name || "الملف الشخصي"}</h1>
          <p className="text-primary-foreground/70 text-sm mt-1">{profile?.email || user?.email}</p>
        </div>
      </header>

      <main className="container mx-auto max-w-xl px-4 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700 text-sm">معلوماتي</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {fields.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 px-5 py-4">
                <div className="bg-primary/8 p-2 rounded-lg shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-400 font-medium">{label}</p>
                  <p className="text-slate-800 font-medium text-sm truncate">
                    {value || <span className="text-slate-400 font-normal">غير محدد</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setLocation("/")}
          className="w-full bg-white border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm"
          data-testid="btn-go-home"
        >
          العودة إلى التوجيه
        </button>

        <button
          onClick={handleSignOut}
          className="w-full bg-red-50 border border-red-200 text-red-600 font-semibold py-3 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm"
          data-testid="btn-signout"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </button>
      </main>
    </div>
  );
}
