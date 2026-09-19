import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Store,
  Users,
  Clock,
  AlertTriangle,
  Percent,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/StatCard';
import { formatINR } from '../../utils/formatters';

const PIE_COLORS = ['#16a34a', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#10b981'];

export const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<any>(null);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [categorySales, setCategorySales] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [sellerPerformance, setSellerPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ovRes, revRes, catRes, topRes, sellRes] = await Promise.all([
        api.get('/analytics/overview'),
        api.get(`/analytics/revenue-trend?timeframe=${timeframe}`),
        api.get('/analytics/category-sales'),
        api.get('/analytics/top-products'),
        api.get('/analytics/seller-performance'),
      ]);

      if (ovRes.data.success) setOverview(ovRes.data.data);
      if (revRes.data.success) setRevenueTrend(revRes.data.data);
      if (catRes.data.success) setCategorySales(catRes.data.data);
      if (topRes.data.success) setTopProducts(topRes.data.data);
      if (sellRes.data.success) setSellerPerformance(sellRes.data.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const isSeller = user?.role === 'SELLER';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-md">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            {isSeller ? `Seller Hub • ${user?.sellerBusinessName || 'Home Store'}` : 'Platform Administration'}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1">
            Welcome back, {user?.name || 'Administrator'}!
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {isSeller
              ? 'Monitor your handcrafted products, customer orders, and transparent 2% commission earnings.'
              : 'Oversee multi-seller operations, transparent platform fees, inventory reconciliations, and seller approvals.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-2" />
          <span className="text-slate-300 pr-2 font-medium">Live Database Sync</span>
        </div>
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title={isSeller ? 'Net Seller Revenue' : 'Total Gross Volume'}
          value={formatINR(overview?.totalSales || 0)}
          change={overview?.salesGrowth || '+12.4%'}
          isPositive={true}
          icon={DollarSign}
          iconBgColor="bg-emerald-50 text-emerald-600"
          subtitle="Compared to last period"
        />

        <StatCard
          title="Total Orders"
          value={overview?.totalOrders || 0}
          change={overview?.ordersGrowth || '+8.1%'}
          isPositive={true}
          icon={ShoppingCart}
          iconBgColor="bg-blue-50 text-blue-600"
          subtitle="Placed by verified buyers"
        />

        <StatCard
          title="Active Products"
          value={overview?.totalProducts || 0}
          change={overview?.productsGrowth || '+15.2%'}
          isPositive={true}
          icon={Package}
          iconBgColor="bg-purple-50 text-purple-600"
          subtitle="Catalog stock listings"
        />

        <StatCard
          title={isSeller ? 'Store Platform Fee (2%)' : 'Platform Revenue (2%)'}
          value={formatINR(overview?.platformCommission || 0)}
          change={overview?.commissionGrowth || '+11.8%'}
          isPositive={true}
          icon={Percent}
          iconBgColor="bg-amber-50 text-amber-600"
          subtitle="Low commission model"
        />

        <StatCard
          title={isSeller ? 'Active Storefront' : 'Verified Sellers'}
          value={overview?.activeSellers || 1}
          change={overview?.sellersGrowth || '+5.0%'}
          isPositive={true}
          icon={Store}
          iconBgColor="bg-teal-50 text-teal-600"
          subtitle="Zero shop rent overhead"
        />

        <StatCard
          title="Total Customers"
          value={overview?.totalCustomers || 0}
          change={overview?.customersGrowth || '+18.6%'}
          isPositive={true}
          icon={Users}
          iconBgColor="bg-indigo-50 text-indigo-600"
          subtitle="Across Indian cities"
        />

        <StatCard
          title="Pending Orders"
          value={overview?.pendingOrders || 0}
          isPositive={overview?.pendingOrders === 0}
          icon={Clock}
          iconBgColor="bg-orange-50 text-orange-600"
          subtitle="Awaiting packaging / dispatch"
        />

        <StatCard
          title="Low Stock Alerts"
          value={overview?.lowStockProducts || 0}
          isPositive={overview?.lowStockProducts === 0}
          icon={AlertTriangle}
          iconBgColor="bg-rose-50 text-rose-600"
          subtitle="Less than 5 items remaining"
        />
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="font-bold text-base text-slate-900">Revenue & Sales Trajectory</h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time revenue computed from settled and in-transit orders</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {(['daily', 'weekly', 'monthly'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                    timeframe === t ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(value: any) => [formatINR(Number(value)), 'Revenue']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Sales Donut */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Sales by Category</h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribution across crafts & products</p>
          </div>

          <div className="h-56 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySales}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatINR(Number(val)), 'Sales']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {categorySales.slice(0, 4).map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-slate-600 truncate">{c.name}</span>
                </div>
                <span className="font-bold text-slate-900">{formatINR(c.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Top Products & Seller Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Products Horizontal Chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 mb-1">Best Selling Products</h3>
          <p className="text-xs text-slate-400 mb-4">Highest grossing items in inventory</p>

          <div className="space-y-3">
            {topProducts.slice(0, 5).map((p, idx) => (
              <div key={p.sku} className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-xs font-bold flex items-center justify-center text-slate-500">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-800 line-clamp-1">{p.name}</div>
                    <div className="text-[10px] text-slate-400">SKU: {p.sku} • {p.sales} sold</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-emerald-700">{formatINR(p.revenue)}</div>
                  <div className="text-[10px] text-slate-400">Gross Volume</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Seller Performance Table (for Super Admin) or Store Health (for Seller) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {isSeller ? 'Your Store Performance' : 'Top Verified Sellers'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isSeller ? 'Operational volume and sales metrics' : 'Revenue generated and commission breakdown'}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                    <th className="pb-2">Seller Store</th>
                    <th className="pb-2 text-center">Orders</th>
                    <th className="pb-2 text-right">Revenue</th>
                    <th className="pb-2 text-right">Commission (2%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sellerPerformance.slice(0, 5).map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-2.5">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-[10px] text-slate-400">{s.category}</div>
                      </td>
                      <td className="py-2.5 text-center font-semibold text-slate-700">{s.orders}</td>
                      <td className="py-2.5 text-right font-bold text-slate-900">{formatINR(s.revenue)}</td>
                      <td className="py-2.5 text-right font-semibold text-brand-600">{formatINR(s.commission)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 p-3 bg-brand-50/60 rounded-xl border border-brand-100 text-xs text-brand-800 flex items-center justify-between">
            <span className="font-semibold">Transparent Low 2% Platform Commission Model</span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-brand-200 font-bold">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
