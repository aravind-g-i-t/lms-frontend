import React, { useEffect, useState } from "react";
import type { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resendOTP, verifyOTP } from "../../redux/services/userAuthServices";
import { clearSignup } from "../../redux/slices/signupSlice";
import LearnerNav from "../../components/learner/LearnerNav";
import { toast } from "react-toastify";
import { AlertCircle } from "lucide-react";


export default function OtpVerification() {
  const { email, otpExpiresAt, role } = useSelector(
    (state: RootState) => state.signup
  );


  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();


  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [OTPError, setError] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);


  // Redirect if data missing (refresh case)
  useEffect(() => {
    if (!email || !otpExpiresAt || !role) {
      navigate("/signup");
    }
  }, [email, otpExpiresAt, role, navigate]);


  // Timer setup
  useEffect(() => {
    if (!otpExpiresAt) return;


    const remainingSeconds = Math.max(
      Math.floor((new Date(otpExpiresAt).getTime() - Date.now()) / 1000),
      0
    );
    setTimer(remainingSeconds);
    setResendDisabled(remainingSeconds > 0);
  }, [otpExpiresAt]);


  // Countdown
  useEffect(() => {
    if (!resendDisabled) return;


    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);


    return () => clearInterval(interval);
  }, [resendDisabled]);


  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");


    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be exactly 6 digits and numeric.");
      return;
    }


    if (!email || !role) {
      setError("Unexpected error. Please signup again.");
      return;
    }


    try {
      setLoading(true);
      const input = { role, email, otp };
      const response = await dispatch(verifyOTP(input)).unwrap();


      dispatch(clearSignup());
      toast.success(response.message);
      navigate("/signin");
    } catch (err) {
      console.error("OTP verification failed", err);
      toast.error(err as string);
      setError("Invalid OTP or expired. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleResend = async () => {
    try {
      setResendLoading(true)
      if (!email) return;


      setResendDisabled(true);
      setError("");


      await dispatch(resendOTP({ email })).unwrap();


      toast.success("A new OTP has been sent to your email.");
    } catch (err) {
      console.error(err);
      setError("Failed to resend OTP. Please try again.");
      setResendDisabled(false);
      toast.error(err as string);
    } finally {
      setResendLoading(false)
    }
  };


  return (
    <>
      <LearnerNav />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full grid md:grid-cols-2 overflow-hidden">
          {/* Left Side */}
          <div className="relative min-h-[600px] hidden md:block">
            <div
              className="absolute inset-0 bg-gradient-to-br from-teal-600/80 to-teal-800/80"
              style={{
                backgroundImage: "url('/images/auth.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="relative z-10 p-12 h-full text-white flex flex-col justify-center">
              <h1 className="text-4xl font-bold mb-6 leading-tight">Verify Your Email</h1>
              <p className="text-lg text-teal-100">
                Enter the 6-digit OTP sent to your email to complete your registration.
              </p>
            </div>
          </div>


          {/* Right Side */}
          <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
            <div className="w-full max-w-sm mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                OTP Verification
              </h2>


              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Box */}
                {OTPError && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{OTPError}</span>
                  </div>
                )}


                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    6-digit OTP
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, "");
                      setOtp(numericValue);
                      if (OTPError) setError("");
                    }}
                    maxLength={6}
                    required
                    disabled={loading}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-900 placeholder-gray-500 ${
                      OTPError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-teal-500 focus:border-transparent"
                    } ${loading ? "bg-gray-50 cursor-not-allowed" : "bg-white"}`}
                    placeholder="Enter 6-digit OTP"
                  />
                </div>


                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex justify-center items-center transition-all shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>


                {/* Resend */}
                <div className="text-center pt-2">
                  {resendDisabled ? (
                    <p className="text-sm text-gray-600">
                      {resendLoading 
                        ? "New OTP is being sent to your email..." 
                        : `Resend available in `
                      }
                      {!resendLoading && <span className="font-semibold text-teal-600">{formatTime(timer)}</span>}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendLoading}
                      className="text-teal-600 hover:text-teal-700 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resendLoading ? "Sending OTP..." : "Resend OTP"}
                    </button>
                  )}
                </div>
              </form>

              <p className="text-center text-xs text-gray-500 mt-8">
                Check your spam folder if you don't see the OTP in your inbox
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
