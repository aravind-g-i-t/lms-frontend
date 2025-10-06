import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
// import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
// import { jwtDecode } from 'jwt-decode';
import type { RootState, AppDispatch } from '../../redux/store';
import { validateEmail, validatePassword } from '../../utils/validation';
import { clearUserStatus } from '../../redux/slices/statusSlice';
import { signin } from '../../redux/services/userAuthServices';
import { setLearner } from '../../redux/slices/learnerSlice';
import { setInstructor } from '../../redux/slices/instructorSlice';
import { setBusiness } from '../../redux/slices/businessSlice';
import { Eye, EyeOff } from "lucide-react";
import GoogleSigninButton from '../../components/shared/GoogleSigninButton';
import LearnerNav from '../../components/learner/LearnerNav';
import { toast } from 'react-toastify';

type Role = 'learner' | 'instructor' | 'business';

export default function Signin() {
  const { errorMsg } = useSelector((state: RootState) => state.status.user);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    return () => {

      dispatch(clearUserStatus());
    }
  }, [dispatch])

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [show, setShow] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('learner');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const roles = [
    { label: 'Learner', value: 'learner' },
    { label: 'Instructor', value: 'instructor' },
    { label: 'Business', value: 'business' }
  ] as const;


  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    if (emailErr || passwordErr) {
      return;
    }
    const signinInput = {
      role: selectedRole,
      email,
      password
    }
    try {
      const result = await dispatch(signin(signinInput)).unwrap();
      const user = result.user
      if (selectedRole === 'learner') {
        dispatch(setLearner(user))
      } else if (selectedRole === 'instructor') {
        dispatch(setInstructor(user))
      } else {
        dispatch(setBusiness(user))
      }
      navigate(`/${selectedRole}/dashboard`)

    } catch (err) {
      console.error("Signin failed:", err);
      toast.error(err as string)
    }
  };


  const handleRoleSelect = (role: Role) => setSelectedRole(role);

  return (
    <>
      <LearnerNav />

      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2">
          <div className="relative h-full min-h-[600px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" style={{
              backgroundImage: `url('/images/auth.jpg')`
            }} />
            <div className="relative z-10 p-12 flex flex-col justify-center h-full text-white">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Your gateway to knowledge, <br />skills, and opportunities
              </h1>
              <p className="text-xl text-gray-200">
                NligtN
              </p>
            </div>
          </div>

          <div className="p-12 flex flex-col justify-center bg-white">
            <div className="w-full max-w-sm mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Sign in</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Role</label>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    {roles.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => handleRoleSelect(role.value)}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${selectedRole === role.value
                          ? 'bg-white text-green-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                          }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>
                {errorMsg && (
                  <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {selectedRole === 'business' ? 'Company Email' : 'Email address'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    placeholder=""
                  />
                </div>
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 pr-10"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    >
                      {show ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                {/* Forgot Password */}
                <div className="text-right">
                  <span className="text-sm text-gray-500">
                    Forgot password? <Link to="/reset/email" className="text-blue-500 hover:text-blue-600">Reset password</Link>
                  </span>
                </div>

                {/* Sign In Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Sign in as {selectedRole}
                </button>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                By signing in, you agree to our Terms of service and Privacy policy
              </p>

              {/* Divider */}
              <div className="mt-8 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500 text-sm">or</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>


              {/* <GoogleLogin
                onSuccess={handleGoogleSignIn}
                onError={() => {
                  console.log("Login Failed");
                }}
                useOneTap
              /> */}

              <GoogleSigninButton role={selectedRole} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}