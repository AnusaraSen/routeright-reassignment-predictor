import React, { useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Activity, BookOpen, Layers, Cpu } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMockMode = import.meta.env.VITE_USE_MOCK_API === 'true';

  const navLinks = [
    { to: '/', label: 'Overview', icon: Layers },
    { to: '/predict', label: 'Prediction Console', icon: Activity },
    { to: '/about', label: 'How It Works', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Product Identity */}
          <Link
            to="/"
            className="flex items-center space-x-3.5 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-1 transition-transform"
          >
            {/* Custom Modern Geometric Brand Icon */}
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-1 ring-white/20 group-hover:scale-105 transition-all duration-200">
              <Cpu className="h-5 w-5 text-white" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>

            {/* Brand Title & Typography */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                  RouteRight
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md tracking-wider uppercase shadow-xs">
                  AI
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
                  Decision Support
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium tracking-tight mt-0.5">
                IT Incident Reassignment Predictor
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center space-x-1 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200/70"
            aria-label="Main Navigation"
          >
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isActive
                        ? 'bg-white text-blue-700 shadow-sm font-bold border border-slate-200/40'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Header Controls: Mode Indicator & Quick Action */}
          <div className="flex items-center space-x-3.5">
            {/* System Status Pill */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-100/90 border border-slate-200 text-slate-700"
              title={
                isMockMode
                  ? 'Mock API Mode: Running frontend standalone without requiring a backend server.'
                  : 'Live API Mode: Connected to backend service.'
              }
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isMockMode ? 'bg-blue-400' : 'bg-emerald-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isMockMode ? 'bg-blue-500' : 'bg-emerald-500'
                  }`}
                />
              </span>
              <span className="text-[11px] font-semibold text-slate-600">
                {isMockMode ? 'Standalone Mock' : 'Backend Connected'}
              </span>
            </div>

            {/* Launch Predictor CTA in header */}
            {location.pathname !== '/predict' && (
              <Link to="/predict" className="hidden lg:inline-flex">
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="shadow-sm"
                >
                  Prediction Console
                </Button>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-2 shadow-lg">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-3">
              <span>System Status</span>
              <span className="font-semibold text-slate-700">
                {isMockMode ? 'Standalone Mock Mode' : 'Live API Connected'}
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Outlet />
      </main>

      {/* Modern Refined Footer */}
      <footer className="bg-white border-t border-slate-200/80 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">RouteRight AI</span>
            <span>&bull;</span>
            <span>IT3051 Fundamentals of Data Mining</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="hidden sm:inline">Incident Triage Intelligence</span>
          </div>
          <p className="text-center md:text-right max-w-xl text-slate-400">
            Decision-support tool for IT service desks. Designed to support human triage officers;
            does not automatically reassign tickets.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
