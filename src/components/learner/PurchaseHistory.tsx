import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { History, Receipt, Download, Eye, Calendar, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import type { AppDispatch } from '../../redux/store';
// import { getPurchaseHistory } from '../../../redux/services/learnerServices';

type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';

interface Purchase {
  id: string;
  orderId: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail: string | null;
  instructor: string;
  amount: number;
  discount: number;
  finalAmount: number;
  paymentMethod: string;
  status: PaymentStatus;
  purchasedAt: Date;
  invoiceUrl: string | null;
}

const PurchaseHistory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        // const response = await dispatch(getPurchaseHistory()).unwrap();
        // setPurchases(response.data);
        
        // Mock data
        setPurchases([
          {
            id: 'p1',
            orderId: 'ORD-2025-001234',
            courseId: 'c1',
            courseTitle: 'Complete React Development Masterclass 2025',
            courseThumbnail: null,
            instructor: 'John Doe',
            amount: 999,
            discount: 200,
            finalAmount: 799,
            paymentMethod: 'UPI',
            status: 'completed',
            purchasedAt: new Date('2025-01-08'),
            invoiceUrl: '/invoices/inv1.pdf'
          },
          {
            id: 'p2',
            orderId: 'ORD-2024-009876',
            courseId: 'c2',
            courseTitle: 'Node.js Backend Development',
            courseThumbnail: null,
            instructor: 'Jane Smith',
            amount: 599,
            discount: 100,
            finalAmount: 499,
            paymentMethod: 'Credit Card',
            status: 'completed',
            purchasedAt: new Date('2024-10-15'),
            invoiceUrl: '/invoices/inv2.pdf'
          },
          {
            id: 'p3',
            orderId: 'ORD-2025-001456',
            courseId: 'c3',
            courseTitle: 'Python for Data Science',
            courseThumbnail: null,
            instructor: 'Alex Johnson',
            amount: 1299,
            discount: 0,
            finalAmount: 1299,
            paymentMethod: 'Wallet',
            status: 'completed',
            purchasedAt: new Date('2025-01-08'),
            invoiceUrl: '/invoices/inv3.pdf'
          },
        ]);
      } catch (err) {
        toast.error(err as string);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [dispatch]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', icon: CheckCircle, className: 'bg-green-100 text-green-700' };
      case 'pending':
        return { label: 'Pending', icon: Clock, className: 'bg-amber-100 text-amber-700' };
      case 'failed':
        return { label: 'Failed', icon: XCircle, className: 'bg-red-100 text-red-700' };
      case 'refunded':
        return { label: 'Refunded', icon: Receipt, className: 'bg-blue-100 text-blue-700' };
    }
  };

  const totalSpent = purchases
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.finalAmount, 0);

  const totalSaved = purchases
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.discount, 0);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading purchase history...</div>;
  }

  if (purchases.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchases Yet</h3>
        <p className="text-gray-500 mb-4">Start your learning journey by enrolling in a course!</p>
        <Link to="/explore" className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">
          Explore Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-teal-500">
          <div className="text-2xl font-bold text-gray-900">{purchases.length}</div>
          <div className="text-sm text-gray-600">Total Purchases</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
          <div className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Spent</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
          <div className="text-2xl font-bold text-gray-900">₹{totalSaved.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Saved</div>
        </div>
      </div>

      {/* Purchase List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Purchase History</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {purchases.map((purchase) => {
            const statusConfig = getStatusConfig(purchase.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div key={purchase.id} className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-white opacity-50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{purchase.courseTitle}</h4>
                        <p className="text-sm text-gray-500">by {purchase.instructor}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig.className}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(purchase.purchasedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        {purchase.paymentMethod}
                      </span>
                      <span className="font-mono">#{purchase.orderId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {purchase.discount > 0 && (
                          <span className="text-sm text-gray-400 line-through">₹{purchase.amount}</span>
                        )}
                        <span className="font-semibold text-gray-900">₹{purchase.finalAmount}</span>
                        {purchase.discount > 0 && (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                            Saved ₹{purchase.discount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/learner/courses/${purchase.courseId}/learn`}
                          className="flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View Course
                        </Link>
                        {purchase.invoiceUrl && (
                          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm">
                            <Download className="w-4 h-4" />
                            Invoice
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;
