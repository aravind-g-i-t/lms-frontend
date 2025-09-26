import {
  Building2,
  Mail,
  Globe,
  Edit,
  MapPin,
  Save,
  X,
  Lock,
  Calendar,
  Shield,
  Camera
} from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { getBusinessProfile, resetBusinessPassword, updateBusinessProfile, updateBusinessProfileImage } from "../../redux/services/businessServices";
import type { AppDispatch } from "../../redux/store";
import { toast } from "react-toastify";
import { setBusinessImage, setBusinessName } from "../../redux/slices/businessSlice";
import { uploadImageToCloudinary } from "../../config/cloudinary";
import { validateConfirmPassword, validatePassword } from "../../utils/validation";

const BusinessProfile = () => {

  const dispatch = useDispatch<AppDispatch>()
  const [isEditing, setIsEditing] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState<string | null>(null);
  const [hasPassword, setHasPassword] = useState(true);
  const [joiningDate, setJoiningDate] = useState("");
  const [businessDomain, setBusinessDomain] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // Reset password form state
  const [showResetForm, setShowResetForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await dispatch(getBusinessProfile()).unwrap();
        const data = response.business;

        setName(data.name);
        setEmail(data.email);
        setProfilePic(data.profilePic);
        setBusinessDomain(data.businessDomain);
        setLocation(data.location);
        setWebsite(data.website);
        setHasPassword(data.hasPassword);
        setJoiningDate(data.joiningDate);
      } catch (err) {
        console.error("Failed to fetch business profile:", err);
      }
    };

    fetchProfile();
  }, [dispatch]);



  const handleSave = async () => {

    const inputData = {
      name,
      businessDomain,
      website,
      location
    };

    const result = await dispatch(updateBusinessProfile(inputData)).unwrap();
    setIsEditing(false);
    dispatch(setBusinessName({ name }))
    toast.success(result.message);
  };




  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return
    }
    const imageURL = await uploadImageToCloudinary(file);
    if (!imageURL) {
      return
    }
    const result = await dispatch(updateBusinessProfileImage({
      imageURL
    })).unwrap();
    dispatch(setBusinessImage({ profilePic: imageURL }))
    setProfilePic(imageURL);
    toast.success(result.message)
  };




  const handleResetPassword = async () => {
    let errorMsg = validatePassword(currentPassword);
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }
    errorMsg = validatePassword(newPassword)
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }
    errorMsg = validateConfirmPassword(confirmPassword, newPassword);
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }
    const response = await dispatch(resetBusinessPassword({ currentPassword, newPassword })).unwrap()

    setShowResetForm(false);
    setNewPassword("");
    setConfirmPassword("");
    toast.success(response.message)
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Blue Gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-3xl p-8 mb-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Business Profile</h1>
                <p className="text-blue-100">Manage your business information and settings</p>
              </div>
              {isEditing ? (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/20 shadow-lg"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/20 shadow-lg"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-3xl shadow-2xl p-8 mb-8">
          {/* Profile Header Section */}
          <div className="flex items-center mb-10">
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-white" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors cursor-pointer">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

            </div>
            <div className="ml-8 flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block text-3xl font-bold text-white bg-gray-700 border-2 border-gray-600 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full"
                />
              ) : (
                <h2 className="text-3xl font-bold text-white mb-2">{name || "Business Name"}</h2>
              )}
              <div className="flex items-center space-x-4 mt-3">
                {/* {businessDomain &&
                <span className="flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30">
                  {businessDomain}
                </span>} */}
                <span className="text-gray-400 text-sm">
                  Member since {joiningDate ? new Date(joiningDate).getFullYear() : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Info Grid with Dark Theme Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Business Domain Card */}
            <div className="group">
              <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600 hover:bg-gray-600 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1">
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
                  <Building2 className="w-4 h-4 mr-2 text-blue-400" />
                  Business Domain
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={businessDomain || ""}
                    onChange={(e) => setBusinessDomain(e.target.value)}
                    className="w-full bg-gray-600 border-2 border-gray-500 rounded-xl px-4 py-3 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                ) : (
                  <p className="text-white font-medium text-lg">{businessDomain || "Not specified"}</p>
                )}
              </div>
            </div>

            {/* Email Card */}
            <div className="group">
              <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600 hover:bg-gray-600 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1">
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
                  <Mail className="w-4 h-4 mr-2 text-blue-400" />
                  Email Address
                </label>
                <p className="text-white font-medium text-lg break-all">{email || "Not provided"}</p>
              </div>
            </div>

            {/* Website Card */}
            <div className="group">
              <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600 hover:bg-gray-600 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1">
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
                  <Globe className="w-4 h-4 mr-2 text-blue-400" />
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={website || ""}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-gray-600 border-2 border-gray-500 rounded-xl px-4 py-3 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                ) : (
                  <a
                    href={website || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-medium text-lg hover:underline transition-colors"
                  >
                    {website || "Not provided"}
                  </a>
                )}
              </div>
            </div>

            {/* Location Card */}
            <div className="group">
              <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600 hover:bg-gray-600 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1">
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
                  <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={location || ""}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-gray-600 border-2 border-gray-500 rounded-xl px-4 py-3 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                ) : (
                  <p className="text-white font-medium text-lg">
                    {location || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            {/* Joining Date Card */}
            <div className="group">
              <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600 hover:bg-gray-600 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1">
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
                  <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                  Joining Date
                </label>
                <p className="text-white font-medium text-lg">
                  {joiningDate
                    ? new Date(joiningDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                    : "Not available"}
                </p>
              </div>
            </div>

            {/* Security Card */}
            <div className="group">
              <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600 hover:bg-gray-600 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1">
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
                  <Shield className="w-4 h-4 mr-2 text-blue-400" />
                  Security
                </label>
                {hasPassword ? (
                  <>
                    {showResetForm ? (
                      <div className="space-y-3">
                        <input
                          type="password"
                          placeholder="Current Password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-gray-600 border-2 border-gray-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-gray-600 border-2 border-gray-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-gray-600 border-2 border-gray-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleResetPassword}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-200 font-medium"
                          >
                            Update Password
                          </button>
                          <button
                            onClick={() => setShowResetForm(false)}
                            className="px-4 py-2 bg-gray-600 text-gray-300 rounded-xl hover:bg-gray-500 transition-all duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowResetForm(true)}
                        className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-200 font-medium"
                      >
                        <Lock className="w-5 h-5 mr-2" />
                        Reset Password
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-gray-400 font-medium">No password set</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Footer with Dark Theme */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 text-center hover:bg-gray-700 hover:border-blue-500/50 transition-all duration-300">
            <div className="text-3xl font-bold text-blue-400 mb-2">2.4k</div>
            <div className="text-gray-400 text-sm font-medium">Profile Views</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 text-center hover:bg-gray-700 hover:border-blue-500/50 transition-all duration-300">
            <div className="text-3xl font-bold text-blue-400 mb-2">98%</div>
            <div className="text-gray-400 text-sm font-medium">Profile Complete</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 text-center hover:bg-gray-700 hover:border-blue-500/50 transition-all duration-300">
            <div className="text-3xl font-bold text-blue-400 mb-2">5.0</div>
            <div className="text-gray-400 text-sm font-medium">Trust Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;