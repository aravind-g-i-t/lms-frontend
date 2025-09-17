import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  BookOpen,
  Users,
  Video,
  MessageSquare,
  Wallet,
  Search,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { logout } from "../../redux/services/userAuthServices";
import toast from "react-hot-toast";
import { clearInstructor } from "../../redux/slices/instructorSlice";

const InstructorLayout: React.FC = () => {

  const { name, profilePic } = useSelector((state: RootState) => state.instructor)
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarItems = [
    { name: "Dashboard", icon: User, path: "/instructor/dashboard" },
    { name: "Courses", icon: BookOpen, path: "/instructor/courses" },
    { name: "Students", icon: Users, path: "/instructor/students" },
    { name: "Live Sessions", icon: Video, path: "/instructor/live-sessions" },
    { name: "Messages", icon: MessageSquare, path: "/instructor/messages" },
    { name: "Wallet", icon: Wallet, path: "/instructor/wallet" },
  ];

  // auto-collapse on <1024px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const handleLogout = async () => {
    try {
      const response = await dispatch(logout()).unwrap();

      if (response.success) {
        toast.success("Logged out successfully");
        dispatch(clearInstructor());
        navigate("/signin");
      } else {
        toast.error(response?.message || "Failed to log out from server");
        dispatch(clearInstructor());
        navigate("/signin");
      }
    } catch (error: unknown) {
      let message = "Network error. Logging out locally.";
      console.error("Logout error:", error);

      if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
      dispatch(clearInstructor());
      navigate("/signin");
    }
  };

  // active tab
  const activePath = sidebarItems.find((item) =>
    location.pathname.startsWith(item.path)
  )?.name;

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white transition-all duration-300 flex flex-col
          ${collapsed ? "w-20 px-2 py-4" : "w-64 px-6 py-6"}`}
      >
        {/* Logo + toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold">Instructor</span>
            )}
          </div>

          {/* toggle (always visible now) */}
          <button
            aria-label="Toggle sidebar"
            onClick={() => setCollapsed((s) => !s)}
            className="p-2 rounded-md hover:bg-gray-700"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* nav */}
        <nav className="flex-1 overflow-visible">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  title={item.name}
                  className={`group flex items-center rounded-lg transition-colors w-full
                    ${collapsed ? "justify-center py-2 px-0" : "justify-start px-3 py-2"}
                    ${activePath === item.name
                      ? "bg-teal-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  {!collapsed && (
                    <span className="ml-3 truncate">{item.name}</span>
                  )}
                </Link>
              </li>
            ))}

            {/* Logout */}
            <li>
              <button
                onClick={handleLogout}
                title="Logout"
                className={`group flex items-center rounded-lg transition-colors w-full
                  ${collapsed ? "justify-center py-2 px-0" : "justify-start px-3 py-2"}
                  text-gray-300 hover:bg-red-600 hover:text-white`}
              >
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5" />
                </div>
                {!collapsed && <span className="ml-3 truncate">Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 bg-white min-h-screen">
        <header className="bg-teal-500 text-white px-6 py-4 flex items-center justify-between">
          <div>
            {/* <h1 className="text-2xl font-bold">Welcome {name}</h1>
            <p className="text-teal-100 mt-1">
              Ready to inspire your students today?
            </p> */}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/instructor/search"
              title="Search"
              className="p-2 rounded-lg hover:bg-teal-600"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              to="/instructor/notifications"
              title="Notifications"
              className="p-2 rounded-lg hover:bg-teal-600"
            >
              <Bell className="w-5 h-5" />
            </Link>
            <Link
              to="/instructor/settings"
              title="Settings"
              className="p-2 rounded-lg hover:bg-teal-600"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <button
              onClick={() => navigate("/instructor/profile")}
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

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;
