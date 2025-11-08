import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { setSignupCredentials } from "../../redux/slices/signupSlice";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../../redux/services/userAuthServices";
import LearnerNav from "../../components/learner/LearnerNav";
import { toast } from "react-toastify";
import { AlertCircle } from "lucide-react";


export default function ForgotPassword() {


  type Role = 'learner' | 'instructor' | 'business';


  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();


  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("learner");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)


  // Simple email regex (RFC 5322 basic)
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");


    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }


    if (!role) {
      setError("Please select a role");
      return;
    }


    try {
      setLoading(true)
      await dispatch(verifyEmail({ email, role })).unwrap();
      dispatch(setSignupCredentials({ email, role }));
      navigate("/reset/verify-otp");
    } catch (err) {
      console.error("Password reset request failed", err);
      toast.error(err as string);
    } finally {
      setLoading(false)
    }
  };


  return (
    <>
      <LearnerNav />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full grid md:grid-cols-2 overflow-hidden">
          {/* Left side with image */}
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
              <h1 className="text-4xl font-bold mb-6 leading-tight">Forgot Password?</h1>
              <p className="text-lg text-teal-100">
                Enter your registered email and select your role. We'll send you an OTP to reset your password securely.
              </p>
            </div>
          </div>


          {/* Right side form */}
          <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
            <div className="w-full max-w-sm mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Reset Password
              </h2>


              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="font-medium text-sm">{error}</span>
                </div>
              )}


              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    disabled={loading}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-900 placeholder-gray-500 ${
                      error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500 focus:border-transparent"
                    } ${loading ? "bg-gray-50 cursor-not-allowed" : "bg-white"}`}
                    placeholder="Enter your registered email"
                  />
                </div>


                {/* Role Selector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Your Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="learner">Learner</option>
                    <option value="instructor">Instructor</option>
                    <option value="business">Business</option>
                  </select>
                </div>


                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
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
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-8">
                Remember your password?{" "}
                <a href="/signin" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
