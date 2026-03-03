import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreditCard, Wallet, Tag, CheckCircle, XCircle, ChevronRight, ShieldCheck, Sparkles, Lock } from "lucide-react";
import LearnerNav from "../../components/learner/LearnerNav";
import { createPaymentSession, getCourseDetailsForCheckout } from "../../services/learnerServices";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { getStripe } from "../../config/stripe";
import { useFeedback } from "../../hooks/useFeedback";

interface Course {
  id: string;
  title: string;
  price: number;
  instructor: { id: string; name: string; profilePic: string };
  thumbnail: string;
  description: string;
}

type DiscountType = "amount" | "percentage";

interface ApplicableCoupon {
  id: string;
  description: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount: number | null;
  minCost: number;
  expiresAt: Date;
  isActive: boolean;
  usageLimit: number;
  usageCount: number;
  createdAt: Date;
}

interface NotApplicableCoupon {
  couponId: string;
  code: string;
  reason: string;
}

export default function Checkout() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const feedback = useFeedback();
  const [course, setCourse] = useState<Course | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "wallet">("stripe");
  const [applicableCoupons, setApplicableCoupons] = useState<ApplicableCoupon[]>();
  const [notApplicableCoupons, setNotApplicableCoupons] = useState<NotApplicableCoupon[]>();
  const [selectedCoupon, setSelectedCoupon] = useState<ApplicableCoupon | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isPaying, setIsPaying] = useState(false);
  const [couponsOpen, setCouponsOpen] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        if (!courseId) return;
        const response = await dispatch(getCourseDetailsForCheckout({ courseId })).unwrap();
        setCourse(response.data.course);
        setApplicableCoupons(response.data.coupons.applicable);
        setNotApplicableCoupons(response.data.coupons.notApplicable);
        setWalletBalance(response.data.walletBalance);
      } catch (err) {
        feedback.error("Error", err as string);
      }
    };
    fetchCourseDetails();
  }, [dispatch, courseId, feedback]);

  async function handlePay() {
    if (!course) return;
    try {
      setIsPaying(true);
      const result = await dispatch(
        createPaymentSession({
          courseId: course.id,
          method: paymentMethod,
          couponId: selectedCoupon?.id || null,
        })
      ).unwrap();

      if (paymentMethod === "wallet") {
        feedback.success("Enrollment Successful", "You have been enrolled in the course.");
        navigate(`/learner/payment/status`);
        return;
      }

      const stripe = await getStripe();
      if (!stripe) throw new Error("Stripe not loaded");
      await stripe.redirectToCheckout({ sessionId: result.data.sessionId });
    } catch (error) {
      feedback.error("Error", error as string);
    } finally {
      setIsPaying(false);
    }
  }

  const finalPrice = useMemo(() => {
    if (!selectedCoupon || !course) return course?.price ?? 0;
    const price = course.price;
    if (selectedCoupon.discountType === "percentage") {
      const raw = (price * selectedCoupon.discountValue) / 100;
      const capped = selectedCoupon.maxDiscount ? Math.min(raw, selectedCoupon.maxDiscount) : raw;
      return Math.max(price - capped, 0);
    }
    if (selectedCoupon.discountType === "amount") {
      return Math.max(price - selectedCoupon.discountValue, 0);
    }
    return price;
  }, [selectedCoupon, course]);

  const canUseWallet = walletBalance >= finalPrice;
  const savings = course ? course.price - finalPrice : 0;

  if (!course) {
    return (
      <>
        <LearnerNav />
        <div className="checkout-loading">
          <div className="loading-spinner" />
          <p>Preparing your checkout…</p>
        </div>
        <style>{styles}</style>
      </>
    );
  }

  return (
    <>
      <LearnerNav />
      <div className="checkout-root">
        {/* Background decoration */}
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />

        <div className="checkout-container">
          {/* Header */}
          <div className="checkout-header">
            <Lock size={16} className="lock-icon" />
            <span>Secure Checkout</span>
          </div>

          <div className="checkout-grid">
            {/* ── LEFT COLUMN ── */}
            <div className="left-col">

              {/* Course Card */}
              <div className="card course-card">
                <img src={course.thumbnail} alt={course.title} className="course-thumb" />
                <div className="course-info">
                  <p className="course-label">You're enrolling in</p>
                  <h2 className="course-title">{course.title}</h2>
                  <div className="instructor-row">
                    <img src={course.instructor.profilePic} alt={course.instructor.name} className="instructor-pic" />
                    <span className="instructor-name">{course.instructor.name}</span>
                  </div>
                  <p className="course-desc">{course.description}</p>
                </div>
              </div>

              {/* Coupons */}
              <div className="card coupons-card">
                <button className="coupons-toggle" onClick={() => setCouponsOpen(!couponsOpen)}>
                  <span className="section-title"><Tag size={15} /> Coupons & Offers</span>
                  <ChevronRight size={16} className={`chevron ${couponsOpen ? "open" : ""}`} />
                </button>

                {couponsOpen && (
                  <div className="coupons-body">
                    {applicableCoupons && applicableCoupons.length > 0 ? (
                      <div className="coupon-list">
                        {applicableCoupons.map((c) => {
                          const isSelected = selectedCoupon?.id === c.id;
                          return (
                            <div
                              key={c.id}
                              className={`coupon-item ${isSelected ? "selected" : ""}`}
                              onClick={() => setSelectedCoupon(isSelected ? null : c)}
                            >
                              <div className="coupon-left">
                                <div className="coupon-code">{c.code}</div>
                                <div className="coupon-desc">{c.description}</div>
                              </div>
                              <div className="coupon-right">
                                <div className="coupon-badge">
                                  {c.discountType === "percentage"
                                    ? `${c.discountValue}% OFF`
                                    : `₹${c.discountValue} OFF`}
                                </div>
                                {isSelected && (
                                  <div className="coupon-applied">
                                    <CheckCircle size={14} /> Applied
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="no-coupons">No applicable coupons for this course.</p>
                    )}

                    {notApplicableCoupons && notApplicableCoupons.length > 0 && (
                      <>
                        <p className="na-label">Not applicable</p>
                        <div className="coupon-list na-list">
                          {notApplicableCoupons.map((c) => (
                            <div key={c.couponId} className="coupon-item na-item">
                              <div className="coupon-left">
                                <div className="coupon-code na-code">{c.code}</div>
                                <div className="coupon-reason">
                                  <XCircle size={12} /> {c.reason}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="right-col">

              {/* Order Summary */}
              <div className="card summary-card">
                <h3 className="section-title"><Sparkles size={15} /> Order Summary</h3>

                <div className="summary-row">
                  <span>Course Price</span>
                  <span className="original-price">₹{course.price.toLocaleString()}</span>
                </div>

                {selectedCoupon && (
                  <div className="summary-row discount-row">
                    <span>
                      Coupon <span className="coupon-pill">{selectedCoupon.code}</span>
                    </span>
                    <span className="discount-amount">− ₹{savings.toLocaleString()}</span>
                  </div>
                )}

                <div className="summary-divider" />

                <div className="summary-row total-row">
                  <span>Total</span>
                  <span className="total-amount">₹{finalPrice.toLocaleString()}</span>
                </div>

                {savings > 0 && (
                  <div className="savings-badge">
                    🎉 You save ₹{savings.toLocaleString()}!
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="card payment-card">
                <h3 className="section-title"><CreditCard size={15} /> Payment Method</h3>

                <div className="payment-options">
                  {/* Stripe */}
                  <label className={`payment-option ${paymentMethod === "stripe" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "stripe"}
                      onChange={() => setPaymentMethod("stripe")}
                      className="hidden"
                    />
                    <div className="payment-radio" />
                    <div className="payment-icon stripe-icon">
                      <CreditCard size={18} />
                    </div>
                    <div className="payment-details">
                      <span className="payment-name">Credit / Debit Card</span>
                      <span className="payment-sub">Powered by Stripe — secure & fast</span>
                    </div>
                    <div className="card-logos">
                      <span className="card-logo">VISA</span>
                      <span className="card-logo">MC</span>
                    </div>
                  </label>

                  {/* Wallet */}
                  <label className={`payment-option ${paymentMethod === "wallet" ? "active" : ""} ${!canUseWallet ? "disabled" : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "wallet"}
                      onChange={() => canUseWallet && setPaymentMethod("wallet")}
                      disabled={!canUseWallet}
                      className="hidden"
                    />
                    <div className="payment-radio" />
                    <div className={`payment-icon wallet-icon ${!canUseWallet ? "muted" : ""}`}>
                      <Wallet size={18} />
                    </div>
                    <div className="payment-details">
                      <span className="payment-name">
                        Wallet
                        {!canUseWallet && <span className="insufficient-tag">Insufficient</span>}
                      </span>
                      <span className="payment-sub">
                        Balance:{" "}
                        <span className={`wallet-balance ${canUseWallet ? "enough" : "not-enough"}`}>
                          ₹{walletBalance.toLocaleString()}
                        </span>
                        {!canUseWallet && (
                          <span className="wallet-needed">
                            {" "}(Need ₹{(finalPrice - walletBalance).toLocaleString()} more)
                          </span>
                        )}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePay}
                disabled={isPaying}
                className={`pay-btn ${isPaying ? "paying" : ""}`}
              >
                {isPaying ? (
                  <>
                    <span className="btn-spinner" />
                    Processing…
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Pay ₹{finalPrice.toLocaleString()} & Enroll
                  </>
                )}
              </button>

              <p className="secure-note">
                <Lock size={12} /> 256-bit SSL encrypted. Your payment is safe.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{styles}</style>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

  .checkout-root {
    min-height: 100vh;
    background: #f5f3ef;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
    padding: 40px 20px 80px;
  }

  .bg-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.35;
    pointer-events: none;
    z-index: 0;
  }
  .bg-blob-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, #c7e8f3, #e8d5f5);
    top: -100px; right: -100px;
  }
  .bg-blob-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, #fde8d0, #faf0c8);
    bottom: -80px; left: -80px;
  }

  .checkout-container {
    max-width: 1060px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .checkout-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 28px;
  }
  .lock-icon { color: #9ca3af; }

  .checkout-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 24px;
    align-items: start;
  }

  @media (max-width: 768px) {
    .checkout-grid { grid-template-columns: 1fr; }
  }

  /* ── CARD BASE ── */
  .card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid rgba(0,0,0,0.07);
    box-shadow: 0 2px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04);
    overflow: hidden;
    margin-bottom: 16px;
  }

  /* ── COURSE CARD ── */
  .course-card {
    display: flex;
    gap: 0;
    flex-direction: column;
  }
  .course-thumb {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }
  .course-info {
    padding: 22px 24px 24px;
  }
  .course-label {
    font-size: 11px;
    font-weight: 600;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 0 6px;
  }
  .course-title {
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    color: #111827;
    margin: 0 0 12px;
    line-height: 1.3;
  }
  .instructor-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }
  .instructor-pic {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e5e7eb;
  }
  .instructor-name {
    font-size: 13px;
    font-weight: 500;
    color: #374151;
  }
  .course-desc {
    font-size: 13.5px;
    color: #6b7280;
    line-height: 1.6;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* ── SECTION TITLE ── */
  .section-title {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13.5px;
    font-weight: 600;
    color: #111827;
    letter-spacing: 0.01em;
  }

  /* ── COUPONS CARD ── */
  .coupons-card { padding: 0; }
  .coupons-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px;
    background: none;
    border: none;
    cursor: pointer;
    transition: background 0.15s;
  }
  .coupons-toggle:hover { background: #fafafa; }
  .chevron {
    transition: transform 0.25s;
    color: #9ca3af;
  }
  .chevron.open { transform: rotate(90deg); }

  .coupons-body {
    padding: 0 22px 20px;
    border-top: 1px solid #f3f4f6;
  }

  .coupon-list { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; }

  .coupon-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-radius: 10px;
    border: 1.5px dashed #d1d5db;
    cursor: pointer;
    transition: all 0.2s;
    background: #fafafa;
  }
  .coupon-item:hover { border-color: #6366f1; background: #f5f3ff; }
  .coupon-item.selected {
    border-color: #6366f1;
    background: linear-gradient(135deg, #eef2ff, #f5f3ff);
    border-style: solid;
  }

  .coupon-left { display: flex; flex-direction: column; gap: 3px; }
  .coupon-code {
    font-size: 13px;
    font-weight: 700;
    color: #1f2937;
    letter-spacing: 0.05em;
    font-family: 'Courier New', monospace;
  }
  .coupon-desc { font-size: 12px; color: #6b7280; }

  .coupon-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
  .coupon-badge {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    font-size: 11.5px;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 20px;
    white-space: nowrap;
  }
  .coupon-applied {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #6366f1;
    font-weight: 600;
  }

  .no-coupons { font-size: 13px; color: #9ca3af; margin: 16px 0 4px; }

  .na-label {
    font-size: 11px;
    font-weight: 600;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 18px 0 8px;
  }
  .na-list { opacity: 0.6; }
  .na-item { cursor: default; }
  .na-item:hover { border-color: #d1d5db; background: #fafafa; }
  .na-code { color: #9ca3af; }
  .coupon-reason {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11.5px;
    color: #ef4444;
  }

  /* ── ORDER SUMMARY ── */
  .summary-card { padding: 22px 24px; }
  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    font-size: 14px;
    color: #374151;
  }
  .original-price { font-weight: 500; }
  .discount-row { color: #059669; }
  .coupon-pill {
    background: #d1fae5;
    color: #065f46;
    font-size: 10.5px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 12px;
    letter-spacing: 0.05em;
    font-family: monospace;
  }
  .discount-amount { font-weight: 600; }

  .summary-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
    margin: 6px 0;
  }

  .total-row {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    padding: 12px 0 4px;
  }
  .total-amount {
    font-family: 'DM Serif Display', serif;
    font-size: 24px;
    color: #111827;
  }

  .savings-badge {
    margin-top: 12px;
    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
    border: 1px solid #6ee7b7;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 600;
    color: #065f46;
    text-align: center;
  }

  /* ── PAYMENT CARD ── */
  .payment-card { padding: 22px 24px; }
  .payment-options { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }

  .payment-option {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border-radius: 12px;
    border: 1.5px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.2s;
    background: #fafafa;
  }
  .payment-option:hover:not(.disabled) { border-color: #6366f1; background: #f5f3ff; }
  .payment-option.active {
    border-color: #6366f1;
    background: linear-gradient(135deg, #eef2ff, #f5f3ff);
  }
  .payment-option.disabled {
    opacity: 0.55;
    cursor: not-allowed;
    filter: grayscale(0.3);
  }
  .hidden { display: none; }

  .payment-radio {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    border: 2px solid #d1d5db;
    flex-shrink: 0;
    transition: all 0.2s;
    position: relative;
  }
  .payment-option.active .payment-radio {
    border-color: #6366f1;
    background: #6366f1;
    box-shadow: inset 0 0 0 3px white;
  }

  .payment-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .stripe-icon { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; }
  .wallet-icon { background: linear-gradient(135deg, #f59e0b, #f97316); color: white; }
  .wallet-icon.muted { background: #e5e7eb; color: #9ca3af; }

  .payment-details {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
  }
  .payment-name {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .payment-sub { font-size: 12px; color: #6b7280; }

  .insufficient-tag {
    background: #fee2e2;
    color: #dc2626;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 10px;
    letter-spacing: 0.04em;
  }

  .wallet-balance { font-weight: 700; }
  .wallet-balance.enough { color: #059669; }
  .wallet-balance.not-enough { color: #dc2626; }
  .wallet-needed { color: #dc2626; font-size: 11.5px; }

  .card-logos {
    display: flex;
    gap: 5px;
  }
  .card-logo {
    font-size: 9px;
    font-weight: 800;
    color: #6b7280;
    border: 1.5px solid #d1d5db;
    border-radius: 4px;
    padding: 2px 5px;
    letter-spacing: 0.05em;
  }

  /* ── PAY BUTTON ── */
  .pay-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 17px 24px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #a78bfa 100%);
    color: white;
    font-family: 'DM Sans', sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.25s;
    box-shadow: 0 4px 20px rgba(99,102,241,0.4), 0 2px 8px rgba(99,102,241,0.25);
    letter-spacing: 0.01em;
    margin-bottom: 12px;
  }
  .pay-btn:hover:not(.paying) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(99,102,241,0.5), 0 4px 12px rgba(99,102,241,0.3);
  }
  .pay-btn:active { transform: translateY(0); }
  .pay-btn.paying {
    background: linear-gradient(135deg, #9ca3af, #6b7280);
    box-shadow: none;
    cursor: not-allowed;
  }

  .btn-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .secure-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-size: 11.5px;
    color: #9ca3af;
    margin: 0;
  }

  /* ── LOADING ── */
  .checkout-loading {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    color: #6b7280;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
  }
  .loading-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #e5e7eb;
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
`;