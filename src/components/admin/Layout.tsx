import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./Sidebar";


export default function AdminLayout() {
  return (
    <>
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6">

      <Outlet/>
      </main>
    </div>
    </>
  )
}
