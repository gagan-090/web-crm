import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../app/providers/AuthProvider';
import useCrmTheme from '../shared/theme/useCrmTheme';
import AshokaChakra from '../shared/components/AshokaChakra';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isTricolor: IS_TRICOLOR_THEME } = useCrmTheme();
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <div className="flex flex-col items-center gap-md">
          {IS_TRICOLOR_THEME ? (
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-amber-500/30 shadow-xl">
              <div className="relative p-4 rounded-full bg-gradient-to-br from-amber-500/10 via-white to-emerald-500/10 border border-amber-500/30 shadow-md">
                <AshokaChakra size={48} className="text-[#17376B] animate-spin-slow" />
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#FF9933] animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <div className="text-center space-y-1">
                <p className="font-headline-md text-base font-black text-[#17376B] tracking-tight">
                  TruckMitr Enterprise CRM
                </p>
                <p className="text-xs font-bold text-amber-800 tracking-widest font-hindi uppercase">
                  स्वतंत्रता दिवस विशेष • loading session
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="font-label-caps text-outline">Loading session...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
