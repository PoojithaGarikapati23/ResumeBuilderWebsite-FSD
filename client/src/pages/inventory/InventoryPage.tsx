import React, { useState, useEffect } from 'react';
import {
  Boxes,
  AlertTriangle,
  XCircle,
  DollarSign,
  Search,
  Plus,
  Minus,
  History,
  Loader2,
  CheckCircle,
  Sliders,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import api from '../../api/client';
import { Inventory, InventoryTransaction } from '../../types';
import { Modal } from '../../components/Modal';
import { formatINR, formatDateTime } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';

export const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<Inventory[]>([]);
  const [kpis, setKpis] = useState<{
    totalItems: number;
    totalStockCount: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalValuation: number;
  }>({ totalItems: 0, totalStockCount: 0, lowStockCount: 0, outOfStockCount: 0, totalValuation: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15;

  // Stock Adjustment Modal
  const [adjustingItem, setAdjustingItem] = useState<Inventory | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustType, setAdjustType] = useState<'add' | 'remove'>('add');
  const [adjustReason, setAdjustReason] = useState<string>('New batch received from workshop');
  const [adjustLoading, setAdjustLoading] = useState(false);

  // History Modal
  const [historyItem, setHistoryItem] = useState<Inventory | null>(null);
  const [historyRecords, setHistoryRecords] = useState<InventoryTransaction[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const { addToast } = useNotifications();

  useEffect(() => {
    fetchInventory();
  }, [page, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInventory();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      let url = `/inventory?page=${page}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (statusFilter) url += `&status=${statusFilter}`;

      const res = await api.get(url);
      if (res.data.success) {
        setItems(res.data.data);
        setKpis(res.data.kpis);
        setTotal(res.data.pagination.total);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const openAdjustModal = (item: Inventory, type: 'add' | 'remove' = 'add') => {
    setAdjustingItem(item);
    setAdjustType(type);
    setAdjustQty(type === 'add' ? 10 : 1);
    setAdjustReason(type === 'add' ? 'New batch received from workshop' : 'Damaged / Defect write-off');
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;
    setAdjustLoading(true);

    try {
      const changeQuantity = adjustType === 'add' ? Number(adjustQty) : -Number(adjustQty);
      const res = await api.post(`/inventory/${adjustingItem.id}/adjust`, {
        changeQuantity,
        reason: adjustReason,
      });

      if (res.data.success) {
        addToast('success', `Stock adjusted for ${adjustingItem.product?.name}`);
        setAdjustingItem(null);
        fetchInventory();
      }
    } catch (err: any) {
      addToast('error', err.response?.data?.message || 'Failed to adjust stock');
    } finally {
      setAdjustLoading(false);
    }
  };

  const openHistoryModal = async (item: Inventory) => {
    setHistoryItem(item);
    setHistoryLoading(true);
    try {
      const res = await api.get(`/inventory/${item.id}/history`);
      if (res.data.success) {
        setHistoryRecords(res.data.data);
      }
    } catch {
      // ignore
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Inventory Management</h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor real-time warehouse stock, track low-inventory alerts, and audit every stock movement.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Stock Quantity</span>
            <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900">
            {kpis.totalStockCount.toLocaleString('en-IN')} units
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across {kpis.totalItems} catalog SKUs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Stock Valuation</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900">
            {formatINR(kpis.totalValuation)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Valued at wholesale selling price</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Low Stock Alert</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-amber-600">
            {kpis.lowStockCount} items
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Less than 5 items remaining</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Out of Stock</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-rose-600">
            {kpis.outOfStockCount} items
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Immediate restock required</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search SKU or product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
        >
          <option value="">All Stock Levels</option>
          <option value="in_stock">In Stock (&gt; 5 units)</option>
          <option value="low_stock">Low Stock (1-5 units)</option>
          <option value="out_of_stock">Out of Stock (0 units)</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-24">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-2" />
            <div className="text-xs text-slate-400">Loading stock records...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            <Boxes className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            No inventory records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4 text-center">Current Stock</th>
                  <th className="py-3 px-4 text-center">Reserved</th>
                  <th className="py-3 px-4 text-center">Available</th>
                  <th className="py-3 px-4 text-center">Low Threshold</th>
                  <th className="py-3 px-4 text-center">Inventory Status</th>
                  <th className="py-3 px-4 text-right">Stock Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((inv) => {
                  const p = inv.product;
                  if (!p) return null;
                  const isOut = inv.currentStock <= 0;
                  const isLow = inv.currentStock <= inv.lowStockThreshold && !isOut;

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{p.name}</div>
                            <div className="text-[10px] text-slate-400">
                              Unit Price: {formatINR(p.discountPrice || p.price)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-slate-600">
                        {p.sku}
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-slate-900 text-sm">
                        {inv.currentStock}
                      </td>

                      <td className="py-3 px-4 text-center text-slate-500 font-medium">
                        {inv.reservedStock}
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-emerald-700">
                        {inv.availableStock}
                      </td>

                      <td className="py-3 px-4 text-center text-slate-400">
                        {inv.lowStockThreshold}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isOut
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isLow
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Optimal'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openAdjustModal(inv, 'add')}
                            title="Add Stock (+)"
                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors font-bold flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add
                          </button>
                          <button
                            onClick={() => openAdjustModal(inv, 'remove')}
                            title="Remove Stock (-)"
                            className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition-colors font-bold flex items-center gap-1"
                          >
                            <Minus className="w-3.5 h-3.5" /> Remove
                          </button>
                          <button
                            onClick={() => openHistoryModal(inv)}
                            title="View Stock Transaction History"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <History className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>Showing {items.length} of {total} records</div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold">Page {page} of {Math.max(1, Math.ceil(total / limit))}</span>
            <button
              disabled={page >= Math.ceil(total / limit)}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustingItem && (
        <Modal
          isOpen={!!adjustingItem}
          onClose={() => setAdjustingItem(null)}
          title={adjustType === 'add' ? 'Restock Product Inventory' : 'Reduce / Write-Off Stock'}
          subtitle={`${adjustingItem.product?.name} (Current: ${adjustingItem.currentStock} units)`}
          maxWidth="md"
        >
          <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setAdjustType('add');
                  setAdjustReason('New batch received from workshop');
                }}
                className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                  adjustType === 'add'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                + Add Stock
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdjustType('remove');
                  setAdjustReason('Damaged / Defect write-off');
                }}
                className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                  adjustType === 'remove'
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                - Deduct Stock
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Quantity ({adjustType === 'add' ? 'to add' : 'to deduct'}) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={adjustQty}
                onChange={(e) => setAdjustQty(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <div className="text-[11px] text-slate-400 mt-1">
                New resulting stock will be:{' '}
                <strong>
                  {adjustType === 'add'
                    ? adjustingItem.currentStock + Number(adjustQty)
                    : Math.max(0, adjustingItem.currentStock - Number(adjustQty))}
                </strong>{' '}
                units
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mandatory Reason for Stock Adjustment *
              </label>
              <input
                type="text"
                required
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="e.g. Received new Pochampally weave batch, Audit correction..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAdjustingItem(null)}
                className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={adjustLoading}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                {adjustLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Adjustment'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Stock Transaction History Modal */}
      {historyItem && (
        <Modal
          isOpen={!!historyItem}
          onClose={() => setHistoryItem(null)}
          title="Stock Transaction Audit History"
          subtitle={`${historyItem.product?.name} (SKU: ${historyItem.product?.sku})`}
          maxWidth="lg"
        >
          <div className="space-y-3">
            {historyLoading ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-600" />
                Loading transaction history...
              </div>
            ) : historyRecords.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No past transactions recorded for this product.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
                {historyRecords.map((t) => {
                  const isPositive = t.changeQuantity > 0;
                  return (
                    <div key={t.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-800">{t.reason}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {formatDateTime(t.createdAt)} • Previous: {t.previousStock} → New: {t.newStock}
                        </div>
                      </div>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          isPositive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {isPositive ? `+${t.changeQuantity}` : t.changeQuantity}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
