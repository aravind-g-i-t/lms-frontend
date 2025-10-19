import { Routes,Route, Navigate } from "react-router-dom"
import UserSignup from "../pages/auth/Signup"
import OtpVerification from "../pages/auth/OTPVerification"
import Signin from "../pages/auth/Signin"
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import LearnerRoutes from "./LearnerRoutes";
import AdminRoutes from "./AdminRoutes";
import InstructorRoutes from "./InstructorRoutes";
import BusinessRoutes from "./BusinessRoutes";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import ResetOtpVerification from "../pages/auth/ResetOTPVerify";
import Home from "../pages/learner/Home";

const AppRoutes = () => {
  const { role } = useSelector((state: RootState) =>state.auth);
  const { email}=useSelector((state:RootState)=> state.signup)
  return (
    <Routes>
      <Route path="/home" element={<Home/>}/>
      {!role &&<Route path="/signup" element={<UserSignup/>}/>}
      {!role && email && <Route path="/verify-otp" element={<OtpVerification/>}/>}
      {!role &&<Route path="/reset/email" element={<ForgotPassword/>}/>}
      {!role &&<Route path="/reset" element={<ResetPassword/>}/>}
      {!role &&<Route path="/reset/verify-otp" element={<ResetOtpVerification/>}/>}
     { !role && <Route path="/signin" element={<Signin/>}/>}

      <Route path="/admin/*" element={<AdminRoutes />} />
      {role === "learner" && <Route path="/learner/*" element={<LearnerRoutes />} />}
      {role === "instructor" && <Route path="/instructor/*" element={<InstructorRoutes />} />}
      {role === "business" && <Route path="/business/*" element={<BusinessRoutes />} />}


      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  )
}

export default AppRoutes
