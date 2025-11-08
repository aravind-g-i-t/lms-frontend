import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../redux/store';
import { signin } from '../../redux/services/userAuthServices';
import { setLearner } from '../../redux/slices/learnerSlice';
import { setInstructor } from '../../redux/slices/instructorSlice';
import { setBusiness } from '../../redux/slices/businessSlice';
import { Eye, EyeOff } from "lucide-react";
import GoogleSigninButton from '../../components/shared/GoogleSigninButton';
import LearnerNav from '../../components/learner/LearnerNav';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';


type Role = 'learner' | 'instructor' | 'business';


interface SigninForm {
  email: string;
  password: string;
}


const getSchema = (role: Role) => yup.object().shape({
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
    .matches(/[@$!%*?&#]/, "Password must contain at least one special character")
});


export default function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();




  const [show, setShow] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('learner');
  const roles = [
    { label: 'Learner', value: 'learner' },
    { label: 'Instructor', value: 'instructor' },
    { label: 'Business', value: 'business' }
  ] as const;


  const { register, handleSubmit, formState: { errors }, reset } = useForm<SigninForm>({
    resolver: yupResolver(getSchema(selectedRole))
  });


  const onSubmit = async (data: SigninForm) => {
    const signinInput = { role: selectedRole, ...data };
    try {
      const result = await dispatch(signin(signinInput)).unwrap();
      const user = result.user;
      if (selectedRole === 'learner') dispatch(setLearner(user));
      else if (selectedRole === 'instructor') dispatch(setInstructor(user));
      else dispatch(setBusiness(user));


      navigate(`/${selectedRole}/dashboard`);
    } catch (err) {
      console.error("Signin failed:", err);
      toast.error(err as string);
    }
  };


  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    reset(); // reset form and errors when role changes
  };


  return (
    <>
      <LearnerNav />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2">
          {/* Left Side - Image */}
          <div className="relative h-full min-h-[600px] hidden md:block">
            <div className="absolute inset-0 bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600/80 to-teal-800/80" style={{ backgroundImage: `url('/images/auth.jpg')` }} />
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Sign in</h2>


              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Role</label>
                  <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                    {roles.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => handleRoleSelect(role.value)}
                        className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all ${selectedRole === role.value
                          ? 'bg-teal-600 text-white shadow-md'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                          }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>


                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {selectedRole === 'business' ? 'Company Email' : 'Email address'}
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={selectedRole === 'business' ? 'company@example.com' : 'you@example.com'}
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-2 font-medium">{errors.email.message}</p>}
                </div>


                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      maxLength={30}
                      {...register('password')}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 pr-10 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-teal-600 transition-colors"
                    >
                      {show ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-600 text-sm mt-2 font-medium">{errors.password.message}</p>}
                </div>


                {/* Forgot Password Link */}
                <div className="text-right">
                  <span className="text-sm text-gray-600">
                    Forgot password? <Link to="/reset/email" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">Reset password</Link>
                  </span>
                </div>


                {/* Sign In Button */}
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Sign in as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                </button>
              </form>


              {/* Terms Text */}
              <p className="text-xs text-gray-500 mt-4 leading-relaxed text-center">
                By signing in, you agree to our <span className="text-teal-600 hover:text-teal-700 cursor-pointer font-medium">Terms of service</span> and <span className="text-teal-600 hover:text-teal-700 cursor-pointer font-medium">Privacy policy</span>
              </p>


              {/* Divider */}
              <div className="mt-8 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500 text-sm font-medium">or</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>


              {/* Google Sign In */}
              <GoogleSigninButton role={selectedRole} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
