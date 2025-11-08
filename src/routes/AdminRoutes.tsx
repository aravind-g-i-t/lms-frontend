import { Navigate, Route,Routes } from "react-router-dom"
import AdminSignin from "../pages/admin/Signin"
import AdminDashboard from "../pages/admin/Dashboard";
import ProtectedAdmin from "./ProtectedAdmin";
import AdminLayout from "../components/admin/Layout";
import ManageLearners from "../pages/admin/Learners";
import ManageBusinesses from "../pages/admin/Business";
import ManageInstructors from "../pages/admin/Instructors";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import ManageCategories from "../pages/admin/Category";
import ManageCourses from "../pages/admin/Courses";
import ViewCourse from "../pages/admin/ViewCourse";

const AdminRoutes = () => {
  const {role}=useSelector((state:RootState)=>state.auth)
    return (
    <Routes>
        {!role &&<Route path="signin" element={<AdminSignin/>}/>}
        <Route element={<ProtectedAdmin />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="learners" element={<ManageLearners />} />
          <Route path="instructors" element={<ManageInstructors />} />
          <Route path="businesses" element={<ManageBusinesses />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="courses" element={<ManageCourses />} />
          <Route path="courses/:courseId" element={<ViewCourse />} />


        </Route>
        

      </Route>

    </Routes>
  )
}

export default AdminRoutes
