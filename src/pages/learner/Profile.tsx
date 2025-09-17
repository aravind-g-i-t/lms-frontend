import React, { useState, useEffect } from "react";
import type{ ChangeEvent } from "react";
import {
  Search,
  ShoppingCart,
  Bell,
  Camera,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import toast from "react-hot-toast";
import { clearLearner } from "../../redux/slices/learnerSlice";
import { logout } from "../../redux/services/userAuthServices";
import { learnerResetPassword, updateLearnerProfile } from "../../redux/services/learnerServices";
import { uploadImageToCloudinary } from "../../config/cloudinary";

const LearnerProfile: React.FC = () => {
  const { id,name, profilePic, email } = useSelector(
    (state: RootState) => state.learner
  );
  

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [editableName, setEditableName] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );

  const userData = {
    joinDate: "January 2024",
    coursesCompleted: 12,
    totalHours: 145,
  };

  useEffect(() => {
    if (name) {
      setEditableName(name);
    }
  }, [name]);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validatePassword = () => {
    const errors: Record<string, string> = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters long";
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleUpdatePassword = async() => {
    const errors = validatePassword();

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    const currentPassword=passwordForm.currentPassword;
    const newPassword=passwordForm.newPassword;
    if(!id){
      return
    }
    const input={id,currentPassword,newPassword}
    await dispatch(learnerResetPassword(input))
    setShowSuccessMessage(true);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});

    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const resetPasswordForm = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
  };

  const handleImageUpload = async(event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];    
    if (!file) {
      return
    }
    const imageURL=await uploadImageToCloudinary(file);
    if(!imageURL || !id){
      return
    }
    const result=await dispatch(updateLearnerProfile({
        id,
        data:{
          imageURL
        }
        
      })).unwrap();

  console.log(result);
  
    
  };

  const handleUpdateProfile = async() => {

    if (editableName.trim() && id) {
      console.log(editableName,id);
      
      const result=await dispatch(updateLearnerProfile({
        id,
        data:{
          name:editableName.trim()
        }
        
      })).unwrap();
      console.log(result);
      
      toast.success("Name updated successfully");
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                NlightN
              </span>
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
                className="text-gray-700 hover:text-gray-900 px-3 py-2"
              >
                Dashboard
              </Link>
              <Link
                to="#"
                className="text-gray-700 hover:text-gray-900 px-3 py-2"
              >
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
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                  <img
                    src={profilePic || "/images/default-profile.jpg"}
                    alt={name ?? ""}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-gray-700 font-medium">{name}</span>
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          <button  className="hover:text-gray-900">
            <Link to="/learner/dashboard">
            Back to Dashboard
            </Link>
          </button>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-3" />
            <p className="text-green-700">Password updated successfully!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                {/* Profile Image */}
                <div className="relative inline-block mb-4">
                  <img
                    src={profilePic || "/images/default-profile.jpg"}
                    alt={editableName || ""}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <label className="absolute bottom-2 right-2 w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-600 transition-colors">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* User Info */}
                <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center border-b focus:outline-none focus:ring-2 focus:ring-teal-500">
                  {name}
                </h1>
                {/* <input
                  type="text"
                  value={editableName}
                  onChange={(e) => setEditableName(e.target.value)}
                  className="text-2xl font-bold text-gray-900 mb-1 text-center border-b focus:outline-none focus:ring-2 focus:ring-teal-500"
                /> */}
                <p className="text-gray-600 mb-4">{email}</p>
                <p className="text-sm text-gray-500 mb-6">
                  Member since {userData.joinDate}
                </p>

                {/* <button
                  onClick={handleUpdateProfile}
                  className="mt-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
                >
                  Save Name
                </button> */}

                {/* Stats */}
                <div className="border-t pt-6 mt-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-teal-600">
                        {userData.coursesCompleted}
                      </p>
                      <p className="text-sm text-gray-600">
                        Courses Completed
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-teal-600">
                        {userData.totalHours}
                      </p>
                      <p className="text-sm text-gray-600">Hours Learned</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              {/* Tab Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Account Settings
                </h2>
              </div>

              <div className="p-6">
                {/* Personal Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editableName}
                        onChange={(e) => setEditableName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email ?? ""}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleUpdateProfile}
                    className="mt-3 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
                  >
                    Save Changes
                  </button>
                </div>

                {/* Update Password */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Update Password
                  </h3>
                  <div className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            handlePasswordChange("currentPassword", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-lg pr-10 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                            passwordErrors.currentPassword
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter your current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-red-600 mt-1">
                          {passwordErrors.currentPassword}
                        </p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            handlePasswordChange("newPassword", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-lg pr-10 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                            passwordErrors.newPassword
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter new password (min. 8 characters)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-red-600 mt-1">
                          {passwordErrors.newPassword}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            handlePasswordChange("confirmPassword", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-lg pr-10 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                            passwordErrors.confirmPassword
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Confirm your new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">
                          {passwordErrors.confirmPassword}
                        </p>
                      )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleUpdatePassword}
                        className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
                      >
                        Update Password
                      </button>
                      <button
                        onClick={resetPasswordForm}
                        className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearnerProfile;
