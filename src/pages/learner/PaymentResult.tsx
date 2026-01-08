import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, ArrowRight, RefreshCw } from "lucide-react";
import LearnerNav from "../../components/learner/LearnerNav";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { verifyPayment } from "../../services/learnerServices";
import { toast } from "react-toastify";

type PaymentStatus = "success" | "failed" | "loading";



export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [status, setStatus] = useState<PaymentStatus>("loading");

  useEffect(() => {
    const handleVerifyPayment = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setStatus("failed");
        return;
      }

      try {
        const response = await dispatch(verifyPayment(sessionId)).unwrap();
        
        setStatus(response.status)
      } catch (err) {
        toast.error(err as string)
      }
    };

    handleVerifyPayment();
  }, [searchParams, dispatch]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100">
        <LearnerNav />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <LearnerNav />

      <div className="max-w-lg mx-auto py-16 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {status === "success" ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h1>

              <p className="text-gray-600 mb-2">
                Thank you for your purchase. You're now enrolled in:
              </p>

              {/* {courseTitle && (
                <p className="text-lg font-semibold text-teal-700 mb-6">
                  {courseTitle}
                </p>
              )} */}

              <p className="text-sm text-gray-500 mb-8">
                A confirmation email has been sent to your registered email address.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate("/learner/dashboard")}
                  className="flex items-center justify-center gap-2 bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-teal-700 transition"
                >
                  Go to My Courses <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate("/explore")}
                  className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition"
                >
                 Continue Browsing
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Failed
              </h1>

              <p className="text-gray-600 mb-6">
                We couldn't process your payment. This could be due to
                insufficient funds, an expired card, or a temporary issue with
                the payment provider.
              </p>

              {/* {courseTitle && (
                <p className="text-sm text-gray-500 mb-6">
                  Course: <span className="font-medium">{courseTitle}</span>
                </p>
              )} */}

              <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  What you can do:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Check your card details and try again</li>
                  <li>• Use a different payment method</li>
                  <li>• Contact your bank if the issue persists</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center gap-2 bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-teal-700 transition"
                >
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>

                <button
                  onClick={() => navigate("/learner/courses")}
                  className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition"
                >
                  Browse Courses
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Need help?{" "}
          <a href="/support" className="text-teal-600 hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}