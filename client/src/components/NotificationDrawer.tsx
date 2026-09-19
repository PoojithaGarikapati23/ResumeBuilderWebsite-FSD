import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCheck, ShoppingBag, AlertTriangle, UserCheck, Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { formatDateTime } from '../utils/formatters';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleClickItem = (n: any) => {
    markAsRead(n.id);
    if (n.link) {
      onClose();
      navigate(n.link);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER':
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case 'INVENTORY':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'SELLER':
        return <UserCheck className="w-4 h-4 text-indigo-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-brand-50 text-brand-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-brand-200">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-brand-50 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleClickItem(n)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex gap-3 ${
                    n.isRead
                      ? 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                      : 'bg-emerald-50/40 border-emerald-100/80 text-slate-900 hover:bg-emerald-50/70 shadow-sm'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-xs shrink-0 self-start">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1">
                      <h4 className="text-sm font-semibold truncate">{n.title}</h4>
                      <span className="text-[11px] text-slate-400 shrink-0">{formatDateTime(n.createdAt)}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
