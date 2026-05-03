import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  Calculator,
  Brain,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { path: "/app/orientation", label: "التوجيه",         icon: GraduationCap },
  { path: "/app/calculator",  label: "حساب المعدل",     icon: Calculator    },
  { path: "/app/quiz",        label: "اختبار التوجيه",  icon: Brain         },
  { path: "/app/guide",       label: "دليل التوجيه",    icon: BookOpen      },
  { path: "/app/profile",     label: "حسابي",           icon: User          },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, profile, signOut } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const displayName = profile?.name || user?.user_metadata?.name || "مستخدم";
  const displayEmail = user?.email || "";

  async function handleSignOut() {
    await signOut();
    setLocation("/");
  }

  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <div className="flex flex-col h-full" dir="rtl">
      {/* Brand */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-100">
        <div className="bg-primary/10 p-1.5 rounded-lg">
          <GraduationCap className="w-5 h-5 text-primary" />
        </div>
        <span className="font-black text-slate-800 text-sm">توجيه الباك</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location === path || (path === "/app/orientation" && location === "/app");
          return (
            <button
              key={path}
              onClick={() => { setLocation(path); onNav?.(); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
              data-testid={`nav-${path.split("/").pop()}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {active && <ChevronLeft className="w-3.5 h-3.5 mr-auto opacity-60" />}
            </button>
          );
        })}
      </nav>

      {/* User + sign out */}
      <div className="border-t border-slate-100 px-3 py-4 space-y-1">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50">
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{displayName}</p>
            <p className="text-xs text-slate-400 truncate">{displayEmail}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          data-testid="btn-signout-sidebar"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" dir="rtl">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border-l border-slate-200 h-full order-last">
        <SidebarContent />
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-slate-200 flex items-center justify-between px-4 py-3 h-14">
        <div className="flex items-center gap-2 font-black text-primary text-sm">
          <GraduationCap className="w-4 h-4" />
          توجيه الباك
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          data-testid="btn-menu"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* ── Mobile drawer overlay ── */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative mr-auto w-64 h-full bg-white shadow-2xl flex flex-col">
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-3 left-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
            <SidebarContent onNav={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-14">
        {children}
      </main>
    </div>
  );
}
