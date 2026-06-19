import React from 'react';

export const LoginScreen: React.FC = () => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-md">

<div className="text-center mb-xl">
<h1 className="font-headline-md text-[28px] font-extrabold tracking-tight text-primary leading-tight">
                TruckMitr
            </h1>
<p className="font-label-caps text-outline mt-xs">
                TM Connect — Internal
            </p>
</div>

<div className="w-full max-w-[400px] bg-white border border-outline-variant p-lg rounded-DEFAULT flipkart-shadow">
<form action="#" className="space-y-md" method="POST">

<div className="space-y-xs">
<label className="font-body-hindi text-body-hindi text-on-surface-variant block" htmlFor="email">
                        Email
                    </label>
<input className="w-full px-sm py-sm border border-outline-variant rounded-DEFAULT font-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" id="email" name="email" placeholder="Enter your work email" required type="email"/>
</div>

<div className="space-y-xs">
<div className="flex justify-between items-center">
<label className="font-body-hindi text-body-hindi text-on-surface-variant block" htmlFor="password">
                            Password
                        </label>
<a className="font-label-caps text-primary hover:underline" href="#">Forgot?</a>
</div>
<input className="w-full px-sm py-sm border border-outline-variant rounded-DEFAULT font-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" id="password" name="password" placeholder="••••••••" required type="password"/>
</div>

<button className="w-full bg-[#2874F0] text-white py-sm rounded-DEFAULT font-headline-md text-body-sm font-bold hover:bg-primary-container active:scale-[0.98] transition-transform duration-150 mt-sm" type="submit">
                    Login as Telecalling Head
                </button>
</form>

<div className="mt-lg pt-md border-t border-outline-variant text-center relative" id="role-dropdown">
<button className="inline-flex items-center font-label-caps text-primary hover:text-primary-container transition-colors focus:outline-none">
                    Login as different role
                    <span className="material-symbols-outlined ml-xs text-[18px]">expand_more</span>
</button>

<div className="hidden absolute left-1/2 -translate-x-1/2 mt-xs w-48 bg-white border border-outline-variant rounded-DEFAULT flipkart-shadow z-10 py-xs text-left" id="role-menu">
<a className="block px-md py-sm font-label-caps text-on-surface hover:bg-surface-container-low transition-colors" href="#">System Admin</a>
<a className="block px-md py-sm font-label-caps text-on-surface hover:bg-surface-container-low transition-colors" href="#">Telecalling Agent</a>
<a className="block px-md py-sm font-label-caps text-on-surface hover:bg-surface-container-low transition-colors" href="#">Operations Manager</a>
</div>
</div>
</div>

<footer className="mt-xl text-center">
<p className="font-label-caps text-outline-variant">
                © 2024 TruckMitr Enterprise Solutions
            </p>
<div className="flex gap-md justify-center mt-sm">
<a className="font-label-caps text-outline hover:text-on-surface" href="#">Support</a>
<a className="font-label-caps text-outline hover:text-on-surface" href="#">Privacy</a>
<a className="font-label-caps text-outline hover:text-on-surface" href="#">Terms</a>
</div>
</footer>
</main>
  );
};

export default LoginScreen;
