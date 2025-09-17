import { Route,Routes } from "react-router-dom"
import LearnerDashboard from "../pages/learner/Dashboard"
import Home from "../pages/learner/Home"
import LearnerProfile from "../pages/learner/Profile"

const LearnerRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<LearnerDashboard/>}/>
      <Route path="home" element={<Home/>}/>
      <Route path="profile" element={<LearnerProfile/>}/>
    </Routes>
  )
}

export default LearnerRoutes
