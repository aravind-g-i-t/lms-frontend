import { useEffect, useState } from "react";
import { Shield, Mail, Lock } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminSignin } from "../../redux/services/adminServices";
import type { AppDispatch } from "../../redux/store";
import { clearAdminStatus } from "../../redux/slices/statusSlice";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";


interface AdminSigninForm {
  email: string;
  password: string;
}


const adminSigninSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .matches(/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/, "Invalid email format")
    .max(100, "Email cannot exceed 100 characters"),


  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password cannot exceed 30 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[@$!%*?&#]/, "Password must contain at least one special character"),
});


export default function AdminSignin() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminSigninForm>({
    resolver: yupResolver(adminSigninSchema),
  });


  useEffect(() => {
    return () => {
      dispatch(clearAdminStatus());
    };
  }, [dispatch]);


  const onSubmit = async (data: AdminSigninForm) => {
    setLoading(true);
    try {
      await dispatch(adminSignin(data)).unwrap();
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error as string);
      console.error("adminSigninError", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-teal-600 to-teal-700">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">Admin Login</h2>
            </div>
          </div>


          {/* Form Content */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="admin@example.com"
                  />
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-2 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>


              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    {...register("password")}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="••••••••"
                  />
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-2 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>


              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Sign in to Dashboard</span>
                  </>
                )}
              </button>
            </form>

            {/* Security Note */}
            <p className="text-center text-xs text-gray-500 mt-6">
              🔒 This is a secure admin portal. Only authorized personnel should access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
