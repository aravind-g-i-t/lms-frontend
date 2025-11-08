import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../redux/services/userAuthServices";
import { clearSignup } from "../../redux/slices/signupSlice";
import LearnerNav from "../../components/learner/LearnerNav";
import { toast } from "react-toastify";


export default function ResetPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { email, role } = useSelector((state: RootState) => state.signup);


  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false)


  const validatePassword = (pwd: string, confirmPwd: string) => {
    if (!pwd || !confirmPwd) return "Both fields are required";
    if (pwd.length < 6) return "Password must be at least 6 characters";
    if (pwd !== confirmPwd) return "Passwords do not match";
    return "";
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");


    const validationError = validatePassword(password, confirm);
    if (validationError) {
      setError(validationError);
      return;
    }


    if (!role || !email) {
      setError("Unexpected error. Please try again.");
      return;
    }


    try {
      setLoading(true)
      await dispatch(resetPassword({ role, email, password })).unwrap();
      toast.success("Password reset successful!");
      dispatch(clearSignup());
      navigate("/signin");
    } catch (err) {
      console.error("Reset password failed", err);
      setError("Failed to reset password. Please try again.");
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
              <h1 className="text-4xl font-bold mb-6 leading-tight">Reset Your Password</h1>
              <p className="text-lg text-teal-100">
                Enter your new password and confirm it to regain access to your account.
              </p>
            </div>
          </div>


          {/* Right side form */}
          <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
            <div className="w-full max-w-sm mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Create New Password
              </h2>


              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-3">
                  <span className="text-red-500 font-bold mt-0.5">!</span>
                  <span className="font-medium">{error}</span>
                </div>
              )}


              {successMsg && (
                <div className="bg-teal-50 border-l-4 border-teal-500 text-teal-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-3">
                  <span className="text-teal-500 font-bold mt-0.5">✓</span>
                  <span className="font-medium">{successMsg}</span>
                </div>
              )}


              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    maxLength={20}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500"
                    placeholder="Enter new password (min. 6 characters)"
                  />
                </div>


                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    maxLength={20}
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500"
                    placeholder="Re-enter new password"
                  />
                </div>


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
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>


              <p className="text-center text-sm text-gray-600 mt-6">
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
