import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { GraduationCap } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4" dir="rtl">
        <div className="bg-primary/10 p-4 rounded-full">
          <GraduationCap className="w-10 h-10 text-primary" />
        </div>
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">جارٍ التحميل...</p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
