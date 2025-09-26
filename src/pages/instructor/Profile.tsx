import { useEffect, useState, type ChangeEvent } from 'react';
import {
  Edit,
  Camera,
  Mail,
  Globe,
  Save,
  Shield,
  Award,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { applyForInstructorVerification, getInstructorProfile, resetInstructorPassword, updateInstructorExpertise, updateInstructorProfile, updateInstructorProfileImage, updateInstructorResume } from '../../redux/services/instructorServices';
import { setInstructorImage, setInstructorName } from '../../redux/slices/instructorSlice';
import { toast } from 'react-toastify';
import { uploadImageToCloudinary, uploadPdfToCloudinary } from '../../config/cloudinary';
import { validateConfirmPassword, validatePassword } from '../../utils/validation';

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
  const [isVerified, setIsVerified] = useState<boolean>(true);
  const [profilePic, setProfilePic] = useState('');
  const [resume, setResume] = useState<string | null>(null);
  const [expertise, setExpertise] = useState<string[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [newSkill, setNewSkill] = useState('');


  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSkillEditable, setIsSKillEditable] = useState(false)
  const [isResumeEditable, setIsResumeEditable] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)

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
        setIsVerified(data.isVerified);
        setDesignation(data.designation);
        setJoiningDate(data.joiningDate);
      } catch (err) {
        console.error("Failed to fetch instructor:", err);
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

    const result = await dispatch(updateInstructorProfile(inputData)).unwrap();
    setIsEditing(false);
    dispatch(setInstructorName({ name: username }))
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
    const result = await dispatch(updateInstructorProfileImage({
      imageURL
    })).unwrap();
    dispatch(setInstructorImage({ profilePic: imageURL }));
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
    setIsChangingPassword(true);
    try {
      const response = await dispatch(resetInstructorPassword({ currentPassword, newPassword })).unwrap()
      setShowChangePassword(false)
      setCurrentPassword("")
      setNewPassword("");
      setConfirmPassword("");
      toast.success(response.message)

    } finally {
      setIsChangingPassword(false);
    }
  };



  const deleteSkill = async (index: number) => {
    const updatedExpertise = expertise.filter((_, i) => i !== index)
    await dispatch(updateInstructorExpertise({
      expertise: updatedExpertise
    })).unwrap();
    setExpertise(updatedExpertise)
  }

  const addSkill = async () => {
    if (!newSkill.trim() || expertise.includes(newSkill.trim())) {
      return
    }
    await dispatch(updateInstructorExpertise({
      expertise: [...expertise, newSkill.trim()]
    })).unwrap();

    setExpertise([...expertise, newSkill.trim()]);
    setNewSkill("");
  }


  const handleSaveResume = async () => {
    if (!resumeFile) return;

    const uploadedUrl = await uploadPdfToCloudinary(resumeFile);
    if (!uploadedUrl) {
      toast.error("Resume upload failed");
      return;
    }

    const result = await dispatch(
      updateInstructorResume({ resume: uploadedUrl })
    ).unwrap();

    setResume(uploadedUrl);
    setResumeFile(null); 
    setIsResumeEditable(false);

    toast.success(result.message || "Resume updated successfully");
  };

  const handleCancelResume = () => {
    setResumeFile(null); 
    setIsResumeEditable(false);
  };




  const applyForVerification = async () => {
    try {
      setIsApplying(true);
      const response=await dispatch(applyForInstructorVerification()).unwrap()
      toast.success(response.message);
      console.log("Applied for verification");
    } catch (err) {
      console.error("Failed to apply for verification:", err);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">Manage your profile information and account settings</p>
      </div>

      {/* Profile Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center overflow-hidden">
              <img src={profilePic || "/images/default-profile.jpg"} alt="Profile" className="w-full h-full object-cover" />

            </div>
            <label className="absolute bottom-2 right-2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-600 transition-colors">
              <Camera className="w-5 h-5 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{username || 'Loading...'}</h2>
                <p className="text-gray-600 mt-1">{designation}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    {rating || "No ratings"}
                  </span>

                  {isVerified ? (
                    <span className="flex items-center text-green-600 font-medium">
                      <Shield className="w-4 h-4 mr-1" />
                      Verified
                    </span>
                  ) : (
                    <button
                      onClick={applyForVerification}
                      disabled={isApplying}
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                    >
                      {isApplying ? "Applying..." : "Apply for Verification"}
                    </button>
                  )}
                </div>


              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>



      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: 'personal', label: 'Personal Info' },
          { id: 'settings', label: 'Account Settings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'personal' | 'settings')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab.id
              ? 'bg-teal-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  value={username || ''}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
                <input
                  onChange={(e) => setDesignation(e.target.value)}
                  type="text"
                  value={designation || ""}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email || ''}
                    disabled
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <div className="relative">
                  <Globe className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    onChange={(e) => setWebsite(e.target.value)}
                    type="url"
                    value={website || ''}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                onChange={(e) => setBio(e.target.value)}
                value={bio || ''}
                disabled={!isEditing}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 resize-none"
              />
            </div>
            {isEditing && (
              <div className="flex justify-end mt-6">
                <button onClick={handleSave} className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                  <Save className="w-4 h-4 mr-2" />
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
                <Edit className="w-5 h-5 text-gray-500" />
              </button>
            </div>


            {expertise.length ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-800 text-sm font-medium rounded-full"
                  >
                    {skill}
                    {isSkillEditable && (
                      <button
                        onClick={() => deleteSkill(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-4">No skills added</p>
            )}

            {isSkillEditable && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a new skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={addSkill}
                  className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Add
                </button>
              </div>
            )}

          </div>

          {/* Resume */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Resume</h3>
              <button
                onClick={() => setIsResumeEditable(!isResumeEditable)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <Edit className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {isResumeEditable ? (
              <div className="space-y-3">
                {/* <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            // TODO: Upload file to backend / cloud storage
            setResume(file.name); 
          }
        }}
        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
      /> */}

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setResumeFile(file);
                    }
                  }}
                />

                {resumeFile && (
                  <p className="text-sm text-gray-600">
                    Selected: {resumeFile.name} ({(resumeFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}


                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveResume()}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleCancelResume()}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : resume ? (
              <div className="flex items-center gap-4">
                <a
                  href={resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition"
                >
                  📄 View Resume
                </a>
                {/* <button
                  onClick={() => handleDeleteResume()}
                  className="px-3 py-2 text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button> */}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No resume uploaded</p>
            )}
          </div>




        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Security Settings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
            <div className="space-y-4">
              {hasPassword && (
                <>
                  <button
                    onClick={() => setShowChangePassword(!showChangePassword)}
                    className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Change Password</p>
                        <p className="text-sm text-gray-500">Update your account password</p>
                      </div>
                    </div>
                    <Edit className="w-5 h-5 text-gray-400" />
                  </button>

                  {showChangePassword && (
                    <form
                      className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={handleResetPassword}
                          disabled={isChangingPassword}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                        >
                          {isChangingPassword ? "Updating..." : "Update Password"}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>

          </div>


          {/* Account Info */}
          {joiningDate && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Info</h3>
              <p className="text-gray-600">Joined on: {new Date(joiningDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default InstructorProfile;
