import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type{ AppDispatch, RootState } from "../../redux/store";
import { clearLearner } from "../../redux/slices/learnerSlice";
import { toast } from "react-hot-toast"
import { logout } from "../../redux/services/userAuthServices";

export default function LearnerNav() {
  const { name,profilePic } = useSelector((state: RootState) => state.learner);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

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
      let message = "Network error. Logging out locally.";
      console.error("Logout error:", error);

      if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
      dispatch(clearLearner());
      navigate("/signin");
    }
  };


  if (!name) return null;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center mr-2">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-semibold text-gray-900">NlightN</span>
        </div>

        {/* Right section */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img
              src={profilePic || "/images/default-profile.jpg"}
              alt="User avatar"
              className="w-8 h-8 rounded-full object-cover border"
            />
            <span className="font-medium text-gray-800">{name}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
              <Link
                to="/learner/profile"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className="w-4 h-4 mr-2" />
                My Profile
              </Link>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
