import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { loginSchema, type LoginInput } from '../../../shared/validations/loginSchema';
import useCrmTheme from '../../../shared/theme/useCrmTheme';
import AshokaChakra from '../../../shared/components/AshokaChakra';
import ChakraMedallion from '../../../shared/components/ChakraMedallion';
import loginBg from '../../../assets/theme/login_bg.jpg';

export const LoginPage: React.FC = () => {
  const { isTricolor: IS_TRICOLOR_THEME, greetingHi, greetingEn } = useCrmTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setServerError(null);
      const user = await login(data.email, undefined, data.password);
      if (user) {
        navigate('/');
      } else {
        setServerError('Invalid login credentials.');
      }
    } catch (err) {
      setServerError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center px-md min-h-screen bg-background relative select-none overflow-hidden">
      {/* Backdrop.
          The artwork keeps its detail at the edges — India Gate bottom-left,
          the Taj and fireworks right — and is veiled in the MIDDLE, where the
          sign-in card and the identity block sit. A flat veil would either
          wash the whole scene out or leave the wordmark fighting the sky; the
          radial keeps both ends of that trade. */}
      {IS_TRICOLOR_THEME && (
        <>
          <div
            className="absolute inset-0 pointer-events-none bg-cover bg-center"
            style={{ backgroundImage: `url(${loginBg})` }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(58% 62% at 50% 48%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 55%, rgba(255,255,255,0.28) 100%)',
            }}
          />
        </>
      )}

      {/* Visual Accent Top Line */}
      <div className={`fixed top-0 left-0 w-full h-[4px] ${IS_TRICOLOR_THEME ? 'bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shadow-sm' : 'bg-primary'}`} />

      {/* Main Container */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center w-full max-w-md py-xl px-sm">
        {/* Identity Section */}
        <div className="text-center mb-lg">
          {IS_TRICOLOR_THEME ? (
            <div className="flex justify-center mb-3">
              <ChakraMedallion size={68} className="drop-shadow-md animate-scale-in" />
            </div>
          ) : (
            <div className="flex justify-center mb-3">
              <AshokaChakra size={38} className="opacity-95 text-primary" />
            </div>
          )}

          <h1 className="font-headline-md text-[32px] font-black tracking-tight text-primary leading-tight">
            TruckMitr
          </h1>
          <p className="font-label-caps text-outline mt-xs text-xs tracking-widest font-bold">
            TM CONNECT — ENTERPRISE CRM
          </p>

          {IS_TRICOLOR_THEME && (
            <div className="mt-md flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-amber-500/30 shadow-md">
              <span className="tm-flag-rule block h-[3px] w-36 rounded-full" />
              <p className="tm-id-caption font-hindi text-[14px] font-extrabold text-amber-900 leading-tight">
                {greetingHi}
              </p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#17376B] font-black flex items-center gap-2">
                <span>{greetingEn}</span>
                <span className="text-amber-600">•</span>
                <span className="font-hindi text-amber-800 font-bold">जय हिन्द</span>
              </p>
            </div>
          )}
        </div>

        {/* Login Card */}
        <div className={`w-full bg-white/95 backdrop-blur-md p-lg rounded-2xl flex flex-col transition-all duration-300 ${
          IS_TRICOLOR_THEME 
            ? 'border-2 border-amber-500/30 shadow-xl hover:shadow-2xl hover:border-amber-500/40' 
            : 'border border-outline-variant flipkart-shadow'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-md">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface text-center flex-1">
                Official Sign In
              </h2>
              {IS_TRICOLOR_THEME && (
                <AshokaChakra size={18} className="text-[#17376B] animate-spin-slow shrink-0" />
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-md">
              {serverError && (
                <div className="bg-error-container text-on-error-container text-xs p-sm rounded-sm font-semibold border border-error animate-pulse">
                  {serverError}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-xs">
                <label className="font-body-hindi text-body-hindi text-on-surface-variant block text-xs font-semibold" htmlFor="email">
                  Work Email
                </label>
                <input
                  {...register('email')}
                  className={`w-full px-sm py-sm border rounded-lg font-body-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm ${
                    errors.email ? 'border-error' : 'border-outline-variant'
                  }`}
                  id="email"
                  placeholder="name@truckmitr.com"
                  type="email"
                />
                {errors.email && (
                  <p className="text-error text-xs font-semibold">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-xs">
                <div className="flex justify-between items-center">
                  <label className="font-body-hindi text-body-hindi text-on-surface-variant block text-xs font-semibold" htmlFor="password">
                    Password
                  </label>
                  <a className="font-label-caps text-primary hover:underline text-xs font-bold" href="#">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <input
                    {...register('password')}
                    className={`w-full px-sm py-sm pr-10 border rounded-lg font-body-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm ${
                      errors.password ? 'border-error' : 'border-outline-variant'
                    }`}
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors outline-none"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p className="text-error text-xs font-semibold">{errors.password.message}</p>
                )}
              </div>

              {/* Primary Action Button */}
              <button
                disabled={isSubmitting}
                className={`w-full py-sm rounded-lg font-headline-md text-body-sm font-bold text-white shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 mt-sm flex items-center justify-center gap-2 ${
                  IS_TRICOLOR_THEME
                    ? 'bg-gradient-to-r from-[#E2761B] via-[#C05E10] to-[#138808] hover:opacity-95'
                    : 'bg-primary hover:bg-primary-container'
                }`}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <AshokaChakra size={16} className="animate-spin text-white" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer / Support */}
        <footer className="mt-xl text-center">
          <p className="font-label-caps text-outline-variant text-xs font-bold">
            © TruckMitr Corporate Services Pvt. Ltd.
          </p>
          <div className="flex gap-md justify-center mt-sm text-xs font-semibold">
            <a className="font-label-caps text-outline hover:text-on-surface" href="#">
              Support
            </a>
            <a className="font-label-caps text-outline hover:text-on-surface" href="#">
              Privacy
            </a>
            <a className="font-label-caps text-outline hover:text-on-surface" href="#">
              Terms
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LoginPage;
