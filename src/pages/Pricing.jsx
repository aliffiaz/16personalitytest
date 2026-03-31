import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  AlertCircle
} from 'lucide-react';
import { API_BASE_URL } from '../config';

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
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [myQuota, setMyQuota] = useState(null);

  useEffect(() => {
    fetchPlans();
    fetchMyQuota();
  }, [user]);

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

  const handlePurchase = async (plan) => {
    if (!user) {
      navigate('/login');
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
        body: JSON.stringify({ planId: plan._id })
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.success) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      // 2. Open Razorpay Checkout
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
              navigate('/test-intro', { state: { paymentSuccess: true } });
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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <Brain className="absolute inset-0 m-auto text-indigo-600 animate-pulse" size={24} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20"
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
            className={`glass-card relative overflow-hidden flex flex-col p-8 sm:p-10 border-indigo-100/50 hover:border-indigo-500/50 transition-all duration-500 group ${idx === 1 ? 'ring-2 ring-indigo-600 ring-offset-4 ring-offset-slate-50' : ''}`}
          >
            {idx === 1 && (
              <div className="absolute top-0 right-0">
                <div className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rotate-45 translate-x-[25px] translate-y-[10px] shadow-lg">
                  Best Value
                </div>
              </div>
            )}

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

            <button
              onClick={() => handlePurchase(plan)}
              disabled={processingPayment}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all ${idx === 1
                  ? 'btn-primary shadow-xl shadow-indigo-600/20'
                  : 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {processingPayment ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  <span>Get Started Now</span>
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
  );
}
