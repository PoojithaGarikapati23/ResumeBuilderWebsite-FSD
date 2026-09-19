import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ShieldCheck, Store, User, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      addToast('success', 'Logged in successfully');
      navigate('/dashboard');
    } catch (err: any) {
      addToast('error', err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'SUPER_ADMIN' | 'SELLER' | 'STAFF' | 'CUSTOMER') => {
    setLoading(true);
    try {
      await demoLogin(role);
      addToast('success', `Signed in as Demo ${role.replace('_', ' ')}`);
      navigate('/dashboard');
    } catch (err: any) {
      addToast('error', 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
            HerCart<span className="text-brand-600">.</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900">Sign In to Dashboard</h2>
        <p className="mt-1 text-xs text-slate-500">
          Affordable Digital Commerce for Every Seller & Artisan
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-slate-200/80 space-y-6">
          {/* Quick 1-Click Demo Logins Banner */}
          <div className="bg-gradient-to-b from-amber-50 to-orange-50/50 p-4 rounded-2xl border border-amber-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>1-Click Evaluator Demo Logins</span>
            </div>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              Instantly log in to test role-based permissions and seller data isolation:
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickDemo('SUPER_ADMIN')}
                className="flex items-center gap-2 p-2 bg-white hover:bg-amber-100/50 border border-amber-300 rounded-xl text-left text-xs font-semibold text-slate-800 transition-colors shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                <div className="truncate">
                  <div className="font-bold text-[11px]">Super Admin</div>
                  <div className="text-[9px] text-slate-400">admin@hercart.demo</div>
                </div>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickDemo('SELLER')}
                className="flex items-center gap-2 p-2 bg-white hover:bg-amber-100/50 border border-amber-300 rounded-xl text-left text-xs font-semibold text-slate-800 transition-colors shadow-2xs"
              >
                <Store className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <div className="font-bold text-[11px]">Anu Handlooms</div>
                  <div className="text-[9px] text-slate-400">seller@hercart.demo</div>
                </div>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickDemo('STAFF')}
                className="flex items-center gap-2 p-2 bg-white hover:bg-amber-100/50 border border-amber-300 rounded-xl text-left text-xs font-semibold text-slate-800 transition-colors shadow-2xs"
              >
                <User className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="truncate">
                  <div className="font-bold text-[11px]">Staff Manager</div>
                  <div className="text-[9px] text-slate-400">staff@hercart.demo</div>
                </div>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickDemo('CUSTOMER')}
                className="flex items-center gap-2 p-2 bg-white hover:bg-amber-100/50 border border-amber-300 rounded-xl text-left text-xs font-semibold text-slate-800 transition-colors shadow-2xs"
              >
                <User className="w-4 h-4 text-slate-600 shrink-0" />
                <div className="truncate">
                  <div className="font-bold text-[11px]">Customer</div>
                  <div className="text-[9px] text-slate-400">customer@hercart.demo</div>
                </div>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Or Sign In With Email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hercart.demo or seller@hercart.demo"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin@123 or Seller@123"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Want to start selling your products?{' '}
            <Link to="/onboard" className="font-bold text-brand-600 hover:text-brand-700">
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
