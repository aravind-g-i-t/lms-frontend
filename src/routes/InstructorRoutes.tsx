import { Navigate, Route,Routes } from "react-router-dom"

import InstructorLayout from "../components/instructor/Layout"
import InstructorDashboard from "../pages/instructor/Dashboard"
import InstructorCourses from "../pages/instructor/Courses"
import InstructorStudents from "../pages/instructor/Students"
import InstructorLiveSessions from "../pages/instructor/LiveSessions"
import InstructorMessages from "../pages/instructor/Messages"
import InstructorWallet from "../pages/instructor/Wallet"
import InstructorProfile from "../pages/instructor/Profile"
import CreateCourse from "../pages/instructor/CreateCourse"
import ViewCoursePage from "../pages/instructor/ViewCourse"
import EditCoursePage from "../pages/instructor/EditCourse"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"

const InstructorRoutes = () => {
  const { role } = useSelector((state: RootState) => state.auth)

  if (role!=="instructor") {
    return <Navigate to="/signin" replace />
  }
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
          <Route path="courses/create" element={< CreateCourse/>} />
          <Route path="courses/:courseId/preview" element={< ViewCoursePage/>} />
          <Route path="courses/:courseId/edit" element={< EditCoursePage/>} />
          
        </Route>
    </Routes>
  )
}

export default InstructorRoutes
