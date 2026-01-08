import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"

const ProtectedAdmin = () => {
  const { role } = useSelector((state: RootState) => state.auth)

  if (role!=="admin") {
    return <Navigate to="/admin/signin" replace />
  }

  return <Outlet />
}

export default ProtectedAdmin
