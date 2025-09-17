import { Route,Routes,Navigate } from "react-router-dom"
import BusinessLayout from "../components/business/Layout"
import BusinessDashboard from "../pages/business/Dashboard"
import CourseCatalogPage from "../pages/business/Courses"
import TeamManagementPage from "../pages/business/Teams"

const BusinessRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BusinessLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
        {/* <Route path="profile" element={<InstructorProfile/>}/> */}
          <Route path="dashboard" element={<BusinessDashboard />} />
          <Route path="courses" element={<CourseCatalogPage />} />
          <Route path="teams" element={<TeamManagementPage />} />

          
        </Route>
    </Routes>
  )
}

export default BusinessRoutes

