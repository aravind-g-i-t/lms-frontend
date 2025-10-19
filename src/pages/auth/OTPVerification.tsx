import React, { useEffect, useState } from "react";
import type { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resendOTP, verifyOTP } from "../../redux/services/userAuthServices";
import { clearSignup } from "../../redux/slices/signupSlice";
import LearnerNav from "../../components/learner/LearnerNav";
import { toast } from "react-toastify";

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
  const [resendLoading,setResendLoading]=useState(false);

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
    }finally{
        setResendLoading(false)
    }
  };

  return (
    <>
      <LearnerNav />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full grid md:grid-cols-2">
          {/* Left Side */}
          <div className="relative min-h-[600px]">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              style={{
                backgroundImage: "url('/images/auth.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="relative z-10 p-12 h-full text-white flex flex-col justify-center">
              <h1 className="text-4xl font-bold mb-6">Verify Your Email</h1>
              <p className="text-lg text-gray-200">
                Enter the 6-digit OTP sent to your email.
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="p-12 flex flex-col justify-center bg-white">
            <div className="w-full max-w-sm mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                OTP Verification
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Box */}
                {OTPError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-red-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium">{OTPError}</span>
                    </div>
                  </div>
                )}

                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      OTPError
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-green-500"
                    } ${loading ? "bg-gray-50" : "bg-white"}`}
                    placeholder="Enter 6-digit OTP"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex justify-center"
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
                <div className="text-center">
                  {resendDisabled ? (
                    <p className="text-sm text-gray-500">
                    {resendLoading?"New OTP is being sent to you email":`Resend available in ${formatTime(timer)}`
                    }
                      
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-green-600 hover:text-green-700 font-medium text-sm underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
