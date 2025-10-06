import { useEffect, useState, type ChangeEvent } from 'react';
import {
  Edit,
  Camera,
  Mail,
  Globe,
  Save,
  Shield,
  Award,
  ShieldOff,
  AlertCircle,
  Clock,
  CheckCircle,
  X,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { applyForInstructorVerification, getInstructorProfile, resetInstructorPassword, updateInstructorExpertise, updateInstructorIDProof, updateInstructorProfile, updateInstructorProfileImage, updateInstructorResume } from '../../redux/services/instructorServices';
import { setInstructorImage, setInstructorName } from '../../redux/slices/instructorSlice';
import { toast } from 'react-toastify';
import { uploadImageToCloudinary, uploadPdfToCloudinary } from '../../config/cloudinary';
import { validateConfirmPassword, validatePassword } from '../../utils/validation';
import ReactModal from 'react-modal';

const InstructorProfile = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [activeTab, setActiveTab] = useState<'personal' | 'settings'>('personal');
  const [isEditing, setIsEditing] = useState(false);

  // Profile state
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [joiningDate, setJoiningDate] = useState<string | null>(null);
  const [hasPassword, setHasPassword] = useState<boolean>(false);
  const [designation, setDesignation] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [resume, setResume] = useState<string | null>(null);
  const [expertise, setExpertise] = useState<string[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [verificationStatus, setVerificationStatus] = useState("");
  const [verificationRemarks, setVerificationRemarks] = useState<string | null>(null)
  const [identityProof, setIdentityProof] = useState<string | null>(null)
  const [idProofModal, setIdProofModal] = useState(false)

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSkillEditable, setIsSKillEditable] = useState(false)
  const [isResumeEditable, setIsResumeEditable] = useState(false)
  const [isIdentityEditable, setIsIdentityEditable] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const [identityProofFile, setIdentityProofFile] = useState<File | null>(null)
  const [imageLoading, setImageLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await dispatch(getInstructorProfile()).unwrap();
        const data = response.instructor;

        setName(data.name);
        setEmail(data.email);
        setProfilePic(data.profilePic);
        setBio(data.bio);
        setRating(data.rating);
        setWebsite(data.website);
        setResume(data.resume);
        setHasPassword(data.hasPassword);
        setExpertise(data.expertise);
        setDesignation(data.designation);
        setJoiningDate(data.joiningDate);
        setVerificationStatus(data.verification.status);
        setVerificationRemarks(data.verification.remarks)
        setIdentityProof(data.identityProof)
      } catch (err) {
        console.error("Failed to fetch instructor:", err);
        toast.error(err as string)
      }
    };

    fetchProfile();
  }, [dispatch]);





  const handleSave = async () => {

    const inputData = {
      name: username.trim(),
      designation,
      website,
      bio
    };

    try {
      const result = await dispatch(updateInstructorProfile(inputData)).unwrap();
      setIsEditing(false);
      dispatch(setInstructorName({ name: username }))
      toast.success(result.message);
    } catch (error) {
      toast.error(error as string)
    }
  };




  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) {
        return
      }
      setImageLoading(true)
      const imageURL = await uploadImageToCloudinary(file);
      if (!imageURL) {
        return
      }
      const result = await dispatch(updateInstructorProfileImage({
        imageURL
      })).unwrap();
      dispatch(setInstructorImage({ profilePic: imageURL }));
      setProfilePic(imageURL);
      toast.success(result.message)
    } catch (err) {
      toast.error(err as string)
    } finally {
      setImageLoading(false)
    }
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
    setIsChangingPassword(true);
    try {
      const response = await dispatch(resetInstructorPassword({ currentPassword, newPassword })).unwrap()
      setShowChangePassword(false)
      setCurrentPassword("")
      setNewPassword("");
      setConfirmPassword("");
      toast.success(response.message)

    } catch (err) {
      toast.error(err as string)
    } finally {
      setIsChangingPassword(false);
    }
  };



  const deleteSkill = async (index: number) => {
    try {
      const updatedExpertise = expertise.filter((_, i) => i !== index)
      await dispatch(updateInstructorExpertise({
        expertise: updatedExpertise
      })).unwrap();
      setExpertise(updatedExpertise)
    } catch (error) {
      toast.error(error as string)
    }
  }

  const addSkill = async () => {
    if (!newSkill.trim() || expertise.includes(newSkill.trim())) {
      return
    }
    try {
      await dispatch(updateInstructorExpertise({
        expertise: [...expertise, newSkill.trim()]
      })).unwrap();

      setExpertise([...expertise, newSkill.trim()]);
      setNewSkill("");
    } catch (error) {
      toast.error(error as string)
    }
  }


  const handleSaveResume = async () => {
    if (!resumeFile) return;

    const uploadedUrl = await uploadPdfToCloudinary(resumeFile);
    if (!uploadedUrl) {
      toast.error("Resume upload failed");
      return;
    }

    try {
      const result = await dispatch(
        updateInstructorResume({ resume: uploadedUrl })
      ).unwrap();

      setResume(uploadedUrl);
      setResumeFile(null);
      setIsResumeEditable(false);

      toast.success(result.message || "Resume updated successfully");
    } catch (error) {
      toast.error(error as string)
    }
  };

  const handleCancelResume = () => {
    setResumeFile(null);
    setIsResumeEditable(false);
  };

  const handleSaveIdentityProof = async () => {
    if (!identityProofFile) return;

    const uploadedUrl = await uploadImageToCloudinary(identityProofFile);
    if (!uploadedUrl) {
      toast.error("Identity proof upload failed");
      return;
    }

    try {
      const result = await dispatch(
        updateInstructorIDProof({ identityProof: uploadedUrl })
      ).unwrap();

      setIdentityProof(uploadedUrl);
      setIdentityProofFile(null);
      setIsIdentityEditable(false);

      toast.success(result.message || "Identity proof updated successfully");
    } catch (error) {
      toast.error(error as string)
    }
  }

  const handleCancelIdentityProof = () => {
    setIdentityProofFile(null);
    setIsIdentityEditable(false)
  }



  const applyForVerification = async () => {
    try {
      setIsApplying(true);
      const response = await dispatch(applyForInstructorVerification()).unwrap()
      toast.success(response.message);
      setVerificationStatus("Under Review")
      console.log("Applied for verification");
    } catch (err) {
      console.error("Failed to apply for verification:", err);
      toast.error(err as string)
    } finally {
      setIsApplying(false);
    }
  };

  const getVerificationBadge = () => {
    switch (verificationStatus) {
      case "Verified":
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Verified Instructor</span>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-full border-2 border-dashed border-gray-400">
            <ShieldOff className="w-5 h-5" />
            <span className="font-semibold">Not Verified</span>
          </div>
        );
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Instructor Profile</h1>
          <p className="text-gray-600 mt-2">Manage your profile information and account settings</p>
        </div>



        {/* Profile Header */}

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

        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl p-8 mb-8 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center overflow-hidden border-4 border-white/30 shadow-xl">
                    {imageLoading ? (
                      // Spinner loader
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/30 border-t-white"></div>
                    ) : (
                      <img
                        src={profilePic || "/images/default-profile.jpg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
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

                {/* Profile Info */}
                <div>
                  <h2 className="text-3xl font-bold mb-2">{username || 'Loading...'}</h2>
                  <p className="text-teal-100 text-lg mb-3">{designation}</p>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Award className="w-4 h-4" />
                      <span className="font-semibold">{rating || "No ratings"}</span>
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
                    className="px-6 py-3 bg-white text-teal-600 rounded-xl hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 font-semibold shadow-lg flex items-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    {isApplying ? "Applying..." : "Apply for Verification"}
                  </button>
                )}

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl hover:bg-white/30 transition-all duration-200 font-semibold flex items-center gap-2"
                >
                  <Edit className="w-5 h-5 " />
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>



        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
          {[
            { id: 'personal', label: 'Personal Info' },
            { id: 'settings', label: 'Account Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'personal' | 'settings')}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    value={username || ''}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Title</label>
                  <input
                    onChange={(e) => setDesignation(e.target.value)}
                    type="text"
                    value={designation || ""}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email || ''}
                      disabled
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                  <div className="relative">
                    <Globe className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      onChange={(e) => setWebsite(e.target.value)}
                      type="url"
                      value={website || ''}
                      disabled={!isEditing}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                <textarea
                  onChange={(e) => setBio(e.target.value)}
                  value={bio || ''}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none transition-all"
                />
              </div>
              {isEditing && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-lg transition-all font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Skills & Expertise</h3>
                <button
                  onClick={() => setIsSKillEditable(!isSkillEditable)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <Edit className="w-5 h-5 text-teal-600" />
                </button>
              </div>


              {expertise.length ? (
                <div className="flex flex-wrap gap-3 mb-6">
                  {expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 text-sm font-semibold rounded-full border-2 border-teal-200"
                    >
                      {skill}
                      {isSkillEditable && (
                        <button
                          onClick={() => deleteSkill(index)}
                          className="ml-1 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className='w-4 h-4' />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm mb-4">No skills added</p>
              )}

              {isSkillEditable && (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Add a new skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                  <button
                    onClick={addSkill}
                    className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-semibold shadow-lg transition-all"
                  >
                    Add
                  </button>
                </div>
              )}

            </div>



            {/* Resume Section */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Resume</h3>
                <button
                  onClick={() => setIsResumeEditable(!isResumeEditable)}
                  className="p-2 rounded-xl hover:bg-teal-50 transition-colors"
                >
                  <Edit className="w-5 h-5 text-teal-600" />
                </button>
              </div>

              {isResumeEditable ? (
                <div className="space-y-3">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setResumeFile(file);
                    }}
                    className="block w-full text-sm text-gray-700 border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-all"
                  />

                  {resumeFile && (
                    <p className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                      Selected: {resumeFile.name} ({(resumeFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveResume}
                      className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-semibold shadow-lg transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelResume}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : resume ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowResumeModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 shadow-lg transition-all"
                  >
                    📄 View Resume
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 ">No resume uploaded</p>
              )}
            </div>

            {/* Resume Modal */}
            <ReactModal
              isOpen={showResumeModal}
              onRequestClose={() => setShowResumeModal(false)}
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
                  backgroundColor: "#1f2937"
                },
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.7)"
                }
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-bold text-xl">Business License</h2>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="text-white hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <iframe
                src={resume || ""}
                width="100%"
                height="100%"
                className="rounded-lg"
              />
            </ReactModal>


            {/* Identity Proof */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Identity Proof</h3>
                <button
                  onClick={() => setIsIdentityEditable(!isIdentityEditable)}
                  className="p-2 rounded-xl hover:bg-teal-50 transition-colors"
                >
                  <Edit className="w-5 h-5 text-teal-600" />
                </button>
              </div>

              {isIdentityEditable ? (
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setIdentityProofFile(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-700 border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-all"
                  />

                  {identityProofFile && (
                    <p className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                      Selected: {identityProofFile.name} ({(identityProofFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveIdentityProof()}
                      className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-semibold shadow-lg transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleCancelIdentityProof()}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : identityProof ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIdProofModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 shadow-lg transition-all"
                  >
                    🪪 View Identity Proof
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">No identity proof uploaded</p>
              )}
            </div>

          </div>
        )}

        <ReactModal
          isOpen={idProofModal}
          onRequestClose={() => setIdProofModal(false)}
          className="bg-white rounded-2xl shadow-lg max-w-3xl w-full mx-auto p-6 outline-none relative"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
          ariaHideApp={false}
        >
          <button
            onClick={() => setIdProofModal(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-xl font-semibold mb-4">Government ID Proof</h2>

          {identityProof?.endsWith(".pdf") ? (
            <iframe
              src={identityProof}
              className="w-full h-[500px] rounded-lg border"
              title="ID Proof PDF"
            />
          ) : (
            <img
              src={identityProof || ""}
              alt="Government ID Proof"
              className="max-h-[500px] mx-auto rounded-lg border"
            />
          )}
        </ReactModal>

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Security Settings */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Security</h3>
              <div className="space-y-4">
                {hasPassword && (
                  <>
                    <button
                      onClick={() => setShowChangePassword(!showChangePassword)}
                      className="flex items-center justify-between w-full p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all border border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-teal-100 rounded-xl">
                          <Shield className="w-6 h-6 text-teal-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 text-lg">Change Password</p>
                          <p className="text-sm text-gray-600">Update your account password</p>
                        </div>
                      </div>
                      <Edit className="w-5 h-5 text-teal-600" />
                    </button>

                    {showChangePassword && (
                      <div className="mt-4 space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={handleResetPassword}
                            disabled={isChangingPassword}
                            className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 font-semibold shadow-lg transition-all"
                          >
                            {isChangingPassword ? "Updating..." : "Update Password"}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

            </div>


            {/* Account Info */}
            {joiningDate && (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Account Information</h3>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="font-semibold">Member since:</span>
                  <span className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg font-medium">
                    {new Date(joiningDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </>
  );
};

export default InstructorProfile;
