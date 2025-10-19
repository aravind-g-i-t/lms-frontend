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
  const [loading,setLoading]=useState(false)

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
              <h1 className="text-4xl font-bold mb-6">Reset Your Password</h1>
              <p className="text-lg text-gray-200">
                Enter your new password and confirm it to regain access.
              </p>
            </div>
          </div>

          {/* Right side form */}
          <div className="p-12 flex flex-col justify-center bg-white">
            <div className="w-full max-w-sm mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Create New Password
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-green-500"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-green-500"
                    placeholder="Re-enter new password"
                  />
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
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
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
