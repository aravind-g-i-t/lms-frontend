import {  useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { sendOTP } from "../../services/userAuthServices";
import { Eye, EyeOff } from "lucide-react";
import LearnerNav from "../../components/learner/LearnerNav";
import { toast } from "react-toastify";


type Role = "learner" | "instructor" | "business";


interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}


const getSchema = (role: Role) =>
  yup
    .object({
      name: yup
        .string()
        .required(`${role === "business" ? "Company" : "Full"} name is required`)
        .max(20, "Name cannot exceed 20 characters")
        .matches(/^[A-Za-z\s]+$/, "Name can only contain alphabets and spaces")
        .transform((value) =>
          value
            ? value
              .trim()
              .split(" ")
              .filter(Boolean)
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(" ")
            : value
        ),


      email: yup
        .string()
        .required(`${role === "business" ? "Company" : "Email"} is required`)
        .matches(
          /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/,
          "Invalid email format"
        )
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


      confirmPassword: yup
        .string()
        .required("Confirm password is required")
        .oneOf([yup.ref("password")], "Passwords must match"),
    })
    .required();



const UserSignup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();


  const [selectedRole, setSelectedRole] = useState<Role>("learner");
  const [loading,setLoading]=useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpForm>({
    resolver: yupResolver(getSchema(selectedRole)),
  });




  const onSubmit = async (data: SignUpForm) => {
    const signupInput = {
      role: selectedRole,
      ...data,
    };


    try {
      setLoading(true)
      await dispatch(sendOTP(signupInput)).unwrap();
      navigate("/verify-otp");
    } catch (error) {
      toast.error(error as string);
    }finally{
      setLoading(false)
    }
  };


  const roles = [
    { label: "Learner", value: "learner" },
    { label: "Instructor", value: "instructor" },
    { label: "Business", value: "business" },
  ] as const;


  return (
    <>
      <LearnerNav />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2">
          {/* Left Side - Image */}
          <div className="relative h-full min-h-[600px] hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600/80 to-teal-800/80" style={{ backgroundImage: "url('/images/auth.jpg')" }} />
            <div className="relative z-10 p-12 flex flex-col justify-center h-full text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Your gateway to knowledge, <br />skills, and opportunities
              </h1>
              <p className="text-lg text-teal-100">NlightN</p>
            </div>
          </div>


          {/* Right Side - Form */}
          <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
            <div className="w-full max-w-sm mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Sign up</h2>


              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Role</label>
                  <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                    {roles.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role.value);
                          reset();
                        }}
                        className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all ${selectedRole === role.value
                            ? "bg-teal-600 text-white shadow-md"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                          }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>


                {/* Name Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {selectedRole === "business" ? "Company Name" : "Full Name"}
                  </label>
                  <input
                    {...register("name")}
                    maxLength={20}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={selectedRole === "business" ? "Your company name" : "Your full name"}
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-2 font-medium">{errors.name.message}</p>}
                </div>


                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {selectedRole === "business" ? "Company Email" : "Email"}
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={selectedRole === "business" ? "company@example.com" : "you@example.com"}
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-2 font-medium">{errors.email.message}</p>}
                </div>


                {/* Password Fields */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 pr-10 ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Min. 8 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-teal-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-600 text-xs mt-1 font-medium">{errors.password.message}</p>}
                  </div>


                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        {...register("confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 pr-10 ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Re-enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-teal-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-600 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>}
                  </div>
                </div>


                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full font-semibold py-3 px-4 rounded-lg transition-all mt-6 shadow-md hover:shadow-lg ${loading 
                    ? "bg-gray-400 cursor-not-allowed text-gray-600" 
                    : "bg-teal-600 hover:bg-teal-700 text-white"
                  }`}
                >
                  {loading ? "Sending OTP..." : "Sign up"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default UserSignup;
