import { useState } from 'react';
import { 
  User, 
  BookOpen, 
  Users, 
  Award,
  Plus,
  Edit,
  Star,
  Camera,
  MapPin,
  Mail,
  Globe,
  Save,
  Shield,
  Eye,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

const InstructorProfile = () => {

  const {name,email,bio,website} =useSelector((state:RootState)=>state.instructor)

  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [username,setName]=useState(name);
  const [bioContent,setBio]=useState(bio);
  const [portfolio,setPortfolio]=useState(website)
  
  const profileData = {
    name: 'John Anderson',
    title: 'Senior Full-Stack Developer & Instructor',
    email: 'john.anderson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'www.johnanderson.dev',
    bio: 'Passionate educator with 8+ years of experience in web development. I specialize in React, Node.js, and modern JavaScript frameworks. My goal is to make complex programming concepts accessible and enjoyable for students of all levels.',
    experience: '8+ Years',
    studentsCount: 1250,
    coursesCreated: 15,
    rating: 4.9,
    totalEarnings: 45000
  };

  const achievements = [
    { title: 'Top Instructor', description: 'Rated in top 1% of instructors', icon: Award, color: 'text-yellow-600' },
    { title: 'Student Favorite', description: 'Over 1000 five-star reviews', icon: Star, color: 'text-purple-600' },
    { title: 'Course Creator', description: '15 published courses', icon: BookOpen, color: 'text-blue-600' },
    { title: 'Mentor', description: 'Guided 1200+ students', icon: Users, color: 'text-green-600' }
  ];

  const skills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL', 
    'AWS', 'Docker', 'Git', 'TypeScript', 'Express.js', 'Next.js'
  ];

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
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-teal-600" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{name|| 'Loading...'}</h2>
                <p className="text-gray-600 mt-1">{profileData.title}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {profileData.location}
                  </span>
                  <span className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    {profileData.rating} Rating
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {profileData.studentsCount} Students
                  </span>
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

        {/* Quick Stats */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{profileData.coursesCreated}</p>
            <p className="text-sm text-gray-600">Courses Created</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{profileData.studentsCount}</p>
            <p className="text-sm text-gray-600">Total Students</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{profileData.rating}</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">${profileData.totalEarnings.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Earnings</p>
          </div>
        </div> */}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: 'personal', label: 'Personal Info' },
          { id: 'achievements', label: 'Achievements' },
          { id: 'settings', label: 'Account Settings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
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
                <input onChange={(e)=>setName(e.target.value)}
                  type="text"
                  value={username||''}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
                <input
                  type="text"
                  value={profileData.title}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email||''}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={profileData.location}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <div className="relative">
                  <Globe className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input onChange={(e)=>setPortfolio(e.target.value)}
                    type="url"
                    value={portfolio || ''}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea onChange={(e)=>setBio(e.target.value)}
                value={bioContent || ''}
                disabled={!isEditing}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
              />
            </div>
            {isEditing && (
              <div className="flex justify-end mt-6">
                <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-800 text-sm font-medium rounded-full"
                >
                  {skill}
                  {isEditing && (
                    <button className="ml-2 text-teal-600 hover:text-teal-800">
                      ×
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <button className="inline-flex items-center px-3 py-1 border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-full hover:border-teal-300 hover:text-teal-600">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Skill
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-6">
          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gray-50 ${achievement.color}`}>
                    <achievement.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-gray-600 mt-1">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Teaching Statistics */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Teaching Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-gray-600 mt-1">Student Satisfaction</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">85%</div>
                <div className="text-sm text-gray-600 mt-1">Course Completion Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">24</div>
                <div className="text-sm text-gray-600 mt-1">Avg. Response Time (hrs)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications about new students and messages</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-teal-600 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Marketing Emails</p>
                  <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Profile Visibility</p>
                  <p className="text-sm text-gray-500">Allow students to view your full profile</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-teal-600 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
            <div className="space-y-4">
              <button className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>
                </div>
                <Edit className="w-5 h-5 text-gray-400" />
              </button>
              <button className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Privacy Settings</p>
                    <p className="text-sm text-gray-500">Manage your privacy preferences</p>
                  </div>
                </div>
                <Edit className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
            <div className="space-y-4">
              <button className="w-full px-4 py-3 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 transition-colors">
                Deactivate Account
              </button>
              <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstructorProfile;