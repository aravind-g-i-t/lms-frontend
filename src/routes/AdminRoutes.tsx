import { Navigate, Route,Routes } from "react-router-dom"
import AdminSignin from "../pages/admin/Signin"
import AdminDashboard from "../pages/admin/Dashboard";
import ProtectedAdmin from "./ProtectedAdmin";
import AdminLayout from "../components/admin/Layout";
import ManageLearners from "../pages/admin/Learners";
import ManageBusinesses from "../pages/admin/Business";
import ManageInstructors from "../pages/admin/Instructors";

const AdminRoutes = () => {

    return (
    <Routes>
        <Route path="signin" element={<AdminSignin/>}/>
        <Route element={<ProtectedAdmin />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="learners" element={<ManageLearners />} />
          <Route path="instructors" element={<ManageInstructors />} />
          <Route path="business" element={<ManageBusinesses />} />
        </Route>
        
        {/* <Route>

        </Route> */}
      </Route>

    </Routes>
  )
}

export default AdminRoutes
