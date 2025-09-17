import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"

const ProtectedAdmin = () => {
  const { id } = useSelector((state: RootState) => state.admin)

  if (!id) {
    return <Navigate to="/admin/signin" replace />
  }

  return <Outlet />
}

export default ProtectedAdmin
