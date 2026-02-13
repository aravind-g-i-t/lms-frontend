import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  AlertCircle,
  BookOpen,
  IndianRupee,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { toast } from 'react-toastify';
import { Pagination } from '../../components/shared/Pagination';
// import { SearchBar } from '../../components/shared/SearchBar';
import { getInstructorEarnings } from '../../services/instructorServices';





type EarningStatus = "pending" | "released" | "cancelled";

interface InstructorEarnings {
  id: string;
  instructorId: string;
  courseId: string;
  courseTitle: string;
  enrollmentId: string;
  learnerName: string;
  amount: number;
  createdAt: Date;
  releaseAt: Date;
  cancelledAt: Date | null;
  status: EarningStatus;
}

interface InstructorWallet {
  id: string;
  instructorId: string;
  pendingBalance: number;
  availableBalance: number;
}

const InstructorWalletPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<InstructorWallet | null>(null);

  const [earnings, setEarnings] = useState<InstructorEarnings[]>([]);

  // const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<EarningStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const response = await dispatch(getInstructorEarnings({
          page,
          limit: 4,
          status: selectedFilter === "all" ? undefined : selectedFilter,
          // search: searchQuery.trim() || undefined
        })).unwrap();
        setWallet(response.data.wallet);
        setEarnings(response.data.earnings);
        const pagination = response.data.pagination;
        setTotalPages(pagination.totalPages)

        setLoading(false)
      } catch (err) {
        toast.error(err as string);
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [dispatch, page, selectedFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // const formatDate = (date: Date) => {
  //   return new Intl.DateTimeFormat('en-IN', {
  //     month: 'short',
  //     day: 'numeric',
  //     year: 'numeric',
  //   }).format(date);
  // };

  const formatRelativeTime = (date: Date | string) => {
    const inputDate = date instanceof Date ? date : new Date(date);

    if (isNaN(inputDate.getTime())) return '';

    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - inputDate.getTime()) / 1000
    );

    const isPast = diffInSeconds > 0;
    const absDiff = Math.abs(diffInSeconds);

    if (absDiff < 60) return isPast ? 'Just now' : 'In a moment';
    if (absDiff < 3600) {
      const mins = Math.floor(absDiff / 60);
      return isPast ? `${mins}m ago` : `In ${mins}m`;
    }
    if (absDiff < 86400) {
      const hours = Math.floor(absDiff / 3600);
      return isPast ? `${hours}h ago` : `In ${hours}h`;
    }

    const days = Math.floor(absDiff / 86400);
    return isPast ? `${days}d ago` : `In ${days}d`;
  };


  const getStatusConfig = (status: EarningStatus) => {
    switch (status) {
      case "pending":
        return {
          label: 'Pending',
          className: 'bg-yellow-100 text-yellow-800',
          icon: Clock,
        };
      case "released":
        return {
          label: 'Released',
          className: 'bg-green-100 text-green-800',
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          label: 'Cancelled',
          className: 'bg-red-100 text-red-800',
          icon: XCircle,
        };
    }
  };

  // const filteredEarnings = selectedFilter === 'all'
  //   ? earnings.filter(earning =>
  //     earning.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     earning.learnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     earning.id.toLowerCase().includes(searchQuery.toLowerCase())
  //   )
  //   : earnings.filter(earning =>
  //     earning.status === selectedFilter &&
  //     (earning.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       earning.learnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       earning.id.toLowerCase().includes(searchQuery.toLowerCase()))
  //   );

  // const handleExport = () => {
  //   toast.info('Exporting earnings data...');
  //   // TODO: Implement export functionality
  // };

  // const handleRefresh = () => {
  //   toast.info('Refreshing wallet data...');
  //   // TODO: Implement refresh functionality
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Wallet data not available</p>
      </div>
    );
  }


  const totalBalance = wallet.availableBalance + wallet.pendingBalance;
  const earningsCount = {
    pending: earnings.filter(e => e.status === "pending").length,
    released: earnings.filter(e => e.status === "released").length,
    cancelled: earnings.filter(e => e.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wallet & Earnings</h1>
          <p className="text-gray-600 mt-1">Track your course earnings and balance</p>
        </div>
        {/* <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Export
          </button>
        </div> */}
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Wallet className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Balance</h3>
          <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
          <p className="text-sm opacity-75 mt-2">Available + Pending</p>
        </div>

        {/* Available Balance */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Available</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Available Balance</h3>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(wallet.availableBalance)}</p>
          <p className="text-sm text-green-600 mt-2 font-medium">{earningsCount.released} released earnings</p>
        </div>

        {/* Pending Balance */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">Pending</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Balance</h3>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(wallet.pendingBalance)}</p>
          <p className="text-sm text-yellow-600 mt-2 font-medium">{earningsCount.pending} pending earnings</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-blue-900 font-medium">About Your Earnings</p>
          <p className="text-sm text-blue-700 mt-1">
            Earnings from course enrollments are held in pending status for 30 days from the enrollment date.
            After 30 days, they are automatically released to your available balance. If a refund is requested
            within this period, the earning will be cancelled.
          </p>
        </div>
      </div>

      {/* Earnings Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h2 className="text-lg font-bold text-gray-900">Earnings History</h2>
            {/* <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <SearchBar
                value={searchQuery}
                placeholder="Search by course, learner, or ID..."
                onSearch={(query) => setSearchQuery(query)}
              />
            </div> */}
          </div>

          {/* Filter Tabs */}
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All' },
                { key: "pending", label: 'Pending' },
                { key: "released", label: 'Released' },
                { key: "cancelled", label: 'Cancelled' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedFilter(key as EarningStatus | 'all')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${selectedFilter === key
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {label}
                  {key !== 'all' && selectedFilter === key && (
                    <span className="ml-2 text-xs">
                      ({earningsCount[key as keyof typeof earningsCount]})
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Earnings List */}
        <div className="divide-y divide-gray-200">
          {earnings.length > 0 ? (
            earnings.map((earning) => {
              const statusConfig = getStatusConfig(earning.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={earning.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Icon */}
                      <div className="flex-shrink-0 p-3 bg-teal-100 rounded-lg">
                        <BookOpen className="w-6 h-6 text-teal-600" />
                      </div>

                      {/* Earning Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {earning.courseTitle}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center ${statusConfig.className}`}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Enrolled by <span className="font-medium">{earning.learnerName}</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Created {formatRelativeTime(earning.createdAt)}
                          </span>
                          {earning.status === "pending" && (
                            <span className="flex items-center text-yellow-600">
                              <Clock className="w-4 h-4 mr-1" />
                              Releases {formatRelativeTime(earning.releaseAt)}
                            </span>
                          )}
                          {earning.status === "released" && (
                            <span className="flex items-center text-green-600">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Released {formatRelativeTime(earning.releaseAt)}
                            </span>
                          )}
                          {earning.status === "cancelled" && earning.cancelledAt && (
                            <span className="flex items-center text-red-600">
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancelled {formatRelativeTime(earning.cancelledAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">ID: {earning.id}</p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-gray-900 flex items-center">
                        <IndianRupee className="w-5 h-5" />
                        {formatCurrency(earning.amount)}
                      </p>
                      {earning.status === "pending" && (
                        <p className="text-xs text-yellow-600 mt-1">In holding</p>
                      )}
                      {earning.status === "released" && (
                        <p className="text-xs text-green-600 mt-1">Added to balance</p>
                      )}
                      {earning.status === "cancelled" && (
                        <p className="text-xs text-red-600 mt-1">Refunded</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No earnings found</h3>
              <p className="text-gray-500">
                
                You don't have any earnings yet
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {earnings.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorWalletPage;