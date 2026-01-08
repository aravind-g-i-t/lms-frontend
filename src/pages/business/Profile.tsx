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
import { applyForBusinessVerification, getBusinessProfile, resetBusinessPassword, updateBusinessLicense, updateBusinessProfile, updateBusinessProfileImage } from "../../services/businessServices";
import type { AppDispatch } from "../../redux/store";
import { toast } from "react-toastify";
import { getPresignedDownloadUrl, uploadImageToS3, uploadPdfToS3 } from "../../config/s3Config";
import * as yup from "yup";
import { setUserName, setUserProfilePic } from "../../redux/slices/authSlice";


const profileValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Business name is required")
    .min(2, "Business name must be at least 2 characters")
    .max(20, "Business name cannot exceed 20 characters")
    .matches(/^[A-Za-z\s]+$/, "Name can only contain alphabets and spaces")
    .trim(),
  businessDomain: yup
    .string()
    .required("Business domain is required")
    .min(2, "Business domain must be at least 2 characters")
    .max(20, "Business domain cannot exceed 20 characters")
    .trim(),
  website: yup
    .string()
    .url("Website must be a valid URL")
    .max(30, "Website cannot exceed 30 characters")
    .nullable()
    .transform((value) => value || null),
  location: yup
    .string()
    .required("Location is required")
    .min(2, "Location must be at least 2 characters")
    .max(30, "Location cannot exceed 30 characters")
    .trim(),
});


const passwordValidationSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required("Current password is required")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password cannot exceed 20 characters"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password cannot exceed 20 characters")
    .test("not-same", "New password must be different from current password", function(value) {
      return value !== this.parent.currentPassword;
    }),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});


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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);


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


  const validateForm = async (): Promise<boolean> => {
    try {
      const inputData = { name, businessDomain, website, location };
      await profileValidationSchema.validate(inputData, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };


  const validatePassword = async (): Promise<boolean> => {
    try {
      const passwordData = { currentPassword, newPassword, confirmPassword };
      await passwordValidationSchema.validate(passwordData, { abortEarly: false });
      setPasswordErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
        setPasswordErrors(errors);
      }
      return false;
    }
  };


  const handleSave = async () => {
    const isValid = await validateForm();
    if (!isValid) {
      toast.error("Please fix the validation errors before saving");
      return;
    }


    try {
      const inputData = { name, businessDomain, website, location };
      const result = await dispatch(updateBusinessProfile(inputData)).unwrap();
      setIsEditing(false);
      setValidationErrors({});
      dispatch(setUserName({ name }));
      toast.success(result.message)
    } catch (err) {
      toast.error(err as string)
    }
  };


  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;


      setImageLoading(true);


      const objectKey = await uploadImageToS3(file);
      if (!objectKey) return;


      const imageURL = await getPresignedDownloadUrl(objectKey);


      const result = await dispatch(updateBusinessProfileImage({ imageURL: objectKey })).unwrap();


      dispatch(setUserProfilePic({ profilePic: imageURL }));
      setProfilePic(imageURL);


      toast.success(result.message);
    } catch (err) {
      toast.error(err as string);
    } finally {
      setImageLoading(false);
    }
  };


  const handleResetPassword = async () => {
    const isValid = await validatePassword();
    if (!isValid) {
      return;
    }


    setIsChangingPassword(true);
    try {
      const response = await dispatch(resetBusinessPassword({ currentPassword, newPassword })).unwrap();
      setShowResetForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({});
      toast.success(response.message);
    } catch (error) {
      toast.error(error as string)
    } finally {
      setIsChangingPassword(false);
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


    try {
      const objectKey = await uploadPdfToS3(file);
      if (!objectKey) return;


      await dispatch(updateBusinessLicense({ license: objectKey })).unwrap();


      const pdfURL = await getPresignedDownloadUrl(objectKey);
      setLicense(pdfURL);


      toast.success("Business license uploaded successfully");
    } catch (error) {
      toast.error(error as string);
    }
  };




  const getVerificationBadge = () => {
    switch (verificationStatus) {
      case "Verified":
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full shadow-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Verified Business</span>
          </div>
        );
      case "Under Review":
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full shadow-lg">
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Profile</h1>
          <p className="text-gray-600 mt-2">Manage your business information and account settings</p>
        </div>


        {/* Verification Status Banner */}
        {verificationStatus === "Rejected" && verificationRemarks && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6 rounded-lg shadow-sm">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold text-lg mb-2">Verification Rejected</h3>
                <p className="text-red-700 mb-3">
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
        <div className="bg-gradient-to-br from-teal-600 via-teal-500 to-teal-600 rounded-2xl p-8 mb-8 shadow-lg text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>


          <div className="relative">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden border-4 border-white/30 shadow-lg">
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
                    <Camera className="w-5 h-5 text-teal-600" />
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
                  {isEditing ? (
                    <div>
                      <input 
                        maxLength={20} 
                        autoFocus 
                        className={`text-3xl font-bold mb-2 bg-teal-700 text-white px-3 py-2 rounded-lg ${validationErrors.name ? 'ring-2 ring-red-300' : ''}`} 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        type="text" 
                      />
                      {validationErrors.name && (
                        <p className="text-red-100 text-sm mt-1">{validationErrors.name}</p>
                      )}
                    </div>


                  ) : (
                    <h2 className="text-3xl font-bold mb-2">{name || 'Business Name'}</h2>


                  )
                  }
                  <p className="text-teal-100 text-lg mb-3">{businessDomain || 'Business Domain'}</p>
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
                    className="px-6 py-3 bg-white text-teal-600 rounded-lg hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 font-semibold shadow-lg flex items-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    {isApplying ? "Applying..." : "Apply for Verification"}
                  </button>
                )}


                {isEditing ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-white text-teal-600 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold shadow-lg flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setValidationErrors({});
                      }}
                      className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg hover:bg-white/30 transition-all duration-200 font-semibold flex items-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg hover:bg-white/30 transition-all duration-200 font-semibold flex items-center gap-2"
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
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Business Information</h3>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Domain */}
            {isEditing && (
              <div className="group">
                <div className={`bg-gray-50 rounded-lg p-6 border-2 ${validationErrors.businessDomain ? 'border-red-500' : 'border-gray-200'} hover:border-teal-500/50 transition-all duration-300`}>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <Building2 className="w-4 h-4 mr-2 text-teal-600" />
                    Business Domain
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={businessDomain || ""}
                    onChange={(e) => setBusinessDomain(e.target.value)}
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  />
                  {validationErrors.businessDomain && (
                    <p className="text-red-600 text-sm mt-2">{validationErrors.businessDomain}</p>
                  )}
                </div>
              </div>
            )}


            {/* Email */}
            <div className="group">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-teal-500/50 transition-all duration-300">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Mail className="w-4 h-4 mr-2 text-teal-600" />
                  Email Address
                </label>
                <p className="text-gray-900 font-medium text-lg break-all">{email || "Not provided"}</p>
              </div>
            </div>


            {/* Website */}
            <div className="group">
              <div className={`bg-gray-50 rounded-lg p-6 border-2 ${isEditing && validationErrors.website ? 'border-red-500' : 'border-gray-200'} hover:border-teal-500/50 transition-all duration-300`}>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Globe className="w-4 h-4 mr-2 text-teal-600" />
                  Website
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="url"
                      maxLength={30}
                      value={website || ""}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    />
                    {validationErrors.website && (
                      <p className="text-red-600 text-sm mt-2">{validationErrors.website}</p>
                    )}
                  </div>
                ) : (
                  <a
                    href={website || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-700 font-medium text-lg hover:underline transition-colors"
                  >
                    {website || "Not provided"}
                  </a>
                )}
              </div>
            </div>


            {/* Location */}
            <div className="group">
              <div className={`bg-gray-50 rounded-lg p-6 border-2 ${isEditing && validationErrors.location ? 'border-red-500' : 'border-gray-200'} hover:border-teal-500/50 transition-all duration-300`}>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <MapPin className="w-4 h-4 mr-2 text-teal-600" />
                  Location
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      maxLength={30}
                      value={location || ""}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    />
                    {validationErrors.location && (
                      <p className="text-red-600 text-sm mt-2">{validationErrors.location}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium text-lg">{location || "Not provided"}</p>
                )}
              </div>
            </div>


            {/* Business License */}
            <div className="group">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-teal-500/50 transition-all duration-300">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Shield className="w-4 h-4 mr-2 text-teal-600" />
                  Business License (PDF)
                </label>


                {license ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowLicenseModal(true)}
                      className="text-teal-600 hover:underline font-medium"
                    >
                      View License
                    </button>


                    <label className="px-3 py-1 bg-teal-600 text-white rounded-lg cursor-pointer hover:bg-teal-700 transition-colors font-medium">
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
                  <label className="px-4 py-2 bg-teal-600 text-white rounded-lg cursor-pointer hover:bg-teal-700 transition-colors font-medium inline-block">
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
                  width: "80%",
                  height: "80%",
                  maxWidth: "900px",
                  maxHeight: "90vh",
                  padding: "1rem",
                  borderRadius: "1rem",
                  backgroundColor: "#f9fafb"
                },
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.7)"
                }
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-gray-900 font-bold text-xl">Business License</h2>
                <button
                  onClick={() => setShowLicenseModal(false)}
                  className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
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
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-teal-500/50 transition-all duration-300">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Calendar className="w-4 h-4 mr-2 text-teal-600" />
                  Member Since
                </label>
                <p className="text-gray-900 font-medium text-lg">
                  {joiningDate ? new Date(joiningDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Not available"}
                </p>
              </div>
            </div>


            {/* Security */}
            <div className="group">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-teal-500/50 transition-all duration-300">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Shield className="w-4 h-4 mr-2 text-teal-600" />
                  Security
                </label>
                {hasPassword ? (
                  <>
                    {showResetForm ? (
                      <div className="space-y-3">
                        <div>
                          <div className="relative">
                            <input
                              type="password"
                              maxLength={20}
                              placeholder="Current Password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className={`w-full bg-white border-2 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${passwordErrors.currentPassword ? 'border-red-500 pr-10' : 'border-gray-300'}`}
                            />
                            {passwordErrors.currentPassword && (
                              <AlertCircle className="w-5 h-5 text-red-500 absolute right-3 top-3" />
                            )}
                          </div>
                          {passwordErrors.currentPassword && (
                            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {passwordErrors.currentPassword}
                            </p>
                          )}
                        </div>
                        <div>
                          <div className="relative">
                            <input
                              type="password"
                              maxLength={20}
                              placeholder="New Password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className={`w-full bg-white border-2 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${passwordErrors.newPassword ? 'border-red-500 pr-10' : 'border-gray-300'}`}
                            />
                            {passwordErrors.newPassword && (
                              <AlertCircle className="w-5 h-5 text-red-500 absolute right-3 top-3" />
                            )}
                          </div>
                          {passwordErrors.newPassword && (
                            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {passwordErrors.newPassword}
                            </p>
                          )}
                        </div>
                        <div>
                          <div className="relative">
                            <input
                              type="password"
                              maxLength={20}
                              placeholder="Confirm Password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className={`w-full bg-white border-2 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${passwordErrors.confirmPassword ? 'border-red-500 pr-10' : 'border-gray-300'}`}
                            />
                            {passwordErrors.confirmPassword && (
                              <AlertCircle className="w-5 h-5 text-red-500 absolute right-3 top-3" />
                            )}
                          </div>
                          {passwordErrors.confirmPassword && (
                            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {passwordErrors.confirmPassword}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={handleResetPassword}
                            disabled={isChangingPassword}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 font-semibold transition-colors"
                          >
                            {isChangingPassword ? "Updating..." : "Reset"}
                          </button>
                          <button
                            onClick={() => {
                              setShowResetForm(false);
                              setCurrentPassword("");
                              setNewPassword("");
                              setConfirmPassword("");
                              setPasswordErrors({});
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setShowResetForm(true)} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition-colors flex items-center gap-2">
                        <Lock className="w-4 h-4" /> Reset Password
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-gray-900 font-medium text-lg">Password not set</p>
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
