import React, { useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Activity, BookOpen, Layers } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Overview', icon: Layers },
    { to: '/predict', label: 'Prediction Console', icon: Activity },
    { to: '/about', label: 'How It Works', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all shadow-xs">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 h-20 grid grid-cols-12 items-center">
          {/* Left Column: Logo & Product Identity */}
          <div className="col-span-8 md:col-span-3 flex items-center justify-start">
            <Link
              to="/"
              aria-label="RouteRight AI"
              className="flex flex-col group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-1 transition-all"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
                  RouteRight
                </span>
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-xs font-black px-2 py-0.5 rounded-md tracking-wider uppercase shadow-xs">
                  AI
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium tracking-tight mt-1">
                IT Incident Reassignment Predictor
              </span>
            </Link>
          </div>

          {/* Center Column: Navigation Tabs (Mathematically Centered in 12-Column Grid) */}
          <div className="col-span-6 hidden md:flex items-center justify-center">
            <nav
              className="flex items-center space-x-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-xs"
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
                      `flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-600/30'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Right Column: Prediction Console CTA & Mobile Toggle */}
          <div className="col-span-4 md:col-span-3 flex items-center justify-end space-x-3">
            {location.pathname !== '/predict' && (
              <Link to="/predict" className="hidden lg:inline-flex">
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="px-6 py-2.5 text-xs font-bold min-w-[185px] shadow-md shadow-blue-500/20 justify-center"
                >
                  Prediction Console
                </Button>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="md:hidden p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-auto"
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
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-10">
        <Outlet />
      </main>

      {/* Modern Refined Footer */}
      <footer className="bg-white border-t border-slate-200/80 mt-auto py-8">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
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
