import React from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "wouter";
import { GraduationCap, User, Phone, Mail, MapPin, BookOpen, LogOut, RefreshCw } from "lucide-react";

export default function Profile() {
  const { profile, user, signOut, refreshProfile, loading } = useAuth();
  const [, setLocation] = useLocation();

  async function handleSignOut() {
    await signOut();
    setLocation("/");
  }

  // Fall back to user metadata if profile row isn't populated yet
  const meta = user?.user_metadata ?? {};
  const displayName    = profile?.name    || meta.name    || null;
  const displayPhone   = profile?.phone   || meta.phone   || null;
  const displayRegion  = profile?.region  || meta.region  || null;
  const displaySection = profile?.section || meta.section || null;
  const displayEmail   = profile?.email   || user?.email  || null;

  const fields = [
    { icon: User,     label: "الاسم",             value: displayName    },
    { icon: Mail,     label: "البريد الإلكتروني", value: displayEmail   },
    { icon: Phone,    label: "رقم الهاتف",        value: displayPhone   },
    { icon: MapPin,   label: "الجهة",             value: displayRegion  },
    { icon: BookOpen, label: "شعبة الباك",        value: displaySection },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    setLocation("/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-14" dir="rtl">
      <header className="bg-primary text-primary-foreground py-10 px-6 rounded-b-[2.5rem] shadow-sm mb-8">
        <div className="container mx-auto max-w-xl flex flex-col items-center text-center">
          <div className="bg-primary-foreground/15 p-5 rounded-full mb-4">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold">{displayName || "ملفي الشخصي"}</h1>
          <p className="text-primary-foreground/70 text-sm mt-1">{displayEmail}</p>
        </div>
      </header>

      <main className="container mx-auto max-w-xl px-4 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-700 text-sm">معلوماتي</h2>
            <button
              onClick={refreshProfile}
              className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
              title="تحديث"
              data-testid="btn-refresh-profile"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
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
                    {value || (
                      <span className="text-slate-400 font-normal">غير محدد</span>
                    )}
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
