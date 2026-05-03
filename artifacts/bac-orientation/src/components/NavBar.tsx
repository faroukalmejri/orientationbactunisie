import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, User, LogIn } from "lucide-react";

export function NavBar() {
  const [location, setLocation] = useLocation();
  const { user, profile, loading } = useAuth();

  const isAuthPage = location === "/signin" || location === "/signup";
  if (isAuthPage) return null;

  return (
    <div
      className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 py-3 bg-white/80 backdrop-blur-md border-b border-slate-200/70 shadow-sm"
      dir="rtl"
      data-testid="navbar"
    >
      <button
        onClick={() => setLocation("/")}
        className="flex items-center gap-2 font-bold text-primary text-sm"
        data-testid="nav-home"
      >
        <GraduationCap className="w-5 h-5" />
        توجيه الباك
      </button>

      {!loading && (
        <div>
          {user ? (
            <button
              onClick={() => setLocation("/profile")}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-primary transition-colors bg-slate-100 hover:bg-primary/10 px-3 py-1.5 rounded-full"
              data-testid="nav-profile"
            >
              <User className="w-4 h-4" />
              {profile?.name || "ملفي"}
            </button>
          ) : (
            <button
              onClick={() => setLocation("/signin")}
              className="flex items-center gap-2 text-sm font-medium text-white bg-primary hover:opacity-90 px-4 py-1.5 rounded-full transition-opacity"
              data-testid="nav-signin"
            >
              <LogIn className="w-4 h-4" />
              دخول
            </button>
          )}
        </div>
      )}
    </div>
  );
}
