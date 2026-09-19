import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Store,
  ShieldCheck,
  Truck,
  HeartHandshake,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Coins,
  ChevronRight,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-gradient-to-b from-brand-50/40 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                Empowering Home Sellers, Women Artisans & Small Makers
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Sell More. <span className="text-brand-600">Travel Less.</span> <br />
                Grow Online.
              </h1>

              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                An affordable digital marketplace that helps home-based businesses, women entrepreneurs, and local artisans reach customers across India—without the burden of physical store rent or complicated tech.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/onboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-lg shadow-brand-600/25 transition-all hover:-translate-y-0.5"
                >
                  Start Selling Today <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-xs"
                >
                  Explore Marketplace <ShoppingBag className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Key Trust Signals */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 max-w-lg">
                <div>
                  <div className="text-2xl font-black text-slate-900">2%</div>
                  <div className="text-xs text-slate-500 font-medium">Low Platform Fee</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">₹0</div>
                  <div className="text-xs text-slate-500 font-medium">Physical Shop Rent</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Transparent Payouts</div>
                </div>
              </div>
            </div>

            {/* Visual Hero Mockup Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
                      alt="Anu"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-900">Anu Handlooms</div>
                      <div className="text-xs text-emerald-600 font-semibold">Verified Home Seller • Hyderabad</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md">Live Store</span>
                </div>

                <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Gross Monthly Sales</span>
                    <span className="font-bold text-slate-900 text-sm">₹84,200</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Platform Commission (2%)</span>
                    <span className="font-bold text-brand-600">- ₹1,684</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Physical Store Rent Saved</span>
                    <span className="font-bold text-emerald-600">+ ₹25,000 / mo</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Net Take-Home Earnings</span>
                    <span className="text-base text-brand-700">₹82,516</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 p-3 bg-brand-50/60 rounded-xl text-xs text-brand-900">
                  <HeartHandshake className="w-5 h-5 text-brand-600 shrink-0" />
                  <span>"I manage 8 handloom products from my living room and reach buyers in Mumbai, Delhi & Bangalore!"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Direct Comparison: Physical Store Rent vs HerCart */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Why Rent a Physical Shop When You Can Sell Online?
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Opening a traditional retail store requires high security deposits, monthly rent, and daily travel that many women entrepreneurs cannot afford. Here is the honest comparison:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Traditional Physical Store */}
          <div className="bg-rose-50/30 border border-rose-200/70 rounded-3xl p-8 relative">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-4 uppercase tracking-wider">
              <XCircle className="w-5 h-5" /> Traditional Physical Retail Shop
            </div>
            <ul className="space-y-4 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>₹15,000 - ₹50,000 / month</strong> in dead rent expenses regardless of whether you make sales.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>₹1,00,000+ advance deposit</strong> locked up that small artisans cannot afford.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Limited walk-in traffic</strong>: Only customers who happen to walk past your street.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Exhausting daily commute</strong>: Hard for homemakers caring for children or elders.</span>
              </li>
            </ul>
          </div>

          {/* HerCart Digital Store */}
          <div className="bg-brand-50/40 border-2 border-brand-500/50 rounded-3xl p-8 relative shadow-lg">
            <div className="flex items-center gap-2 text-brand-800 font-bold text-sm mb-4 uppercase tracking-wider">
              <CheckCircle2 className="w-5 h-5 text-brand-600" /> HerCart Digital Storefront
            </div>
            <ul className="space-y-4 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <span><strong>₹0 upfront rent</strong>: Pay only a transparent 2% platform commission on actual sales.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <span><strong>Zero physical deposit</strong>: Start listing your products with zero financial risk.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <span><strong>Nationwide customer reach</strong>: Ship sarees, spices, pottery, and jewelry to any city.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <span><strong>Work from home</strong>: Manage inventory and orders flexibly on your own schedule.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. How It Works (The 4-Step Journey) */}
      <section className="bg-slate-50 py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">How HerCart Works</h2>
            <p className="mt-3 text-slate-600 text-base">
              A straightforward process designed so that even first-time sellers can be up and running in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 font-black flex items-center justify-center mb-4 text-lg">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Register Your Business</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Provide basic details about your workshop, home products, and payout bank account. Super Admin verifies and activates your store.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 font-black flex items-center justify-center mb-4 text-lg">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">List Your Products</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add photos, descriptions, prices in ₹, and stock counts. Use our bulk CSV import to upload 50+ items in a single click.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 font-black flex items-center justify-center mb-4 text-lg">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Receive & Process Orders</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Get notified when customers purchase. Update status from Confirmed to Processing and Shipped with built-in tracking.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 font-black flex items-center justify-center mb-4 text-lg">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Receive Transparent Payouts</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                See exact breakdowns of every sale: Product Price minus 2% Platform Fee equals your Net Earnings transferred directly to your bank.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Real Seller Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900">Real Sellers. Real Independence.</h2>
          <p className="mt-3 text-slate-600 text-base">
            Meet the artisans and homemakers running digital storefronts on HerCart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"
                  alt="Anu"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Anu Rao</h4>
                  <p className="text-xs text-brand-600 font-semibold">Anu Handlooms (Hyderabad)</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "I weave cotton kurtis and Pochampally sarees with my weavers. Renting a shop in Banjara Hills was ₹35,000/month! With HerCart, I pay only 2% when an order sells, and I ship to happy customers all over India."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Category: Women's Clothing</span>
              <span className="text-slate-900 font-bold">48 Products</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=120&auto=format&fit=crop&q=80"
                  alt="Sita"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Sita Devi Sharma</h4>
                  <p className="text-xs text-brand-600 font-semibold">Sita Organic Spices (Guntur)</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Our sun-dried Avakaya pickles and cold-ground Lakadong turmeric are traditional recipes. The simple dashboard lets me update batch inventory in 10 seconds. Even at age 52, I found it easy to use."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Category: Food & Local Products</span>
              <span className="text-slate-900 font-bold">35 Orders Delivered</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                  alt="Meera"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Meera Kumhar</h4>
                  <p className="text-xs text-brand-600 font-semibold">Meera Artisan Terracotta (Jaipur)</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Pottery is fragile and customers love our handcrafted clay handis and kullad chai cups. Being able to export CSV reports and track inventory prevents overselling and keeps our artisan family profitable."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Category: Home Decor</span>
              <span className="text-slate-900 font-bold">24 Products</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-700 to-emerald-600 rounded-3xl p-10 md:p-14 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-bold">Ready to take your local craft online?</h3>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Join dozens of passionate women entrepreneurs and local makers. Zero upfront fees, 2% transparent commission, and a complete management dashboard.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/onboard"
              className="px-6 py-3.5 bg-white text-brand-800 font-bold rounded-xl text-sm shadow-md hover:bg-emerald-50 transition-colors"
            >
              Start Selling Free
            </Link>
            <Link
              to="/login"
              className="px-6 py-3.5 bg-brand-800/80 text-white font-semibold rounded-xl text-sm border border-emerald-400/30 hover:bg-brand-800 transition-colors"
            >
              Demo Admin Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
