import { Search, ShoppingCart, Bell, User } from 'lucide-react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { logout } from '../../redux/services/userAuthServices';
import toast from 'react-hot-toast';
import { clearLearner } from '../../redux/slices/learnerSlice';
import { useNavigate, Link } from 'react-router-dom';


const LearnerDashboard = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
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


  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold">N</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">NlightN</span>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex space-x-8">
                <Link
                  to="/learner/home"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2"
                >
                  Home
                </Link>
                <Link
                  to="/learner/dashboard"
                  className="text-green-700 hover:text-gray-900 px-3 py-2"
                >
                  Dashboard
                </Link>
                <Link to="#" className="text-gray-700 hover:text-gray-900 px-3 py-2">
                  Explore
                </Link>
              </nav>

              {/* Search Bar */}
              <div className="flex-1 max-w-lg mx-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Want to learn?"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Right side icons */}
              <div className="flex items-center space-x-4">
                <ShoppingCart className="w-5 h-5 text-gray-600 cursor-pointer" />
                <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />

                {/* Profile Unit */}
                <Link
                  to="/learner/profile"
                  className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Aravind</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

      </div>


    </>
  )
}

export default LearnerDashboard
