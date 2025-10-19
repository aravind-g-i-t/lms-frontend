import {  useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { sendOTP } from "../../redux/services/userAuthServices";
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2">
          <div className="relative h-full min-h-[700px]">
            <div className="absolute inset-0 bg-black bg-opacity-50" style={{ backgroundImage: "url('/images/auth.jpg')" }} />
            <div className="relative z-10 p-12 flex flex-col justify-center h-full text-white">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Your gateway to knowledge, <br />skills, and opportunities
              </h1>
              <p className="text-xl text-gray-200">NligtN</p>
            </div>
          </div>

          <div className="p-12 flex flex-col justify-center bg-white">
            <div className="w-full max-w-sm mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Sign up</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Role</label>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    {roles.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role.value);
                          reset();
                        }}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${selectedRole === role.value
                            ? "bg-white text-green-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {selectedRole === "business" ? "Company Name" : "Full Name"}
                  </label>
                  <input
                    {...register("name")}
                    maxLength={20}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {selectedRole === "business" ? "Company Email" : "Email"}
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        {...register("confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors mt-6 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"
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
