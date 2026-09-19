import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, ShoppingCart, Plus, Minus, X, ArrowRight, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import api from '../../api/client';
import { Product, Category } from '../../types';
import { formatINR } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import { Modal } from '../../components/Modal';

interface CartItem {
  product: Product;
  quantity: number;
}

export const ShopMarketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { addToast } = useNotifications();

  useEffect(() => {
    fetchData();
  }, [selectedCategory, search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get(`/products?limit=50${selectedCategory !== 'ALL' ? `&categoryId=${selectedCategory}` : ''}${search ? `&search=${encodeURIComponent(search)}` : ''}`),
        api.get('/categories'),
      ]);

      if (prodRes.data.success) {
        setProducts(prodRes.data.data);
      }
      if (catRes.data.success) {
        setCategories(catRes.data.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    addToast('success', `Added "${product.name}" to cart`);
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const gst = Math.round(subtotal * 0.05 * 100) / 100;
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 50;
  const total = subtotal + gst + shipping;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);

    try {
      const items = cart.map((c) => ({
        productId: c.product.id,
        quantity: c.quantity,
      }));

      const res = await api.post('/orders', {
        items,
        shippingAddress: {
          name: 'Pooja Sharma',
          street: '12th Cross, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          phone: '+91 99000 12345',
        },
        paymentMethod: 'UPI',
      });

      if (res.data.success) {
        setOrderSuccess(res.data.data);
        setCart([]);
        setCartOpen(false);
        addToast('success', 'Order placed successfully! Inventory updated.');
      }
    } catch (err: any) {
      addToast('error', err.response?.data?.message || 'Checkout failed.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Direct From Makers & Artisans
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Marketplace Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse handcrafted goods, home wear, and regional delicacies directly from independent sellers.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart</span>
            {cart.length > 0 && (
              <span className="w-5 h-5 bg-brand-500 text-white rounded-full flex items-center justify-center text-[10px]">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedCategory === 'ALL'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Items ({products.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(String(c.id))}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === String(c.id)
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-2" />
          <div className="text-xs text-slate-400">Loading authentic artisan products...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
          <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-700 text-sm">No items found</h3>
          <p className="text-xs text-slate-400 mt-1">Try another category or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => {
            const displayPrice = p.discountPrice || p.price;
            const hasDiscount = p.discountPrice && p.discountPrice < p.price;
            const primaryImg = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80';
            const isOutOfStock = (p.inventory?.currentStock || 0) <= 0;

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                <div
                  className="relative h-48 bg-slate-100 cursor-pointer overflow-hidden"
                  onClick={() => setSelectedProduct(p)}
                >
                  <img
                    src={primaryImg}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {hasDiscount && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-rose-600 text-white font-bold text-[10px] rounded-md shadow-xs">
                      SALE
                    </span>
                  )}
                  {isOutOfStock && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-slate-900/80 text-white font-bold text-[10px] rounded-md">
                      Sold Out
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                      {p.seller?.businessName || 'Local Maker'}
                    </div>
                    <h3
                      onClick={() => setSelectedProduct(p)}
                      className="text-sm font-semibold text-slate-900 line-clamp-2 mt-1 hover:text-brand-600 cursor-pointer"
                    >
                      {p.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-extrabold text-base text-slate-900">{formatINR(displayPrice)}</span>
                        {hasDiscount && (
                          <span className="text-xs text-slate-400 line-through">{formatINR(p.price)}</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">Incl. 5% GST</div>
                    </div>

                    <button
                      disabled={isOutOfStock}
                      onClick={() => addToCart(p)}
                      className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={selectedProduct.name}
          subtitle={`By ${selectedProduct.seller?.businessName || 'Artisan'}`}
          maxWidth="2xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-xl overflow-hidden bg-slate-100 h-64">
              <img
                src={selectedProduct.images?.[0]?.url || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  SKU: {selectedProduct.sku}
                </div>
                <div className="text-xl font-black text-slate-900 mt-2">
                  {formatINR(selectedProduct.discountPrice || selectedProduct.price)}
                </div>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {selectedProduct.description}
                </p>
                <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 space-y-1">
                  <div>Stock Available: <strong>{selectedProduct.inventory?.currentStock || selectedProduct.stockQuantity} units</strong></div>
                  <div>Category: <strong>{selectedProduct.category?.name}</strong></div>
                  <div>Origin: <strong>{selectedProduct.seller?.city || 'India'}</strong></div>
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                Add to Cart • {formatINR(selectedProduct.discountPrice || selectedProduct.price)}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-brand-600" />
                  <h2 className="text-lg font-bold text-slate-900">Your Shopping Cart</h2>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 text-sm">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    Your cart is empty.
                  </div>
                ) : (
                  cart.map((item) => {
                    const price = item.product.discountPrice || item.product.price;
                    return (
                      <div key={item.product.id} className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <img
                          src={item.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-lg object-cover bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{item.product.name}</h4>
                          <div className="text-xs font-extrabold text-slate-800 mt-1">{formatINR(price)}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100"
                            >
                              <Minus className="w-3 h-3 text-slate-600" />
                            </button>
                            <span className="text-xs font-bold px-2">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100"
                            >
                              <Plus className="w-3 h-3 text-slate-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-3">
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Items Subtotal:</span>
                      <span className="font-semibold">{formatINR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (5%):</span>
                      <span className="font-semibold">+{formatINR(gst)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span className="font-semibold">{shipping === 0 ? 'FREE' : formatINR(shipping)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                      <span>Total Amount:</span>
                      <span>{formatINR(total)}</span>
                    </div>
                  </div>

                  <button
                    disabled={checkoutLoading}
                    onClick={handleCheckout}
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {checkoutLoading ? 'Placing Order...' : 'Place Test Order (Instant Demonstration)'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {orderSuccess && (
        <Modal
          isOpen={!!orderSuccess}
          onClose={() => setOrderSuccess(null)}
          title="Order Placed Successfully! 🎉"
          subtitle={`Order #${orderSuccess.orderNumber}`}
          maxWidth="md"
        >
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">Thank you for supporting local artisans!</div>
              <p className="text-xs text-slate-500 mt-1">
                Your order of <strong>{formatINR(orderSuccess.totalAmount)}</strong> has been recorded in the database.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-left text-xs text-slate-600 space-y-1 border border-slate-200">
              <div>Order Number: <strong>{orderSuccess.orderNumber}</strong></div>
              <div>Payment: <strong>UPI (Paid)</strong></div>
              <div>Platform Fee Computed: <strong>{formatINR(orderSuccess.platformFee)} (2%)</strong></div>
              <div>Seller Net Payout: <strong>{formatINR(orderSuccess.sellerPayout)}</strong></div>
            </div>

            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
            >
              Continue Shopping
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
