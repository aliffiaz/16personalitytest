"use client";

import { useRouter } from 'next/navigation';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  Clock,
  ArrowRight,
  Brain,
  CreditCard,
  AlertCircle,
  Ticket,
  Tag
} from 'lucide-react';
import { API_BASE_URL } from '@/config';
import PageLoader from '@/components/PageLoader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Pricing({ user }) {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [myQuota, setMyQuota] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupons, setAppliedCoupons] = useState({}); // { planId: couponData }
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState({}); // { planId: message }
  const [activeCouponInput, setActiveCouponInput] = useState(null); // planId that has input open
  const plansFetched = useRef(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setShowLoader(true), 200);
      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [loading]);

  useEffect(() => {
    if (!plansFetched.current) {
      fetchPlans();
      plansFetched.current = true;
    }
  }, []);

  useEffect(() => {
    fetchMyQuota();
  }, [user?._id]);

  const fetchPlans = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/personality-sub/plans`);
      const data = await res.json();
      if (res.ok && data.success) {
        setPlans(data.data || []);
      }
    } catch (err) {
      console.error("Fetch plans error:", err);
      setError('Failed to load subscription plans.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyQuota = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE_URL}/personality-sub/my-quota`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMyQuota(data.data);
      }
    } catch (err) {
      console.error("Fetch quota error:", err);
    }
  };

  const handleApplyCoupon = async (planId) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!couponCode.trim()) return;

    setIsValidatingCoupon(true);
    setCouponError(prev => ({ ...prev, [planId]: '' }));

    try {
      const res = await fetch(`${API_BASE_URL}/personality-sub/validate-coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ code: couponCode, planId })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAppliedCoupons(prev => ({ ...prev, [planId]: data.data }));
        setCouponCode('');
        setActiveCouponInput(null);
      } else {
        setCouponError(prev => ({ ...prev, [planId]: data.message || 'Invalid coupon code.' }));
      }
    } catch (err) {
      console.error("Coupon validation error:", err);
      setCouponError(prev => ({ ...prev, [planId]: 'Failed to validate coupon.' }));
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = (planId) => {
    setAppliedCoupons(prev => {
      const newCoupons = { ...prev };
      delete newCoupons[planId];
      return newCoupons;
    });
  };

  const handlePurchase = async (plan) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setProcessingPayment(true);
    setError('');

    try {
      // 1. Create Razorpay order on backend
      const res = await fetch(`${API_BASE_URL}/personality-sub/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          planId: plan._id,
          couponCode: appliedCoupons[plan._id]?.code || null 
        })
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.success) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      // 2. Handle Free Orders (100% Discount)
      if (orderData.isFree) {
        // Success notification or immediate refresh
        await fetchMyQuota();
        router.push('/test-intro?paymentSuccess=true');
        setProcessingPayment(false);
        return;
      }

      // 3. Open Razorpay Checkout (Paid Orders)
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Open16 Personality",
        description: `Purchase ${orderData.plan.name}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          // 3. Verify payment on backend
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/personality-sub/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                orderId: orderData.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                planId: plan._id
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              // Refresh quota and redirect
              await fetchMyQuota();
              router.push('/test-intro?paymentSuccess=true');
            } else {
              setError(verifyData.message || 'Payment verification failed');
            }
          } catch (err) {
            console.error("Verification error:", err);
            setError('System error during payment verification.');
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: orderData.prefill,
        theme: {
          color: "#4f46e5"
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Purchase error:", err);
      setError(err.message || 'Failed to initiate purchase.');
      setProcessingPayment(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showLoader && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/50 backdrop-blur-[2px]"
          >
            <PageLoader title="Accessing Premium Matrix" subtitle="Retrieving the latest subscription plans..." />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
      >
      <div className="text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-100 text-indigo-700 text-[10px] sm:text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-indigo-200 mb-6 inline-block"
        >
          Premium Access
        </motion.span>
        <h1 className="heading-hero">
          Invest in Your <span className="brand-gradient">Growth</span>
        </h1>
        <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          Unlock high-precision AI personality reports and career blueprints starting from just ₹{plans[0]?.amount || '499'}.
        </p>

        {myQuota && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 inline-flex items-center gap-3 bg-emerald-50 border border-emerald-100 px-6 py-3 rounded-2xl text-emerald-800 font-bold shadow-sm"
          >
            <Zap size={18} className="text-emerald-500" />
            <span>Currently Remaining: {myQuota.testsRemaining} Test Assessments</span>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-10 bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-700 font-bold max-w-2xl mx-auto"
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan._id}
            variants={cardVariants}
            className="glass-card relative overflow-hidden flex flex-col p-8 sm:p-10 border-indigo-100/50 hover:border-indigo-500/50 transition-all duration-500 group"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-display font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{plan.name}</h3>
              <p className="text-slate-500 text-sm font-medium mt-2">{plan.description}</p>
            </div>

            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-display font-black text-slate-900">₹{plan.amount}</span>
              <span className="text-slate-400 font-bold text-sm tracking-wide uppercase">/ {plan.testsAllowed} Tests</span>
            </div>

            <div className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                    <Check size={12} className="text-indigo-600 font-bold" />
                  </div>
                  <span className="text-slate-600 text-sm font-semibold">{feature}</span>
                </div>
              ))}
            </div>

            {/* Coupon Section */}
            <div className="mb-6">
              <AnimatePresence mode="wait">
                {appliedCoupons[plan._id] ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-indigo-600" />
                      <span className="text-sm font-bold text-indigo-700">
                        {appliedCoupons[plan._id].code} Applied (-₹{appliedCoupons[plan._id].discountAmount})
                      </span>
                    </div>
                    <button 
                      onClick={() => removeCoupon(plan._id)}
                      className="text-indigo-500 hover:text-indigo-700 text-sm font-bold underline"
                    >
                      Remove
                    </button>
                  </motion.div>
                ) : activeCouponInput === plan._id ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100"
                  >
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="ENTER COUPON CODE"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase tracking-wider"
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon(plan._id)}
                      />
                      <button
                        onClick={() => handleApplyCoupon(plan._id)}
                        disabled={isValidatingCoupon}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 shadow-md shadow-indigo-600/10 transition-all active:scale-[0.98]"
                      >
                        {isValidatingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError[plan._id] && (
                      <p className="text-xs text-rose-500 font-bold ml-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {couponError[plan._id]}
                      </p>
                    )}
                  </motion.div>
                ) : (
                  <button 
                    onClick={() => setActiveCouponInput(plan._id)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-50 border border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all py-3 px-4 rounded-xl group"
                  >
                    <Ticket size={18} className="group-hover:rotate-12 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-wide">Have a coupon? Apply it here</span>
                  </button>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => handlePurchase(plan)}
              disabled={processingPayment}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all btn-primary shadow-xl shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processingPayment ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  <span>
                    {appliedCoupons[plan._id] 
                      ? `Pay ₹${appliedCoupons[plan._id].finalAmount}`
                      : 'Get Started Now'
                    }
                  </span>
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 mb-4">Why upgrade to Premium?</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-indigo-600 to-amber-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "High Precision AI",
              desc: "Deep-dive analysis using advanced LLMs tailored to your age and region.",
              icon: <Brain className="text-indigo-600" size={24} />
            },
            {
              title: "Career Blueprint",
              desc: "10-page magazine style PDF with career paths and academic roadmaps.",
              icon: <Zap className="text-indigo-600" size={24} />
            },
            {
              title: "Expert Guidance",
              desc: "Actionable growth strategies and professional development tips.",
              icon: <ShieldCheck className="text-indigo-600" size={24} />
            }
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 border-white/60">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-indigo-50 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h4 className="text-slate-900 font-bold mb-2">{item.title}</h4>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
    </>
  );
}
