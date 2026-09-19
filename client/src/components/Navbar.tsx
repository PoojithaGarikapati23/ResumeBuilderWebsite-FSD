import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, LogOut, ChevronDown, UserCheck, ShieldCheck, Store, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { GlobalSearchModal } from './GlobalSearchModal';
import { NotificationDrawer } from './NotificationDrawer';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout, demoLogin } = useAuth();
  const { unreadCount } = useNotifications();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Keyboard shortcut Ctrl+K / Cmd+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDemoSwitch = async (role: 'SUPER_ADMIN' | 'SELLER' | 'STAFF' | 'CUSTOMER') => {
    setDemoMenuOpen(false);
    await demoLogin(role);
    navigate('/dashboard');
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Super Admin</span>;
      case 'SELLER':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Seller</span>;
      case 'STAFF':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Staff Manager</span>;
      default:
        return <span className="bg-slate-50 text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Customer</span>;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Global search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2.5 w-64 md:w-80 px-3.5 py-2 text-sm text-slate-400 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-colors text-left"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span className="flex-1 truncate">Search products, orders...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 rounded">
              Ctrl K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Quick Demo Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-50 hover:bg-amber-100/80 text-amber-800 border border-amber-200/80 rounded-xl transition-colors shadow-xs"
              title="Quick Demo Role Switcher"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Switch Demo Role</span>
              <ChevronDown className="w-3 h-3 text-amber-600" />
            </button>

            {demoMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs animate-in fade-in slide-in-from-top-2"
                onClick={() => setDemoMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Test Personas (1-Click)
                </div>
                <button
                  onClick={() => handleDemoSwitch('SUPER_ADMIN')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-semibold">Super Admin</div>
                    <div className="text-[10px] text-slate-400">admin@hercart.demo</div>
                  </div>
                </button>
                <button
                  onClick={() => handleDemoSwitch('SELLER')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <Store className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-semibold">Seller (Anu Handlooms)</div>
                    <div className="text-[10px] text-slate-400">seller@hercart.demo</div>
                  </div>
                </button>
                <button
                  onClick={() => handleDemoSwitch('STAFF')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <UserIcon className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-semibold">Staff Manager</div>
                    <div className="text-[10px] text-slate-400">staff@hercart.demo</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Notifications button */}
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile menu */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2.5 p-1 pl-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="hidden sm:block text-right">
                <div className="text-xs font-semibold text-slate-900 leading-tight">
                  {user?.name || 'Demo User'}
                </div>
                <div className="mt-0.5">{getRoleBadge(user?.role)}</div>
              </div>
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
                }
                alt="Avatar"
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {profileMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs animate-in fade-in"
                onClick={() => setProfileMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="font-semibold text-slate-800">{user?.name}</div>
                  <div className="text-[11px] text-slate-400">{user?.email}</div>
                  {user?.sellerBusinessName && (
                    <div className="text-[10px] font-semibold text-emerald-600 mt-1">
                      Store: {user.sellerBusinessName}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigate('/dashboard/settings')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700"
                >
                  Settings & Commission
                </button>
                <button
                  onClick={() => navigate('/shop')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700"
                >
                  Public Storefront Preview
                </button>
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationDrawer isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </>
  );
};
