import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  Store,
  FolderTree,
  BarChart3,
  FileText,
  UploadCloud,
  ShieldAlert,
  Settings,
  Store as MarketplaceIcon,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const role = user?.role || 'SELLER';
  const isSuperAdmin = role === 'SUPER_ADMIN';
  const isStaff = role === 'STAFF';

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/dashboard/products', icon: Package },
    { label: 'Inventory', path: '/dashboard/inventory', icon: Boxes },
    { label: 'Orders', path: '/dashboard/orders', icon: ShoppingCart },
    { label: 'Customers', path: '/dashboard/customers', icon: Users },
    // Admin only
    ...(isSuperAdmin || isStaff
      ? [
          { label: 'Sellers', path: '/dashboard/sellers', icon: Store, adminOnly: true },
          { label: 'Categories', path: '/dashboard/categories', icon: FolderTree, adminOnly: true },
        ]
      : []),
    { label: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Reports', path: '/dashboard/reports', icon: FileText },
    { label: 'Bulk Operations', path: '/dashboard/bulk', icon: UploadCloud },
    ...(isSuperAdmin
      ? [
          { label: 'Audit Logs', path: '/dashboard/audit', icon: ShieldAlert, adminOnly: true },
          { label: 'Settings', path: '/dashboard/settings', icon: Settings, adminOnly: true },
        ]
      : []),
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-lg text-slate-900 leading-none tracking-tight">
              HerCart<span className="text-brand-600">.</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5">
              Affordable Digital Commerce
            </div>
          </div>
        </div>

        {/* Seller Info Banner if SELLER */}
        {role === 'SELLER' && user?.sellerBusinessName && (
          <div className="mx-4 mt-3 p-3 bg-brand-50/70 border border-brand-200/60 rounded-xl">
            <div className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">Active Store</div>
            <div className="text-xs font-semibold text-slate-900 truncate mt-0.5">{user.sellerBusinessName}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Low 2% Commission Active</div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-bold shadow-xs border border-brand-200/50'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {item.adminOnly && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-purple-50 text-purple-600 rounded">
                    Admin
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Public Storefront / Landing page quick links */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-1.5">
          <NavLink
            to="/shop"
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <MarketplaceIcon className="w-4 h-4 text-emerald-600" /> Public Storefront
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </NavLink>
          <NavLink
            to="/"
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" /> Landing Page
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </NavLink>
        </div>
      </aside>
    </>
  );
};
