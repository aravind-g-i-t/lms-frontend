import { useEffect, useState } from "react";
import { Shield, Mail, Lock } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminSignin } from "../../redux/services/adminServices";
import type { AppDispatch } from "../../redux/store";
import { validateEmail, validatePassword } from "../../utils/validation";
import { clearAdminStatus } from "../../redux/slices/statusSlice";
import { toast } from "react-toastify";

export default function AdminSignin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading,setLoading]=useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(()=>{
        return ()=>{
            dispatch(clearAdminStatus())
        }
    })



    const handleSubmit = async () => {

        const emailErr=validateEmail(email)
        if (emailErr) {
            setEmailError(emailErr);
            return;
        }
        const passwordErr=validatePassword(password)
        if (passwordErr) {
            setPasswordError(passwordErr);
            return;
        }
        setEmailError("");
        setPasswordError("")
        setLoading(true)

        try {
            await dispatch(adminSignin({email, password})).unwrap();

            navigate("/admin/dashboard");
            
        } catch (error) {
            toast.error(error as string)
            console.log('adminSigninError',error)
        }finally{
            setLoading(false)
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600">
                        <div className="flex items-center space-x-3">
                            <Shield className="w-8 h-8 text-white" />
                            <h2 className="text-2xl font-bold text-white">Admin Login</h2>
                        </div>
                        {/* <p className="mt-2 text-blue-100 text-sm">
                            Secure access to SkillNest dashboard
                        </p> */}
                    </div>

                    <div className="px-8 py-8">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                            className="space-y-6"
                        >



                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email Address
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="email"
                                    />
                                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                </div>
                                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="••••••••"
                                    />
                                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                </div>
                                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                {/* <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-gray-600">Remember me</span>
                                </label> */}
                                {/* <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Forgot password?
                                </a> */}
                            </div>

                            {/* Sign In Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
                    </div>
                </div>
            </div>
        </div>
    );
}
