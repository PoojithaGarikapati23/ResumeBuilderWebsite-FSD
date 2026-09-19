import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import api from '../../api/client';
import { Order } from '../../types';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { formatINR, formatINRWithDecimals, formatDateTime } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

export const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useNotifications();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const limit = 15;

  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusNote, setStatusNote] = useState<string>('');

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, paymentFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = `/orders?page=${page}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (paymentFilter) url += `&paymentStatus=${paymentFilter}`;

      const res = await api.get(url);
      if (res.data.success) {
        setOrders(res.data.data);
        setTotal(res.data.pagination.total);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const openOrderDetail = async (orderId: number) => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      if (res.data.success) {
        setSelectedOrder(res.data.data);
        setNewStatus(res.data.data.status);
        setStatusNote('');
      }
    } catch {
      addToast('error', 'Failed to load order details');
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setStatusLoading(true);

    try {
      const res = await api.put(`/orders/${selectedOrder.id}/status`, {
        status: newStatus,
        note: statusNote || undefined,
      });

      if (res.data.success) {
        addToast('success', `Order status updated to ${newStatus}`);
        setSelectedOrder(res.data.data);
        fetchOrders();
      }
    } catch (err: any) {
      addToast('error', err.response?.data?.message || 'Failed to update order status');
    } finally {
      setStatusLoading(false);
    }
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const parseTimeline = (timelineJson: string) => {
    try {
      const parsed = JSON.parse(timelineJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const parseAddress = (addrJson: string) => {
    try {
      return JSON.parse(addrJson);
    } catch {
      return { name: 'Customer', street: 'Address on file', city: '', state: '', pincode: '' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Order Management</h1>
        <p className="text-xs text-slate-500 mt-1">
          Track customer shipments, process order lifecycles, and inspect transparent fee deductions.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search order number or customer name..."
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
          <option value="">All Order Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
        >
          <option value="">All Payment Statuses</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-24">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-2" />
            <div className="text-xs text-slate-400">Loading orders...</div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            No orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  {isSuperAdmin && <th className="py-3 px-4">Seller Store</th>}
                  <th className="py-3 px-4 text-center">Items</th>
                  <th className="py-3 px-4 text-right">Order Total</th>
                  <th className="py-3 px-4 text-center">Payment</th>
                  <th className="py-3 px-4 text-center">Order Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {o.orderNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{o.customer?.user?.name || 'Customer'}</div>
                      <div className="text-[10px] text-slate-400">{o.customer?.user?.email}</div>
                    </td>

                    {isSuperAdmin && (
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {o.seller?.businessName || 'Seller Store'}
                      </td>
                    )}

                    <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                      {o.items?.length || 1}
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-slate-900">
                      {formatINR(o.totalAmount)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <Badge status={o.paymentStatus} dot={false} />
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <Badge status={o.status} />
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatDateTime(o.createdAt)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openOrderDetail(o.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>Showing {orders.length} of {total} orders</div>
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.orderNumber}`}
          subtitle={`Placed on ${formatDateTime(selectedOrder.createdAt)}`}
          maxWidth="3xl"
        >
          <div className="space-y-6 text-xs text-slate-600">
            {/* 1. Visual Status Pipeline Timeline */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
                Fulfillment Timeline
              </h4>
              <div className="space-y-2">
                {parseTimeline(selectedOrder.timelineJson).map((evt: any, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{evt.status}</span>
                        <span className="text-[10px] text-slate-400">{formatDateTime(evt.timestamp)}</span>
                      </div>
                      {evt.note && <p className="text-slate-500 mt-0.5">{evt.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Customer & Delivery Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                  Customer Profile
                </h4>
                <div className="font-semibold text-slate-800">{selectedOrder.customer?.user?.name || 'Customer'}</div>
                <div>{selectedOrder.customer?.user?.email}</div>
                <div>{selectedOrder.customer?.user?.phone || 'Phone on file'}</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                  Delivery Address
                </h4>
                {(() => {
                  const addr = parseAddress(selectedOrder.shippingAddressJson);
                  return (
                    <div>
                      <div className="font-semibold text-slate-800">{addr.name}</div>
                      <div>{addr.street}</div>
                      <div>{addr.city}, {addr.state} - {addr.pincode}</div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* 3. Ordered Line Items */}
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                Order Items ({selectedOrder.items?.length || 0})
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {selectedOrder.items?.map((it) => (
                  <div key={it.id} className="p-3 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={it.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'}
                        alt={it.product?.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{it.product?.name}</div>
                        <div className="text-[10px] text-slate-400">
                          SKU: {it.product?.sku} • {it.quantity} × {formatINR(it.unitPrice)}
                        </div>
                      </div>
                    </div>
                    <div className="font-extrabold text-slate-900">
                      {formatINR(it.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Itemized Financial Breakdown (Prompt #17 Transparent Model) */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                Transparent Financial Calculation
              </h4>
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-800">{formatINRWithDecimals(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Applicable GST Tax (5%):</span>
                <span className="font-semibold text-slate-800">+{formatINRWithDecimals(selectedOrder.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery / Shipping Fee:</span>
                <span className="font-semibold text-slate-800">+{formatINRWithDecimals(selectedOrder.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-brand-700 font-bold">
                <span>HerCart Platform Commission (2%):</span>
                <span>-{formatINRWithDecimals(selectedOrder.platformFee)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                <span>Final Amount Paid by Buyer:</span>
                <span>{formatINRWithDecimals(selectedOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-brand-50 text-brand-800 rounded-xl font-black text-sm border border-brand-200">
                <span>Seller Net Settlement Payout:</span>
                <span>{formatINRWithDecimals(selectedOrder.sellerPayout)}</span>
              </div>
            </div>

            {/* 5. Update Status Control */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
              <div className="flex-1 space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Progress Order Status:
                </label>
                <div className="flex gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-xs bg-white text-slate-900 focus:outline-none"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Tracking number / note (optional)"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <button
                disabled={statusLoading || newStatus === selectedOrder.status}
                onClick={handleUpdateStatus}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                {statusLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Status'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
