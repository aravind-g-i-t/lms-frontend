import { useState, type JSX } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BookOpen, Award, Wallet, History, Settings, Heart } from 'lucide-react';
import type { RootState } from '../../redux/store';
import LearnerNav from '../../components/learner/LearnerNav';
import { lazy, Suspense } from 'react';
import DashboardContentSkeleton from '../../components/learner/DashboardSkeleton';

const MyCourses = lazy(() => import('../../components/learner/Courses'));
const Certificates = lazy(() => import('../../components/learner/Certificates'));
const MyWallet = lazy(() => import('../../components/learner/Wallet'));
const PurchaseHistory = lazy(() => import('../../components/learner/PurchaseHistory'));
const MyFavourites = lazy(() => import('../../components/learner/Favourites'));

const TAB_COMPONENTS: Record<TabType, JSX.Element> = {
  courses: <MyCourses />,
  favourites: <MyFavourites />,
  certificates: <Certificates />,
  wallet: <MyWallet />,
  history: <PurchaseHistory />,
};

type TabType = 'courses'|"favourites" | 'certificates' | 'wallet' | 'history';

const LearnerDashboard = () => {
  const { name } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<TabType>('courses');

  const sidebarItems = [
    { id: 'courses' as TabType, label: 'My Courses', icon: BookOpen },
    { id: 'favourites' as TabType, label: 'My Favourites', icon: Heart },
    { id: 'certificates' as TabType, label: 'Certificates', icon: Award },
    { id: 'wallet' as TabType, label: 'Wallet', icon: Wallet },
    { id: 'history' as TabType, label: 'Purchase History', icon: History },
  ];

  // const renderContent = () => {
  //   switch (activeTab) {
  //     case 'courses':
  //       return <MyCourses />;
  //     case 'favourites':
  //       return <MyFavourites />;
  //     case 'certificates':
  //       return <Certificates />;
  //     case 'wallet':
  //       return <MyWallet />;
  //     case 'history':
  //       return <PurchaseHistory />;
  //     default:
  //       return <MyCourses />;
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      <LearnerNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {name || 'Learner'}!
          </h1>
          <p className="text-gray-600 mt-1">Track your learning progress and achievements</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm p-4 sticky top-6">
              <ul className="space-y-1">
                {sidebarItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link
                  to="/learner/settings"
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </Link>
              </div>
            </nav>
          </aside>

          <main className="flex-1">
            <Suspense fallback={<DashboardContentSkeleton />}>

            {TAB_COMPONENTS[activeTab]}
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LearnerDashboard;
