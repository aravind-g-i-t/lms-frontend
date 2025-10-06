import { Route,Routes } from "react-router-dom"
import LearnerDashboard from "../pages/learner/Dashboard"
import LearnerProfile from "../pages/learner/Profile"

const LearnerRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<LearnerDashboard/>}/>
      <Route path="profile" element={<LearnerProfile/>}/>
    </Routes>
  )
}

export default LearnerRoutes
