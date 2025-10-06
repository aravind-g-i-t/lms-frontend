
import { useEffect, useState } from "react";
import { validateTextField, validateEmail, validatePassword, validateConfirmPassword } from "../../utils/validation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { sendOTP } from "../../redux/services/userAuthServices";
import { clearUserStatus } from "../../redux/slices/statusSlice";
import { Eye, EyeOff } from "lucide-react";
import LearnerNav from "../../components/learner/LearnerNav";
import { toast } from "react-toastify";

type Role = 'learner' | 'instructor' | 'business';


const UserSignup = () => {

  const { loading, errorMsg } = useSelector((state: RootState) => state.status.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();


  useEffect(() => {
    return () => {
      dispatch(clearUserStatus());
    }
  }, [dispatch])

  const [selectedRole, setSelectedRole] = useState<Role>('learner');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');


  const roles = [
    { label: 'Learner', value: 'learner' },
    { label: 'Instructor', value: 'instructor' },
    { label: 'Business', value: 'business' }
  ] as const;

  const handleRoleSelect = (role: Role) => setSelectedRole(role);

  async function handleSubmit() {
    const nameErr = validateTextField('Name', name);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmPasswordErr = validateConfirmPassword(password, confirmPassword)
    setNameError(nameErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr)

    if (nameErr || emailErr || passwordErr || confirmPasswordErr) {
      return;
    }
    const signupInput = {
      role: selectedRole,
      name,
      email,
      password
    }

    try {
      await dispatch(sendOTP(signupInput)).unwrap();
      navigate("/verify-otp")
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error(error as string)
    }

  }

  return (
    <>
      <LearnerNav />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2">
          <div className="relative h-full min-h-[700px]">
            <div
              className="absolute inset-0 bg-cover bg-center"

            />
            <div className="absolute inset-0 bg-black bg-opacity-50" style={{
              backgroundImage: "url('/images/auth.jpg')"
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Sign up</h2>


              <div className="space-y-5">
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
                  {errorMsg && (
                    <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
                  )}
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{selectedRole === 'business' ? 'Company Name' : 'Full Name'}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    placeholder=""
                  />
                  {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{selectedRole === 'business' ? 'Company Email' : 'Email'} </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    placeholder=""
                  />
                  {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 pr-10"
                        placeholder=""
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 pr-10"
                        placeholder=""
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors mt-6 ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                >
                  {loading ? "Sending OTP..." : "Sign up"}
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}



export default UserSignup
