import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, LogOut, MessageCircleIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import type { AppDispatch, RootState } from "../../redux/store";
import { clearLearner } from "../../redux/slices/learnerSlice";
import { toast } from "react-hot-toast"
import { logout } from "../../services/userAuthServices";

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
      <header className="bg-teal-500 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-teal-600 transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-teal-600 font-bold text-sm">N</span>
                </div>
                <span className="text-lg font-semibold hidden sm:inline">
                  NlightN
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6">
              <Link
                to="/home"
                className="text-teal-50 hover:text-white px-3 py-2 rounded-lg transition-colors"
              >
                Home
              </Link>
              {name && (
                <Link
                  to="/learner/dashboard"
                  className="text-teal-50 hover:text-white px-3 py-2 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/explore"
                className="text-teal-50 hover:text-white px-3 py-2 rounded-lg transition-colors"
              >
                Explore
              </Link>
            </nav>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-lg mx-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-200 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Want to learn?"
                  className="w-full pl-10 pr-4 py-2 border border-teal-400 rounded-lg bg-teal-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {name ? (
                <>
  
                  <Link
                    to="/learner/messages"
                    title="Messages"
                    className="p-2 rounded-lg hover:bg-teal-600 transition-colors hidden sm:block"
                  >
                    <MessageCircleIcon className="w-5 h-5" />
                  </Link>

                  {/* Profile Button */}
                  <button
                    onClick={() => navigate("/learner/profile")}
                    title="Profile"
                    className="flex items-center gap-2 bg-white rounded-full px-2 sm:px-3 py-1 hover:bg-teal-100 transition-colors"
                  >
                    <img
                      src={profilePic || "/images/default-profile.jpg"}
                      alt={name || "profile"}
                      className="w-8 h-8 rounded-full object-cover border border-teal-300"
                    />
                    <span className="text-teal-700 font-medium hidden sm:inline text-sm">
                      {name}
                    </span>
                  </button>

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="text-white border border-white hover:bg-teal-600 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                  >
                    Sign in
                  </Link>

                  <Link
                    to="/signup"
                    className="bg-white hover:bg-teal-100 text-teal-600 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base hidden sm:inline-block"
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
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar - Gray theme matching instructor side */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-lg font-semibold">NlightN</span>
            </div>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Bar in Sidebar */}
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Want to learn?"
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col p-4 space-y-2 flex-1">
            <Link
              to="/home"
              onClick={closeSidebar}
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded-lg transition-colors"
            >
              Home
            </Link>
            {name && (
              <Link
                to="/learner/dashboard"
                onClick={closeSidebar}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/explore"
              onClick={closeSidebar}
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded-lg transition-colors"
            >
              Explore
            </Link>
          </nav>

          {/* Sidebar Footer */}
          {name && (
            <div className="mt-auto p-4 border-t border-gray-700 space-y-3">

              {/* <button className="w-full flex items-center space-x-3 text-gray-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
              </button> */}
              <button className="w-full flex items-center space-x-3 text-gray-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                <MessageCircleIcon className="w-5 h-5" />
                <span>Messages</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 text-gray-300 hover:text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}