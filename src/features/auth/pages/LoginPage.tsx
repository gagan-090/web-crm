import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { Role, ROLE_LABELS, ROLE_SHORT_CODES } from '../../../shared/constants/roles';
import { loginSchema, type LoginInput } from '../../../shared/validations/loginSchema';

interface RoleDemoInfo {
  role: Role;
  icon: string;
  desc: string;
  badgeColor: string;
}

const DEMO_ROLES: RoleDemoInfo[] = [
  {
    role: Role.TH,
    icon: 'analytics',
    desc: 'Telecalling Head: Global dashboard overview, backlog sprints, SLA timers, and team monitors.',
    badgeColor: 'bg-primary/10 text-primary border-primary/20'
  },
  {
    role: Role.TL,
    icon: 'groups',
    desc: 'Team Leader: Real-time caller monitoring, daily wrap-ups, callback calendars, and matchmaking.',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
  },
  {
    role: Role.QC,
    icon: 'fact_check',
    desc: 'QC Analyst: Audio evaluation audits, fatal error logging, and calibration session configs.',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
  },
  {
    role: Role.HR,
    icon: 'badge',
    desc: 'HR Executive: Recruiting pipelines, headcount tracking, payroll, exits, and attendance charts.',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
  },
  {
    role: Role.ADMIN,
    icon: 'admin_panel_settings',
    desc: 'System Admin: Webhook logs, routing configs, integrations, health dashboards, and queue configs.',
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
  },
  {
    role: Role.DW,
    icon: 'person_add',
    desc: 'Driver Welcome: Live call queues, scripts, and onboarding active dialer viewport.',
    badgeColor: 'bg-sky-500/10 text-sky-600 border-sky-500/20'
  },
  {
    role: Role.WCT,
    icon: 'local_shipping',
    desc: 'Transporter Welcome: D7 upsell queues, transporter callback lists, and dialer focus.',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20'
  },
  {
    role: Role.MM,
    icon: 'hub',
    desc: 'Matchmaking Caller: Driver matchmaking, placement confirmations, search, and dialer consoles.',
    badgeColor: 'bg-teal-500/10 text-teal-600 border-teal-500/20'
  },
  {
    role: Role.SC,
    icon: 'star',
    desc: 'Special Categories: Absconding trackers, reactivation campaigns, and category scripting.',
    badgeColor: 'bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-500/20'
  }
];

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>(Role.TH);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
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
      const success = await login(data.email, selectedRole);
      if (success) {
        const activeCallerRoles: Role[] = [Role.DW, Role.WCT, Role.MM, Role.SC];
        if (activeCallerRoles.includes(selectedRole)) {
          if (selectedRole === Role.DW) navigate('/dialer/dw/dw-active-call-focus');
          else if (selectedRole === Role.WCT) navigate('/dialer/wct/wct-active-call-focus');
          else if (selectedRole === Role.MM) navigate('/dialer/mm/mm-active-call-focus-refined');
          else if (selectedRole === Role.SC) navigate('/dialer/sc/active-call-focus-special-categories');
        } else {
          navigate('/');
        }
      } else {
        setServerError('Invalid login credentials.');
      }
    } catch (err) {
      setServerError('An error occurred. Please try again.');
    }
  };

  const quickLoginAsRole = async (role: Role) => {
    try {
      setServerError(null);
      const shortCode = ROLE_SHORT_CODES[role];
      const success = await login(`${shortCode}@truckmitr.com`, role);
      if (success) {
        const activeCallerRoles: Role[] = [Role.DW, Role.WCT, Role.MM, Role.SC];
        if (activeCallerRoles.includes(role)) {
          if (role === Role.DW) navigate('/dialer/dw/dw-active-call-focus');
          else if (role === Role.WCT) navigate('/dialer/wct/wct-active-call-focus');
          else if (role === Role.MM) navigate('/dialer/mm/mm-active-call-focus-refined');
          else if (role === Role.SC) navigate('/dialer/sc/active-call-focus-special-categories');
        } else {
          navigate('/');
        }
      } else {
        setServerError('Invalid credentials during simulation login.');
      }
    } catch (err) {
      setServerError('An error occurred during simulator login.');
    }
  };

  const autofillForRole = (role: Role) => {
    setSelectedRole(role);
    const shortCode = ROLE_SHORT_CODES[role];
    setValue('email', `${shortCode}@truckmitr.com`);
    setValue('password', 'password123');
    setRoleMenuOpen(false);
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center px-md min-h-screen bg-background relative select-none">
      {/* Visual Accent Top Line */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-primary"></div>

      {/* Main Container */}
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-[1000px] py-xl">
        {/* Identity Section */}
        <div className="text-center mb-xl">
          <h1 className="font-headline-md text-[28px] font-extrabold tracking-tight text-primary leading-tight">
            TruckMitr
          </h1>
          <p className="font-label-caps text-outline mt-xs text-xs tracking-widest font-bold">
            TM CONNECT — ENTERPRISE CRM
          </p>
        </div>

        {/* Dynamic Multi-column login + simulator */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-lg items-stretch">
          
          {/* Left Column: Official Login Card (40% width) */}
          <div className="md:col-span-5 bg-white border border-outline-variant p-lg rounded-DEFAULT flipkart-shadow flex flex-col justify-between">
            <div>
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-md">
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
                    className={`w-full px-sm py-sm border rounded-DEFAULT font-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-sm ${
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
                    <label className="font-body-hindi text-body-hindi text-on-surface-variant block text-xs" htmlFor="password">
                      Password
                    </label>
                    <a className="font-label-caps text-primary hover:underline text-xs" href="#">
                      Forgot?
                    </a>
                  </div>
                  <input
                    {...register('password')}
                    className={`w-full px-sm py-sm border rounded-DEFAULT font-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-sm ${
                      errors.password ? 'border-error' : 'border-outline-variant'
                    }`}
                    id="password"
                    placeholder="••••••••"
                    type="password"
                  />
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
                  {isSubmitting ? 'Authenticating...' : `Login as ${ROLE_LABELS[selectedRole]}`}
                </button>
              </form>
            </div>

            {/* Role Selection Dropdown */}
            <div className="mt-lg pt-md border-t border-outline-variant text-center relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="inline-flex items-center font-label-caps text-primary hover:text-primary-container transition-colors focus:outline-none text-xs font-bold"
              >
                Simulation Autofill Options
                <span className="material-symbols-outlined ml-xs text-[18px]">expand_more</span>
              </button>

              {roleMenuOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-xs w-56 bg-white border border-outline-variant rounded-DEFAULT flipkart-shadow z-10 py-xs text-left max-h-48 overflow-y-auto custom-scrollbar">
                  {Object.values(Role).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => autofillForRole(r)}
                      className="w-full block px-md py-sm font-label-caps text-on-surface hover:bg-surface-container-low transition-colors text-xs text-left"
                    >
                      {ROLE_LABELS[r]} ({ROLE_SHORT_CODES[r]})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: One-Click Quick Simulator Panel (70% width) */}
          <div className="md:col-span-7 bg-surface-container border border-outline-variant p-lg rounded-DEFAULT flex flex-col justify-between">
            <div>
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-xs">
                Quick Access Simulator
              </h2>
              <p className="text-xs text-outline mb-md font-semibold">
                Simulate role-specific dashboards with one-click secure authentication bypass.
              </p>

              {/* Grid of Roles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm max-h-[400px] overflow-y-auto pr-xs custom-scrollbar">
                {DEMO_ROLES.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => quickLoginAsRole(r.role)}
                    className="p-sm bg-white border border-outline-variant rounded hover:border-primary hover:shadow-sm transition-all duration-200 text-left flex flex-col justify-between group active:scale-[0.99]"
                  >
                    <div className="flex items-center justify-between w-full mb-xs">
                      <div className="flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">
                          {r.icon}
                        </span>
                        <span className="font-label-caps text-[11px] font-bold text-on-surface">
                          {ROLE_LABELS[r.role]}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 border rounded-[4px] text-[8px] font-bold font-data-mono ${r.badgeColor}`}>
                        {ROLE_SHORT_CODES[r.role].toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant leading-snug line-clamp-2">
                      {r.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-md text-[10px] text-outline text-center font-semibold">
              Tip: Live calls simulation runs under the Dialer console viewport. Management roles run under DashboardLayout viewports.
            </div>
          </div>

        </div>

        {/* Footer / Support */}
        <footer className="mt-xl text-center">
          <p className="font-label-caps text-outline-variant text-xs font-bold">
            © 2026 TruckMitr Enterprise Solutions
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
