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
  Camera,
  ShieldOff,
  AlertCircle,
  CheckCircle,
  Clock,
  Star
} from "lucide-react";
import ReactModal from "react-modal"
import { useEffect, useState, type ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { applyForBusinessVerification, getBusinessProfile, resetBusinessPassword, updateBusinessLicense, updateBusinessProfile, updateBusinessProfileImage } from "../../redux/services/businessServices";
import type { AppDispatch } from "../../redux/store";
import { toast } from "react-toastify";
import { setBusinessImage, setBusinessName } from "../../redux/slices/businessSlice";
import { uploadImageToCloudinary, uploadPdfToCloudinary } from "../../config/cloudinary";
import { validateConfirmPassword, validatePassword } from "../../utils/validation";

const BusinessProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState<string | null>(null);
  const [hasPassword, setHasPassword] = useState(true);
  const [joiningDate, setJoiningDate] = useState("");
  const [businessDomain, setBusinessDomain] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [verificationRemarks, setVerificationRemarks] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [imageLoading, setImageLoading] = useState(false)
  const [showResetForm, setShowResetForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [license, setLicense] = useState<string | null>(null);
  const [showLicenseModal, setShowLicenseModal] = useState(false);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await dispatch(getBusinessProfile()).unwrap();
        const data = response.business;
        console.log(data);


        setName(data.name);
        setEmail(data.email);
        setProfilePic(data.profilePic);
        setBusinessDomain(data.businessDomain);
        setLocation(data.location);
        setWebsite(data.website);
        setHasPassword(data.hasPassword);
        setJoiningDate(data.joiningDate);
        setVerificationStatus(data.verification?.status || "Not Submitted");
        setVerificationRemarks(data.verification?.remarks || null);
        setLicense(data.license);
      } catch (err) {
        console.error("Failed to fetch business profile:", err);
        toast.error(err as string)
      }
    };

    fetchProfile();
  }, [dispatch]);

  const handleSave = async () => {
    try {
      const inputData = { name, businessDomain, website, location };
      const result = await dispatch(updateBusinessProfile(inputData)).unwrap();
      setIsEditing(false);
      dispatch(setBusinessName({ name }));
      toast.success(result.message)
    } catch (err) {
      toast.error(err as string)
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setImageLoading(true)
      const imageURL = await uploadImageToCloudinary(file);
      if (!imageURL) return;
      const result = await dispatch(updateBusinessProfileImage({ imageURL })).unwrap();
      dispatch(setBusinessImage({ profilePic: imageURL }));
      setProfilePic(imageURL);
      toast.success(result.message);
    } catch (err) {
      toast.error(err as string)
    } finally {
      setImageLoading(false)
    }
  };

  const handleResetPassword = async () => {
    let errorMsg = validatePassword(currentPassword);
    if (errorMsg) { toast.error(errorMsg); return; }
    errorMsg = validatePassword(newPassword);
    if (errorMsg) { toast.error(errorMsg); return; }
    errorMsg = validateConfirmPassword(confirmPassword, newPassword);
    if (errorMsg) { toast.error(errorMsg); return; }

    try {
      const response = await dispatch(resetBusinessPassword({ currentPassword, newPassword })).unwrap();
      setShowResetForm(false);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      toast.success(response.message);
    } catch (error) {
      toast.error(error as string)
    }
  };

  const applyForVerification = async () => {
    try {
      setIsApplying(true);
      const response = await dispatch(applyForBusinessVerification()).unwrap();
      console.log(response);

      toast.success(response.message);
      setVerificationStatus("Under Review");
    } catch (err) {
      console.error("Failed to apply for verification:", err);
      toast.error(err as string)
    } finally {
      setIsApplying(false);
    }
  };


  const handleLicenseUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file");
      return;
    }

    const pdfURL = await uploadPdfToCloudinary(file);
    if (!pdfURL) return;

    try {
      await dispatch(updateBusinessLicense({ license: pdfURL })).unwrap();
      setLicense(pdfURL);
      toast.success("Business license uploaded successfully");
    } catch (error) {
      toast.error(error as string)
    }
  };


  const getVerificationBadge = () => {
    switch (verificationStatus) {
      case "Verified":
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Verified Business</span>
          </div>
        );
      case "Under Review":
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full shadow-lg">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Under Review</span>
          </div>
        );
      case "Rejected":
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Verification Rejected</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-full border-2 border-dashed border-gray-600">
            <ShieldOff className="w-5 h-5" />
            <span className="font-semibold">Not Verified</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Business Profile</h1>
          <p className="text-gray-400 mt-2">Manage your business information and account settings</p>
        </div>

        {/* Verification Status Banner */}
        {verificationStatus === "Rejected" && verificationRemarks && (
          <div className="bg-red-900/30 border-l-4 border-red-500 p-6 mb-6 rounded-lg shadow-sm backdrop-blur-sm">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-300 font-semibold text-lg mb-2">Verification Rejected</h3>
                <p className="text-red-200 mb-3">
                  <strong>Reason:</strong> {verificationRemarks}
                </p>
                <button
                  onClick={applyForVerification}
                  disabled={isApplying}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {isApplying ? "Reapplying..." : "Reapply for Verification"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 rounded-3xl p-8 mb-8 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute  right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

          <div className="relative ">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center overflow-hidden border-4 border-white/30 shadow-xl">
                    {imageLoading ? (
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                    ) : profilePic ? (
                      <img
                        src={profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-12 h-12 text-white" />
                    )}
                  </div>

                  <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors shadow-lg">
                    <Camera className="w-5 h-5 text-blue-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Business Info */}
                <div>
                  {isEditing?(
                    <input maxLength={20} autoFocus className="text-3xl font-bold mb-2" value={name} onChange={(e)=>setName(e.target.value )} type="text" />

                  ):(
                    <h2 className="text-3xl font-bold mb-2">{name || 'Business Name'}</h2>

                  )
                  }
                  <p className="text-blue-100 text-lg mb-3">{businessDomain || 'Business Domain'}</p>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Star className="w-4 h-4" />
                      <span className="font-semibold">5.0</span>
                    </span>
                    {getVerificationBadge()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {verificationStatus === "Not Submitted" && (
                  <button
                    onClick={applyForVerification}
                    disabled={isApplying}
                    className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 font-semibold shadow-lg flex items-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    {isApplying ? "Applying..." : "Apply for Verification"}
                  </button>
                )}

                {isEditing ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold shadow-lg flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl hover:bg-white/30 transition-all duration-200 font-semibold flex items-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl hover:bg-white/30 transition-all duration-200 font-semibold flex items-center gap-2"
                  >
                    <Edit className="w-5 h-5" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-3xl shadow-2xl p-8 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">Business Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Domain */}
            {isEditing && (
              <div className="group">
                <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600 hover:bg-gray-600 hover:border-blue-500/50 transition-all duration-300">
                  <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
                    <Building2 className="w-4 h-4 mr-2 text-blue-400" />
                    Business Domain
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={businessDomain || ""}
                    onChange={(e) => setBusinessDomain(e.target.value)}
                    className="w-full bg-gray-600 border-2 border-gray-500 rounded-xl px-4 py-3 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="group">
              <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600 hover:bg-gray-600 hover:border-blue-500/50 transition-all duration-300">
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
                  <Mail className="w-4 h-4 mr-2 text-blue-400" />
                  Email Address
                </label>
                <p className="text-white font-medium text-lg break-all">{email || "Not provided"}</p>
              </div>
            </div>

            {/* Website */}
            <div className="group">
              <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600 hover:bg-gray-600 hover:border-blue-500/50 transition-all duration-300">
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
                  <Globe className="w-4 h-4 mr-2 text-blue-400" />
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    maxLength={30}
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

            {/* Location */}
            <div className="group">
              <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600 hover:bg-gray-600 hover:border-blue-500/50 transition-all duration-300">
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
                  <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    maxLength={30}
                    value={location || ""}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-gray-600 border-2 border-gray-500 rounded-xl px-4 py-3 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                ) : (
                  <p className="text-white font-medium text-lg">{location || "Not provided"}</p>
                )}
              </div>
            </div>

            {/* Business License */}
            <div className="group">
              <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600 hover:bg-gray-600 hover:border-blue-500/50 transition-all duration-300">
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
                  <Shield className="w-4 h-4 mr-2 text-blue-400" />
                  Business License (PDF)
                </label>

                {license ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowLicenseModal(true)}
                      className="text-blue-400 hover:underline font-medium"
                    >
                      View License
                    </button>

                    <label className="px-3 py-1 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                      Replace
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleLicenseUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                    Upload License
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleLicenseUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <ReactModal
              isOpen={showLicenseModal}
              onRequestClose={() => setShowLicenseModal(false)}
              style={{
                content: {
                  zIndex: 50,
                  top: "50%",
                  left: "50%",
                  right: "auto",
                  bottom: "auto",
                  marginRight: "-50%",
                  transform: "translate(-50%, -50%)",
                  width: "80%",       // adjust width
                  height: "80%",      // adjust height
                  maxWidth: "900px",  // optional max width
                  maxHeight: "90vh",  // optional max height
                  padding: "1rem",
                  borderRadius: "1rem",
                  backgroundColor: "#1f2937" // match your theme
                },
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.7)"
                }
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-bold text-xl">Business License</h2>
                <button
                  onClick={() => setShowLicenseModal(false)}
                  className="text-white hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <iframe
                src={license || ""}
                width="100%"
                height="100%"
                className="rounded-lg"
              />
            </ReactModal>




            {/* Joining Date */}
            <div className="group">
              <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600 hover:bg-gray-600 hover:border-blue-500/50 transition-all duration-300">
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-3">
                  <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                  Member Since
                </label>
                <p className="text-white font-medium text-lg">
                  {joiningDate ? new Date(joiningDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Not available"}
                </p>
              </div>
            </div>

            {/* Security */}
            <div className="group">
              <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600 hover:bg-gray-600 hover:border-blue-500/50 transition-all duration-300">
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
                          maxLength={20}
                          placeholder="Current Password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-gray-600 border-2 border-gray-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <input
                          type="password"
                          maxLength={20}
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-gray-600 border-2 border-gray-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <input
                          type="password"
                          maxLength={20}
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-gray-600 border-2 border-gray-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <div className="flex gap-3">
                          <button onClick={handleResetPassword} className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold transition-colors">Reset</button>
                          <button onClick={() => setShowResetForm(false)} className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 font-semibold transition-colors">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setShowResetForm(true)} className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center gap-2">
                        <Lock className="w-4 h-4" /> Reset Password
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-white font-medium text-lg">Password not set</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
