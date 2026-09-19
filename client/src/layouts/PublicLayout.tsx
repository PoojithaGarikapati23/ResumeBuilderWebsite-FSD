import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { ToastContainer } from '../components/ToastContainer';
import { useAuth } from '../context/AuthContext';

export const PublicLayout: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Public Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">
              HerCart<span className="text-brand-600">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link
              to="/"
              className={`hover:text-brand-600 transition-colors ${location.pathname === '/' ? 'text-brand-600 font-semibold' : ''}`}
            >
              Overview
            </Link>
            <Link
              to="/pricing"
              className={`hover:text-brand-600 transition-colors ${location.pathname === '/pricing' ? 'text-brand-600 font-semibold' : ''}`}
            >
              Transparent Pricing
            </Link>
            <Link
              to="/shop"
              className={`hover:text-brand-600 transition-colors ${location.pathname === '/shop' ? 'text-brand-600 font-semibold' : ''}`}
            >
              Marketplace Storefront
            </Link>
            <Link
              to="/onboard"
              className={`hover:text-brand-600 transition-colors ${location.pathname === '/onboard' ? 'text-brand-600 font-semibold' : ''}`}
            >
              Sell With Us
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition-colors"
              >
                Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Admin / Seller Login
                </Link>
                <Link
                  to="/onboard"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition-colors"
                >
                  Start Selling
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg text-white">HerCart</span>
              </div>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                Affordable digital commerce platform engineered for home-based businesses, women entrepreneurs, and local artisans to reach buyers nationwide without the burden of physical store rent.
              </p>
              <div className="mt-4 text-xs text-brand-400 font-semibold">
                Transparent 2% Platform Commission • No Hidden Storefront Overheads
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Transparent Pricing</Link></li>
                <li><Link to="/shop" className="hover:text-white transition-colors">Explore Marketplace</Link></li>
                <li><Link to="/onboard" className="hover:text-white transition-colors">Seller Onboarding</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Administration</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/login" className="hover:text-white transition-colors">Admin & Seller Login</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Seller Dashboard</Link></li>
                <li><Link to="/dashboard/inventory" className="hover:text-white transition-colors">Inventory System</Link></li>
                <li><Link to="/dashboard/analytics" className="hover:text-white transition-colors">Sales Analytics</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>© {new Date().getFullYear()} HerCart Platform. Built for inclusive digital selling.</div>
            <div className="flex items-center gap-4">
              <span>Zero Physical Store Rent</span>
              <span>•</span>
              <span>₹ INR Native Commerce</span>
            </div>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};
