import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  Eye,
  ArrowUpDown,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import api from '../../api/client';
import { Product, Category } from '../../types';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { formatINR, formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

export const ProductListPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useNotifications();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [status, setStatus] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: 1,
    description: '',
    price: 0,
    discountPrice: 0,
    taxRate: 5.0,
    stockQuantity: 10,
    lowStockThreshold: 5,
    weightGrams: 250,
    dimensions: '25x20x5 cm',
    status: 'ACTIVE',
    imageUrl: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [page, categoryId, stockStatus, status]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) setCategories(res.data.data);
    } catch {
      // ignore
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/products?page=${page}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (categoryId) url += `&categoryId=${categoryId}`;
      if (stockStatus) url += `&stockStatus=${stockStatus}`;
      if (status) url += `&status=${status}`;

      const res = await api.get(url);
      if (res.data.success) {
        setProducts(res.data.data);
        setTotal(res.data.pagination.total);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      categoryId: categories[0]?.id || 1,
      description: 'Handcrafted with natural materials and traditional weaving techniques.',
      price: 999,
      discountPrice: 899,
      taxRate: 5.0,
      stockQuantity: 25,
      lowStockThreshold: 5,
      weightGrams: 250,
      dimensions: '25x20x5 cm',
      status: 'ACTIVE',
      imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      sku: prod.sku,
      categoryId: prod.categoryId,
      description: prod.description,
      price: prod.price,
      discountPrice: prod.discountPrice || 0,
      taxRate: prod.taxRate,
      stockQuantity: prod.stockQuantity,
      lowStockThreshold: prod.lowStockThreshold,
      weightGrams: prod.weightGrams || 250,
      dimensions: prod.dimensions || '25x20x5 cm',
      status: prod.status,
      imageUrl: prod.images?.[0]?.url || '',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        taxRate: Number(formData.taxRate),
        stockQuantity: Number(formData.stockQuantity),
        lowStockThreshold: Number(formData.lowStockThreshold),
        weightGrams: Number(formData.weightGrams),
        categoryId: Number(formData.categoryId),
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        addToast('success', 'Product updated successfully');
      } else {
        await api.post('/products', payload);
        addToast('success', 'Product created successfully');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      addToast('error', err.response?.data?.message || 'Failed to save product');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      const res = await api.post(`/products/${id}/duplicate`);
      if (res.data.success) {
        addToast('success', 'Product duplicated as draft');
        fetchProducts();
      }
    } catch {
      addToast('error', 'Failed to duplicate product');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete/archive "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      addToast('success', 'Product deleted/archived');
      fetchProducts();
    } catch {
      addToast('error', 'Failed to delete product');
    }
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Product Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your catalog, set pricing, adjust inventory thresholds, and publish items.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={stockStatus}
          onChange={(e) => setStockStatus(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
        >
          <option value="">All Stock</option>
          <option value="in_stock">In Stock (&gt; 5)</option>
          <option value="low_stock">Low Stock (1-5)</option>
          <option value="out_of_stock">Out of Stock (0)</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-24">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-2" />
            <div className="text-xs text-slate-400">Loading catalog items...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            No products match the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category</th>
                  {isSuperAdmin && <th className="py-3 px-4">Seller Store</th>}
                  <th className="py-3 px-4 text-right">Price (₹)</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const stock = p.inventory?.currentStock ?? p.stockQuantity;
                  const primaryImg = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={primaryImg}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200/80 bg-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 line-clamp-1 hover:text-brand-600 cursor-pointer" onClick={() => setViewProduct(p)}>
                              {p.name}
                            </div>
                            <div className="text-[10px] text-slate-400">GST: {p.taxRate}%</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-slate-600 text-[11px]">
                        {p.sku}
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-700">
                        {p.category?.name || 'Handicrafts'}
                      </td>

                      {isSuperAdmin && (
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {p.seller?.businessName || 'Artisan'}
                        </td>
                      )}

                      <td className="py-3 px-4 text-right">
                        <div className="font-extrabold text-slate-900">
                          {formatINR(p.discountPrice || p.price)}
                        </div>
                        {p.discountPrice && p.discountPrice < p.price && (
                          <div className="text-[10px] text-slate-400 line-through">
                            {formatINR(p.price)}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            stock <= 0
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : stock <= p.lowStockThreshold
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {stock} in stock
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <Badge status={p.status} />
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewProduct(p)}
                            title="View Details"
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            title="Edit Product"
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(p.id)}
                            title="Duplicate as Draft"
                            className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Delete / Archive"
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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
          <div>
            Showing {products.length} of {total} products
          </div>
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

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Handcrafted Product'}
        subtitle="Manage product details, pricing, and initial stock."
        maxWidth="2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Cotton Bagru Print Kurti"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                SKU *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="ANU-KRT-101"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Regular Price (₹) *
              </label>
              <input
                type="number"
                step="1"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Sale Price (₹)
              </label>
              <input
                type="number"
                step="1"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                GST Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Initial Stock *
              </label>
              <input
                type="number"
                required
                disabled={!!editingProduct}
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium disabled:bg-slate-100"
              />
              {editingProduct && <span className="text-[10px] text-slate-400">Use Inventory page to adjust</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Low-Stock Threshold
              </label>
              <input
                type="number"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium bg-white"
              >
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={modalLoading}
              className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              {modalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Product Modal */}
      {viewProduct && (
        <Modal
          isOpen={!!viewProduct}
          onClose={() => setViewProduct(null)}
          title={viewProduct.name}
          subtitle={`SKU: ${viewProduct.sku} • Category: ${viewProduct.category?.name}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs text-slate-600">
            <div className="h-48 rounded-xl overflow-hidden bg-slate-100">
              <img
                src={viewProduct.images?.[0]?.url || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'}
                alt={viewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="leading-relaxed">{viewProduct.description}</p>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="font-bold text-slate-900">{formatINR(viewProduct.price)}</span>
              </div>
              {viewProduct.discountPrice && (
                <div className="flex justify-between text-emerald-600">
                  <span>Sale Price:</span>
                  <span className="font-bold">{formatINR(viewProduct.discountPrice)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Stock in Inventory:</span>
                <span className="font-bold text-slate-900">{viewProduct.inventory?.currentStock ?? viewProduct.stockQuantity} units</span>
              </div>
              <div className="flex justify-between">
                <span>Low Stock Threshold:</span>
                <span className="font-semibold">{viewProduct.lowStockThreshold} units</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge status={viewProduct.status} />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
