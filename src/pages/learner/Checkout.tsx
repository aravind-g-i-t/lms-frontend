import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CreditCard, Wallet } from "lucide-react";
import LearnerNav from "../../components/learner/LearnerNav";
import { toast } from "react-toastify";
import { createPaymentSession, getCourseDetailsForCheckout } from "../../redux/services/learnerServices";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { getStripe } from "../../config/stripe";


interface Course {
  id: string;
  title: string;
  price: number;
  instructor: { id: string; name: string; profilePic: string };
  thumbnail: string;
  description: string;
}

type DiscountType = "amount" | "percentage"

interface ApplicableCoupon {
  id: string;
  description: string;
  code: string;
  discountType: DiscountType
  discountValue: number;
  maxDiscount: number | null;
  minCost: number;
  expiresAt: Date;
  isActive: boolean
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
  // const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()

  const [course, setCourse] = useState<Course | null>(null);
  // const [coupon, setCoupon] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "wallet">("stripe");
  const [applicableCoupons, setApplicableCoupons] = useState<ApplicableCoupon[]>();
  const [notApplicableCoupons, setNotApplicableCoupons] = useState<NotApplicableCoupon[]>();
  const [selectedCoupon, setSelectedCoupon] = useState<ApplicableCoupon | null>(null)

  const [isPaying, setIsPaying] = useState(false);



  useEffect(() => {

    const fetchCourseDetails = async () => {
      try {
        if (!courseId) {
          return
        }
        const response = await dispatch(getCourseDetailsForCheckout({ courseId })).unwrap();
        console.log(response.data);
        setCourse(response.data.course);
        setApplicableCoupons(response.data.coupons.applicable);
        setNotApplicableCoupons(response.data.coupons.notApplicable)

      } catch (err) {
        toast.error(err as string);
      }
    };

    fetchCourseDetails();
  }, [dispatch, courseId]);




  async function handlePay() {
    if (!course) return;
    try {
      setIsPaying(true);
      console.log(paymentMethod);


      const data = await dispatch(
        createPaymentSession({
          courseId: course.id,
          method: paymentMethod,
          coupon: selectedCoupon?.code || null,
        })
      ).unwrap();

      console.log(data);


      const stripe = await getStripe();

      if (!stripe) throw new Error("Stripe not loaded");

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsPaying(false);
    }
  }

  function calculateDiscountedPrice() {
    if (!selectedCoupon || !course) return course?.price ?? 0;

    const price = course.price;

    if (selectedCoupon.discountType === "percentage") {
      const raw = (price * selectedCoupon.discountValue) / 100;

      const capped = selectedCoupon.maxDiscount
        ? Math.min(raw, selectedCoupon.maxDiscount)
        : raw;

      return Math.max(price - capped, 0);
    }

    if (selectedCoupon.discountType === "amount") {
      return Math.max(price - selectedCoupon.discountValue, 0);
    }

    return price;
  }

  const finalPrice = calculateDiscountedPrice();




  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading course...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <LearnerNav />

      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Checkout</h1>

        <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row gap-8 p-8">
          {/* Left: Course Summary */}
          <div className="flex-1 min-w-[220px]">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-28 object-cover rounded-md mb-4"
            />
            <h2 className="font-semibold text-xl">{course.title}</h2>
            <div className="flex items-center mt-3 gap-3">
              <img
                src={course.instructor.profilePic}
                alt={course.instructor.name}
                className="w-8 h-8 rounded-full border border-teal-300 object-cover"
              />
              <span className="text-gray-700">{course.instructor.name}</span>
            </div>
            <p>{course.description}</p>
          </div>

          {/* Right: Details */}
          <div className="flex-1 space-y-7">
            {/* Learner Info */}


            {/* Coupon */}
            {/* <form className="flex gap-2" >
              <input
                type="text"
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
                placeholder="Coupon code"
                className="flex-1 px-3 py-2 border rounded-lg"
              // disabled={couponApplied}
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg font-semibold transition`}

              >
                Apply
              </button>
            </form> */}

            {/* Coupon List */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-800">Available Coupons</h3>

              {applicableCoupons && applicableCoupons.length > 0 ? (
                <div className="space-y-2">
                  {applicableCoupons.map((c) => (
                    <div
                      key={c.id}
                      className={`p-3 border rounded-lg transition ${selectedCoupon?.id === c.id
                          ? "border-teal-600 bg-teal-50"
                          : "border-gray-300 cursor-pointer"
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <div
                          onClick={() => setSelectedCoupon(c)}
                          className="flex flex-col cursor-pointer flex-1"
                        >
                          <span className="font-semibold">{c.code}</span>
                          <span className="text-teal-700">
                            {c.discountType === "percentage"
                              ? `${c.discountValue}% OFF`
                              : `₹${c.discountValue} OFF`}
                          </span>
                        </div>

                        {selectedCoupon?.id === c.id && (
                          <button
                            onClick={() => setSelectedCoupon(null)}
                            className="text-sm text-red-600 px-2 py-1 border border-red-400 rounded-md hover:bg-red-50"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mt-1">{c.description}</p>
                    </div>

                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No applicable coupons</p>
              )}

              {/* Not Applicable Coupons */}
              {notApplicableCoupons && notApplicableCoupons.length > 0 && (
                <>
                  <h3 className="text-lg font-bold mt-4 text-gray-800">Other Coupons</h3>
                  <div className="space-y-2">
                    {notApplicableCoupons.map((c) => (
                      <div
                        key={c.couponId}
                        className="p-3 border border-gray-300 rounded-lg opacity-60"
                      >
                        <div className="flex justify-between">
                          <span className="font-semibold">{c.code}</span>
                        </div>
                        <p className="text-sm text-red-500">{c.reason}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>


            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Order Summary</h3>

              <div className="flex justify-between py-1 text-gray-700">
                <span>Course Price</span>
                <span>₹{course.price.toLocaleString()}</span>
              </div>

              {selectedCoupon && (
                <div className="flex justify-between py-1 text-green-600">
                  <span>Coupon Applied ({selectedCoupon.code})</span>
                  <span>- ₹{(course.price - finalPrice).toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between font-bold py-1 text-gray-900 border-t mt-2">
                <span>Total</span>
                <span>₹{finalPrice.toLocaleString()}</span>
              </div>
            </div>


            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Payment Method</h3>
              <div className="flex gap-3 flex-wrap">
                <label
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${paymentMethod === "stripe"
                    ? "border-teal-600 bg-teal-50"
                    : "border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                    className="hidden"
                  />
                  <CreditCard className="w-5 h-5" /> Stripe
                </label>

                <label
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${paymentMethod === "wallet"
                    ? "border-teal-600 bg-teal-50"
                    : "border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === "wallet"}
                    onChange={() => setPaymentMethod("wallet")}
                    className="hidden"
                  />
                  <Wallet className="w-5 h-5" /> Wallet
                </label>
              </div>
            </div>

            {/* Pay Button */}
            <button
              className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 text-lg transition disabled:opacity-60"
              onClick={handlePay}
              disabled={isPaying}
            >
              {isPaying
                ? "Processing..."
                : `Pay ₹${course.price.toLocaleString()} & Enroll`}
            </button>
          </div>
        </div>
      </div>
      {/* {
        clientSecret && (
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )
      } */}
    </div>
  );
}
