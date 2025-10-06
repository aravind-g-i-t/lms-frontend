import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, ShoppingCart, Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import type { AppDispatch, RootState } from "../../redux/store";
import { clearLearner } from "../../redux/slices/learnerSlice";
import { toast } from "react-hot-toast"
import { logout } from "../../redux/services/userAuthServices";

export default function LearnerNav() {
  const { name, profilePic } = useSelector((state: RootState) => state.learner);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await dispatch(logout()).unwrap();

      if (response.success) {
        toast.success("Logged out successfully");
        dispatch(clearLearner());
        navigate("/signin");
      } else {
        toast.error(response?.message || "Failed to log out from server");
        dispatch(clearLearner());
        navigate("/signin");
      }
    } catch (error: unknown) {
      console.error("Logout error:", error);
      dispatch(clearLearner());
      navigate("/signin");
    }
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Menu Button */}
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="flex items-center">
                <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold">N</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">
                  NlightN
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/home"
                className="text-gray-700 hover:text-gray-900 px-3 py-2"
              >
                Home
              </Link>
              {name && (
                <Link
                  to="/learner/dashboard"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2"
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="#"
                className="text-gray-700 hover:text-gray-900 px-3 py-2"
              >
                Explore
              </Link>
            </nav>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Want to learn?"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {name ? (
                <>
                  <ShoppingCart className="w-5 h-5 text-gray-600 cursor-pointer hidden sm:block" />
                  <Bell className="w-5 h-5 text-gray-600 cursor-pointer hidden sm:block" />

                  {/* Profile Unit */}
                  <Link
                    to="/learner/profile"
                    className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                      <img
                        src={profilePic || "/images/default-profile.jpg"}
                        alt={name ?? ""}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-gray-700 font-medium hidden sm:inline">{name}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 text-sm sm:text-base"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="text-green-600 border border-green-600 hover:bg-green-50 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                  >
                    Sign in
                  </Link>

                  <Link
                    to="/signup"
                    className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base hidden sm:inline-block"
                  >
                    Create free account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                NlightN
              </span>
            </div>
            <button
              onClick={closeSidebar}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Bar in Sidebar */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Want to learn?"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col p-4 space-y-2">
            <Link
              to="/home"
              onClick={closeSidebar}
              className="text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-lg transition"
            >
              Home
            </Link>
            {name && (
              <Link
                to="/learner/dashboard"
                onClick={closeSidebar}
                className="text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-lg transition"
              >
                Dashboard
              </Link>
            )}
            <Link
              to="#"
              onClick={closeSidebar}
              className="text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-lg transition"
            >
              Explore
            </Link>
          </nav>

          {/* Sidebar Footer */}
          {name && (
            <div className="mt-auto p-4 border-t space-y-3">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-5 h-5 text-gray-600 cursor-pointer" />
                <span className="text-gray-700">Cart</span>
              </div>
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
                <span className="text-gray-700">Notifications</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}