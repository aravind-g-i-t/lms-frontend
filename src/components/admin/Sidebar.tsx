import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  FolderOpen,
  Tag,
  Ticket,
  ShieldCheck,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  LogOut, 
} from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { adminLogout } from "../../redux/services/adminServices";
import { clearAdmin } from "../../redux/slices/adminSlice";

const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { name: "Learners", icon: Users, href: "/admin/learners" },
  { name: "Instructors", icon: GraduationCap, href: "/admin/instructors" },
  { name: "Businesses", icon: Building2, href: "/admin/businesses" },
  { name: "Courses", icon: BookOpen, href: "/admin/courses" },
  { name: "Categories", icon: FolderOpen, href: "/admin/categories" },
  { name: "Offers", icon: Tag, href: "/admin/offers" },
  { name: "Coupons", icon: Ticket, href: "/admin/coupons" },
  { name: "Verifications", icon: ShieldCheck, href: "/admin/verifications" },
  { name: "Revenue", icon: DollarSign, href: "/admin/revenue" },
];

export function AdminSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(adminLogout()).unwrap();
      dispatch(clearAdmin());
      navigate("/admin/signin");
    } catch (error: unknown) {
      let message = "Network error. Logging out locally.";
      console.error("Logout error:", error);
      if (error instanceof Error) {
        message = error.message;
      }
      console.log(message);
      dispatch(clearAdmin());
      navigate("/admin/signin");
    }
  };

  return (
    <div
      className={`bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div>
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-white tracking-wide">
                NlightN Admin Panel
              </h2>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                end
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-teal-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  } ${isCollapsed ? "justify-center px-2" : "justify-start"}`
                }
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800 space-y-3">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors 
          text-gray-300 hover:bg-red-600 hover:text-white ${
            isCollapsed ? "justify-center px-2" : "justify-start"
          }`}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="truncate">Logout</span>}
        </button>
      </div>
    </div>
  );
}