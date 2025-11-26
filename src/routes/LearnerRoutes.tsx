import { Navigate, Route,Routes } from "react-router-dom"
import LearnerDashboard from "../pages/learner/Dashboard"
import LearnerProfile from "../pages/learner/Profile"
import Checkout from "../pages/learner/Checkout"
import PaymentResult from "../pages/learner/PaymentResult"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import CoursePlayerPage from "../pages/learner/CoursePlayer"

const LearnerRoutes = () => {
  const { id } = useSelector((state: RootState) => state.learner);

  if (!id) {
    return <Navigate to="/signin" replace />
  }
  return (
    <Routes>
      <Route path="dashboard" element={<LearnerDashboard/>}/>
      <Route path="profile" element={<LearnerProfile/>}/>
      <Route path="checkout/:courseId" element={<Checkout/>}/>
      <Route path="payment/status" element={<PaymentResult/>}/>
      <Route path="/courses/:courseId/learn" element={<CoursePlayerPage />} />

    </Routes>
  )
}

export default LearnerRoutes
