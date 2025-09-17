import { Navigate, Route,Routes } from "react-router-dom"

import InstructorLayout from "../components/instructor/Layout"
import InstructorDashboard from "../pages/instructor/Dashboard"
import InstructorCourses from "../pages/instructor/Courses"
import InstructorStudents from "../pages/instructor/Students"
import InstructorLiveSessions from "../pages/instructor/LiveSessions"
import InstructorMessages from "../pages/instructor/Messages"
import InstructorWallet from "../pages/instructor/Wallet"
import InstructorProfile from "../pages/instructor/Profile"

const InstructorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<InstructorLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="profile" element={<InstructorProfile/>}/>
          <Route path="dashboard" element={<InstructorDashboard />} />
          <Route path="courses" element={<InstructorCourses />} />
          <Route path="students" element={<InstructorStudents />} />
          <Route path="live-sessions" element={<InstructorLiveSessions />} />
          <Route path="messages" element={<InstructorMessages />} />
          <Route path="wallet" element={<InstructorWallet />} />
          
        </Route>
    </Routes>
  )
}

export default InstructorRoutes
