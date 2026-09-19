import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Store, User, CreditCard, PackageCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const OnboardWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { registerUser } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: '',
    businessCategory: "Women's Clothing",
    description: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    state: '',
    pincode: '',
    bankName: '',
    bankAccountNo: '',
    ifscCode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser({
        name: formData.name || 'New Artisan Seller',
        email: formData.email.toLowerCase().trim(),
        password: formData.password || 'Seller@123',
        role: 'SELLER',
        phone: formData.phone || '+91 98000 12345',
        businessName: formData.businessName || 'Artisan Workshop',
        businessCategory: formData.businessCategory,
        description: formData.description,
        city: formData.city || 'Hyderabad',
        state: formData.state || 'Telangana',
        pincode: formData.pincode || '500001',
      });

      addToast('success', 'Onboarding submitted! Your store is created.');
      navigate('/dashboard');
    } catch (err: any) {
      addToast('error', err.response?.data?.message || 'Registration failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Wizard Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Fast 3-Step Seller Setup
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Join HerCart as a Seller</h1>
        <p className="text-slate-500 text-sm mt-1">
          Reach buyers across the country from your home or local workshop. Zero store rent.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-2">
          <span className={step >= 1 ? 'text-brand-600' : ''}>1. Business</span>
          <span className={step >= 2 ? 'text-brand-600' : ''}>2. Seller Details</span>
          <span className={step >= 3 ? 'text-brand-600' : ''}>3. Bank / Payout</span>
          <span className={step >= 4 ? 'text-brand-600' : ''}>4. Start Selling</span>
        </div>
        <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-600 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Business Information */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-bold">
                <Store className="w-5 h-5 text-brand-600" />
                <span>Step 1: Your Business & Craft</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Business / Brand Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  required
                  placeholder="e.g. Anu Handlooms, Maya Terracotta, Radha Spices"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Category *
                </label>
                <select
                  name="businessCategory"
                  value={formData.businessCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium bg-white"
                >
                  <option value="Women's Clothing">Women's Clothing (Kurtis, Sarees, Dupattas)</option>
                  <option value="Men's Clothing">Men's Clothing (Khadi Shirts, Kurtas)</option>
                  <option value="Handmade Products">Handmade Products & Crafts</option>
                  <option value="Jewelry">Handmade Jewelry & Bangles</option>
                  <option value="Home Decor">Home Decor & Earthen Pottery</option>
                  <option value="Beauty & Personal Care">Beauty & Herbal Wellness</option>
                  <option value="Food & Local Products">Food, Pickles & Regional Spices</option>
                  <option value="Accessories">Accessories & Jute Bags</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Short Description of What You Sell
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Tell buyers about your craft, materials used, and where you handcraft your items..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.businessName) {
                      addToast('error', 'Please enter your business name.');
                      return;
                    }
                    setStep(2);
                  }}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Personal & Contact Details */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-bold">
                <User className="w-5 h-5 text-brand-600" />
                <span>Step 2: Seller Contact & Location</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Anasuya Rao"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Login Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Create Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g. Hyderabad"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="e.g. Telangana"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="500001"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.name || !formData.email || !formData.password) {
                      addToast('error', 'Please fill name, email, and password.');
                      return;
                    }
                    setStep(3);
                  }}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Bank / Payout Information */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-bold">
                <CreditCard className="w-5 h-5 text-brand-600" />
                <span>Step 3: Payout Bank Account</span>
              </div>

              <p className="text-xs text-slate-500">
                Your net sales earnings (Gross sales minus 2% platform commission) will be transferred directly to this account.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  placeholder="e.g. State Bank of India, HDFC, Canara Bank"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="bankAccountNo"
                    placeholder="987654321012"
                    value={formData.bankAccountNo}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    placeholder="SBIN0004567"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium uppercase"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Review & Confirm <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Start Selling */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-bold">
                <PackageCheck className="w-5 h-5 text-brand-600" />
                <span>Step 4: Confirm & Launch Store</span>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Store Name:</span>
                  <span className="font-bold text-slate-900">{formData.businessName || 'Artisan Store'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-800">{formData.businessCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Seller:</span>
                  <span className="font-semibold text-slate-800">{formData.name} ({formData.email})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-slate-800">{formData.city || 'Hyderabad'}, {formData.state || 'Telangana'}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-brand-700 font-bold">
                  <span>Platform Commission Rate:</span>
                  <span>2.0% (Transparent Low Fee)</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  By completing setup, your store will be created instantly and you can immediately add products, manage inventory, and process orders!
                </span>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl shadow-md transition-all hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Setting Up...' : 'Start Selling Now'} <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
