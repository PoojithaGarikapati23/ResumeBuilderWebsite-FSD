import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, ShoppingCart, Users, Store, X, ArrowRight, Loader2 } from 'lucide-react';
import api from '../api/client';
import { formatINR } from '../utils/formatters';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    products: any[];
    orders: any[];
    customers: any[];
    sellers: any[];
  }>({ products: [], orders: [], customers: [], sellers: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ products: [], orders: [], customers: [], sellers: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults({ products: [], orders: [], customers: [], sellers: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query.trim())}`);
        if (res.data.success) {
          setResults(res.data.data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  if (!isOpen) return null;

  const hasResults =
    results.products.length > 0 ||
    results.orders.length > 0 ||
    results.customers.length > 0 ||
    results.sellers.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-start justify-center pt-20 p-4">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
          <div className="flex items-center px-4 py-3.5 border-b border-slate-100">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, orders, customers, sellers... (e.g. Kurti, ORD-1001, Aarohi)"
              className="w-full text-slate-900 placeholder-slate-400 focus:outline-none text-base"
            />
            {loading && <Loader2 className="w-5 h-5 text-brand-500 animate-spin mr-2" />}
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {query.length < 2 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                Type at least 2 characters to search across products, orders, customers, and sellers.
              </div>
            )}

            {query.length >= 2 && !loading && !hasResults && (
              <div className="text-center py-8 text-slate-400 text-sm">
                No matching results found for <span className="font-semibold text-slate-600">"{query}"</span>.
              </div>
            )}

            {/* Products Group */}
            {results.products.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                  <Package className="w-3.5 h-3.5" /> Products ({results.products.length})
                </div>
                <div className="space-y-1">
                  {results.products.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelect(`/dashboard/products?search=${encodeURIComponent(p.sku)}`)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <div>
                        <div className="font-medium text-sm text-slate-800 group-hover:text-brand-600">
                          {p.name}
                        </div>
                        <div className="text-xs text-slate-400">SKU: {p.sku}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-700">{formatINR(p.price)}</span>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Group */}
            {results.orders.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                  <ShoppingCart className="w-3.5 h-3.5" /> Orders ({results.orders.length})
                </div>
                <div className="space-y-1">
                  {results.orders.map((o) => (
                    <div
                      key={o.id}
                      onClick={() => handleSelect(`/dashboard/orders?search=${encodeURIComponent(o.orderNumber)}`)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <div>
                        <div className="font-medium text-sm text-slate-800 group-hover:text-brand-600">
                          Order #{o.orderNumber}
                        </div>
                        <div className="text-xs text-slate-400">Status: {o.status}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-700">{formatINR(o.totalAmount)}</span>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customers Group */}
            {results.customers.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                  <Users className="w-3.5 h-3.5" /> Customers ({results.customers.length})
                </div>
                <div className="space-y-1">
                  {results.customers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleSelect(`/dashboard/customers?search=${encodeURIComponent(c.name)}`)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <div>
                        <div className="font-medium text-sm text-slate-800 group-hover:text-brand-600">{c.name}</div>
                        <div className="text-xs text-slate-400">{c.email}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sellers Group */}
            {results.sellers.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                  <Store className="w-3.5 h-3.5" /> Sellers ({results.sellers.length})
                </div>
                <div className="space-y-1">
                  {results.sellers.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => handleSelect(`/dashboard/sellers?search=${encodeURIComponent(s.businessName)}`)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <div>
                        <div className="font-medium text-sm text-slate-800 group-hover:text-brand-600">
                          {s.businessName}
                        </div>
                        <div className="text-xs text-slate-400">Status: {s.status}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 px-4 py-2 bg-slate-50 flex items-center justify-between text-xs text-slate-400">
            <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-500 font-mono">ESC</kbd> to exit</span>
            <span>HerCart Global Index</span>
          </div>
        </div>
      </div>
    </div>
  );
};
