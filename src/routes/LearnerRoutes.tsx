import { Navigate, Route,Routes } from "react-router-dom"
import LearnerDashboard from "../pages/learner/Dashboard"
import LearnerProfile from "../pages/learner/Profile"
import Checkout from "../pages/learner/Checkout"
import PaymentResult from "../pages/learner/PaymentResult"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import CoursePlayerPage from "../pages/learner/CoursePlayer"
import LearnerMessagesPage from "../pages/learner/Messages"
import QuizPage from "../pages/learner/QuizPage"
import CourseLiveSessionsPage from "../pages/learner/CourseLiveSessions"

const LearnerRoutes = () => {
  const { role } = useSelector((state: RootState) => state.auth);

  if (role!=="learner") {
    return <Navigate to="/signin" replace />
  }
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<LearnerDashboard/>}/>
      <Route path="profile" element={<LearnerProfile/>}/>
      <Route path="messages" element={<LearnerMessagesPage/>}/>
      <Route path="checkout/:courseId" element={<Checkout/>}/>
      <Route path="payment/status" element={<PaymentResult/>}/>
      <Route path="/courses/:courseId/learn" element={<CoursePlayerPage />} />
      <Route path="/courses/:courseId/quiz" element={<QuizPage/>} />
      <Route path="courses/:courseId/live-sessions" element={< CourseLiveSessionsPage/>} />

    </Routes>
  )
}

export default LearnerRoutes
