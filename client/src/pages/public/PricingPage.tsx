import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, CheckCircle2, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatINR, formatINRWithDecimals } from '../../utils/formatters';

export const PricingPage: React.FC = () => {
  const [productPrice, setProductPrice] = useState<number>(1000);
  const [taxRate, setTaxRate] = useState<number>(5.0); // 5% GST
  const commissionRate = 2.0; // 2% platform fee

  // Calculations
  const grossSale = Number(productPrice) || 0;
  const applicableTax = Math.round((grossSale * (taxRate / 100)) * 100) / 100;
  const platformFee = Math.round((grossSale * (commissionRate / 100)) * 100) / 100;
  const taxOnCommission = Math.round((platformFee * 0.18) * 100) / 100; // 18% GST on platform service fee
  const shippingFee = grossSale > 999 ? 0 : 50;
  const sellerNetAmount = Math.round((grossSale + applicableTax - platformFee - taxOnCommission) * 100) / 100;
  const customerPaid = Math.round((grossSale + applicableTax + shippingFee) * 100) / 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-4">
          <Calculator className="w-3.5 h-3.5" />
          No Hidden Charges • 100% Transparent Billing
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Transparent Pricing & Low 2% Commission
        </h1>
        <p className="mt-4 text-base text-slate-600 leading-relaxed">
          HerCart eliminates expensive physical retail rent, storefront maintenance, and arbitrary seller penalties.
          You only pay a simple, low 2% platform fee when you successfully make a sale.
        </p>
      </div>

      {/* Interactive Calculator */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Interactive Seller Earnings Calculator</h2>
            <p className="text-xs text-slate-500 mt-1">
              Adjust your product selling price to see exactly how commission, statutory GST, and net payouts are computed.
            </p>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold border border-brand-200">
            Standard Tier: 2.0% Fee
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Product Selling Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="50"
                  max="50000"
                  step="50"
                  value={productPrice}
                  onChange={(e) => setProductPrice(Number(e.target.value))}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-slate-900 text-lg"
                />
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={productPrice}
                onChange={(e) => setProductPrice(Number(e.target.value))}
                className="w-full mt-3 accent-brand-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>₹100</span>
                <span>₹5,000</span>
                <span>₹10,000</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Applicable Statutory GST Rate
              </label>
              <select
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold text-slate-800 text-sm bg-white"
              >
                <option value="0">0% (Exempt Handloom Crafts / Raw Spices)</option>
                <option value="3">3% (Handmade Jewelry / Precious Metals)</option>
                <option value="5">5% (Handloom Clothing / Organic Foods)</option>
                <option value="12">12% (Terracotta Decor / Processed Goods)</option>
                <option value="18">18% (Personal Care / Herbal Cosmetics)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Note: Tax rates are government statutory requirements and are strictly separated from HerCart platform fees.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Transparent Fee Guarantee
              </div>
              <p>
                No listing charges. No mandatory ad spend. No monthly recurring software subscriptions. You only pay 2% when a customer purchases.
              </p>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Financial Breakdown
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between items-center py-1">
                <span>Product Base Price:</span>
                <span className="font-bold text-slate-900 text-sm">{formatINRWithDecimals(grossSale)}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span>Applicable GST ({taxRate}%):</span>
                <span className="font-semibold text-slate-700">+{formatINRWithDecimals(applicableTax)}</span>
              </div>

              <div className="flex justify-between items-center py-1 text-brand-700 font-semibold">
                <span>HerCart Platform Commission (2%):</span>
                <span>-{formatINRWithDecimals(platformFee)}</span>
              </div>

              <div className="flex justify-between items-center py-1 text-slate-500">
                <span>GST on Service Fee (18% of ₹{platformFee}):</span>
                <span>-{formatINRWithDecimals(taxOnCommission)}</span>
              </div>

              <div className="flex justify-between items-center py-1 text-slate-500">
                <span>Delivery / Shipping Fee:</span>
                <span>{shippingFee === 0 ? 'FREE (Orders > ₹999)' : `₹${shippingFee} (Customer pays)`}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 text-sm">Customer Pays Total:</span>
                  <span className="font-black text-slate-900 text-base">{formatINRWithDecimals(customerPaid)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-brand-600 text-white rounded-xl shadow-md">
                  <div>
                    <span className="font-bold text-sm block">Seller Net Payout:</span>
                    <span className="text-[10px] text-emerald-100">Transferred to your bank</span>
                  </div>
                  <span className="font-black text-xl text-white">{formatINRWithDecimals(sellerNetAmount)}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link
                to="/onboard"
                className="inline-flex items-center justify-center gap-1.5 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Join As a Seller <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
