import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  BookOpen,
  TrendingUp,
  Target,
  BarChart3,
  Search,
  Bell,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { logout } from "../../redux/services/userAuthServices";
import toast from "react-hot-toast";
import { clearBusiness } from "../../redux/slices/businessSlice";

const BusinessLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  const { name, profilePic } = useSelector((state: RootState) => state.business)

  const sidebarItems = [
    { name: "Dashboard", icon: Building2, path: "/business/dashboard" },
    { name: "Team Management", icon: Users, path: "/business/teams" },
    { name: "Course Catalog", icon: BookOpen, path: "/business/courses" },
    { name: "Learning Paths", icon: Target, path: "/business/paths" },
    { name: "Analytics", icon: BarChart3, path: "/business/analytics" },
    { name: "Reports", icon: TrendingUp, path: "/business/reports" },
    { name: "Settings", icon: Settings, path: "/business/settings" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logged out successfully");
      dispatch(clearBusiness());
      navigate("/signin");

    } catch (error: unknown) {
      let message = "Network error. Logging out locally.";
      console.error("Logout error:", error);

      if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
      dispatch(clearBusiness());
      navigate("/signin");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Sidebar */}
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white py-6 px-3 transition-all duration-300 flex flex-col ${isCollapsed ? "w-20" : "w-64"
          }`}
      >
        <div className="flex items-center justify-between mb-6">
          {/* Brand */}
          {!isCollapsed ? (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-lg mr-3 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-semibold">NlightN</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          )}

          {/* Toggle */}
          <button
            aria-expanded={!isCollapsed}
            onClick={() => setIsCollapsed((s) => !s)}
            className="text-gray-400 hover:text-white p-1 rounded focus:outline-none"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 mb-4" aria-label="Main navigation">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              title={isCollapsed ? item.name : undefined}
              className={({ isActive }) => {
                const active = isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white";
                const layout = isCollapsed ? "justify-center px-0" : "justify-start px-3";
                return `flex items-center rounded-lg transition-colors duration-200 py-3 ${active} ${layout}`;
              }}
            >
              <div
                className={`flex-shrink-0 flex items-center justify-center w-6 ${isCollapsed ? "" : "mr-3"
                  }`}
              >
                <item.icon className="w-5 h-5" />
              </div>
              {!isCollapsed && <span className="text-sm">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout button just below nav items */}
        <button
          onClick={handleLogout}
          className={`flex items-center rounded-lg transition-colors duration-200 py-3 ${isCollapsed ? "justify-center px-0" : "justify-start px-3"
            } text-gray-300 hover:bg-red-600 hover:text-white`}
        >
          <div
            className={`flex-shrink-0 flex items-center justify-center w-6 ${isCollapsed ? "" : "mr-3"
              }`}
          >
            <LogOut className="w-5 h-5" />
          </div>
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-white min-h-screen flex flex-col">
        <header className="bg-blue-500 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">NlightN Business</h1>
            <p className="text-blue-100 mt-1 text-sm">
              Empowering your team through continuous learning
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-blue-600 rounded-lg transition-colors" title="Search">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-blue-600 rounded-lg transition-colors" title="Notifications">
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/business/profile")}
              title="Profile"
              className="flex items-center gap-2 bg-white rounded-full px-3 py-1 hover:bg-teal-100 transition"
            >
              <img
                src={profilePic || "/images/default-profile.jpg"}
                alt={name || 'profile image'}
                className="w-9 h-9 rounded-full object-cover border border-teal-500"
              />
              <span className="text-teal-700 font-medium hidden sm:block">
                {name}
              </span>
            </button>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BusinessLayout;
