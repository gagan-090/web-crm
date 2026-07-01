import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { loginSchema, type LoginInput } from '../../../shared/validations/loginSchema';


export const LoginPage: React.FC = () => {
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
      // Removed mock selectedRole, login function signature accepts role but ignores it when calling API
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
    <div className="flex-grow flex flex-col items-center justify-center px-md min-h-screen bg-background relative select-none">
      {/* Visual Accent Top Line */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-primary"></div>

      {/* Main Container */}
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-md py-xl">
        {/* Identity Section */}
        <div className="text-center mb-xl">
          <h1 className="font-headline-md text-[28px] font-extrabold tracking-tight text-primary leading-tight">
            TruckMitr
          </h1>
          <p className="font-label-caps text-outline mt-xs text-xs tracking-widest font-bold">
            TM CONNECT — ENTERPRISE CRM
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white border border-outline-variant p-lg rounded-DEFAULT flipkart-shadow flex flex-col">
          <div>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-md text-center">
              Official Sign In
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-md">
              {serverError && (
                <div className="bg-error-container text-on-error-container text-xs p-sm rounded-sm font-semibold border border-error">
                  {serverError}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-xs">
                <label className="font-body-hindi text-body-hindi text-on-surface-variant block text-xs" htmlFor="email">
                  Work Email
                </label>
                <input
                  {...register('email')}
                  className={`w-full px-sm py-sm border rounded-DEFAULT font-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-sm ${errors.email ? 'border-error' : 'border-outline-variant'
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
                  <label className="font-body-hindi text-body-hindi text-on-surface-variant block text-xs" htmlFor="password">
                    Password
                  </label>
                  <a className="font-label-caps text-primary hover:underline text-xs" href="#">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <input
                    {...register('password')}
                    className={`w-full px-sm py-sm pr-10 border rounded-DEFAULT font-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-sm ${errors.password ? 'border-error' : 'border-outline-variant'
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
                className="w-full bg-primary text-white py-sm rounded-DEFAULT font-headline-md text-body-sm font-bold hover:bg-primary-container active:scale-[0.98] transition-transform duration-150 mt-sm"
                type="submit"
              >
                {isSubmitting ? 'Authenticating...' : `Login`}
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
