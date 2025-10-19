import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { setSignupCredentials } from "../../redux/slices/signupSlice";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../../redux/services/userAuthServices";
import LearnerNav from "../../components/learner/LearnerNav";
import { toast } from "react-toastify";

export default function ForgotPassword() {

  type Role = 'learner' | 'instructor' | 'business';

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("learner");
  const [error, setError] = useState("");
  const [loading,setLoading]=useState(false)

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
    }finally{
      setLoading(false)
    }
  };

  return (
    <>
      <LearnerNav />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full grid md:grid-cols-2">
          {/* Left side with image */}
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
              <h1 className="text-4xl font-bold mb-6">Forgot Password?</h1>
              <p className="text-lg text-gray-200">
                Enter your registered email and select your role, we'll send you
                an OTP to reset your password.
              </p>
            </div>
          </div>

          {/* Right side form */}
          <div className="p-12 flex flex-col justify-center bg-white">
            <div className="w-full max-w-sm mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Reset Password
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {/* {successMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                  {successMsg}
                </div>
              )} */}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      error ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
                    } ${loading ? "bg-gray-50" : "bg-white"}`}
                    placeholder="Enter your registered email"
                  />
                </div>

                {/* Role Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="learner">Learner</option>
                    <option value="instructor">Instructor</option>
                    <option value="business">Business</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
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
                      Sending...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
