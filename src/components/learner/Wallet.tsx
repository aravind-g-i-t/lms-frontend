import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import type { AppDispatch } from '../../redux/store';
import { getWalletData } from '../../services/learnerServices';
// import { getWalletDetails } from '../../../redux/services/learnerServices';

interface WalletData {
  balance: number;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  reason: 'course_purchase' | 'refund' | 'redeem';
  amount: number;
  courseTitle: string | null;
  createdAt: Date;
}

const reasonLabel: Record<Transaction['reason'], string> = {
  course_purchase: 'Course Purchase',
  refund: 'Refund',
  redeem: 'Redeem',
};

const MyWallet = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit=5

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setLoading(true);
        const response = await dispatch(getWalletData({
          page,
          limit
        })).unwrap();
        setWallet({
          balance:response.data.balance,
          transactions:response.data.transactions
        });
        setTotalPages(response.data.totalPages)

        // setWallet({
        //   balance: 1250.00,
        //   transactions: [
        //     {
        //       id: 't1',
        //       type: 'credit',
        //       reason: 'refund',
        //       amount: 100,
        //       courseTitle: 'React Masterclass',
        //       createdAt: new Date('2025-01-10'),
        //     },
        //     {
        //       id: 't2',
        //       type: 'debit',
        //       reason: 'course_purchase',
        //       amount: 799,
        //       courseTitle: 'React Masterclass',
        //       createdAt: new Date('2025-01-08'),
        //     },
        //     {
        //       id: 't3',
        //       type: 'credit',
        //       reason: 'redeem',
        //       amount: 50,
        //       courseTitle: null,
        //       createdAt: new Date('2025-01-05'),
        //     },
        //     {
        //       id: 't4',
        //       type: 'debit',
        //       reason: 'course_purchase',
        //       amount: 499,
        //       courseTitle: 'Node.js Backend',
        //       createdAt: new Date('2024-12-20'),
        //     },
        //   ],
        // });
      } catch (err) {
        toast.error(err as string);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [dispatch,page]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2">
        <Wallet className="w-10 h-10 text-teal-300" />
        <h2 className="text-xl font-semibold text-gray-700">Wallet Not Available</h2>
        <p className="text-gray-400 text-sm">Unable to load wallet details.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 opacity-90" />
            <span className="text-sm font-medium opacity-90">Available Balance</span>
          </div>
          <button className="flex items-center gap-1 bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-full text-sm font-medium">
            + Add Money
          </button>
        </div>
        <p className="text-4xl font-bold tracking-tight">
          ₹{wallet.balance.toLocaleString()}
        </p>
      </div>

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-4 gap-3">
        {[
          { icon: <ArrowUpRight className="w-5 h-5" />, label: 'Add Money' },
          { icon: <Gift className="w-5 h-5" />, label: 'Redeem Code' },
          { icon: <CreditCard className="w-5 h-5" />, label: 'Payment Methods' },
          { icon: <ArrowDownLeft className="w-5 h-5" />, label: 'Withdraw' },
        ].map(({ icon, label }) => (
          <button
            key={label}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200 transition"
          >
            <div className="text-teal-600">{icon}</div>
            <span className="text-xs font-medium text-gray-600 text-center">{label}</span>
          </button>
        ))}
      </div> */}

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
        </div>

        <ul className="divide-y divide-gray-50">
          {wallet.transactions.map((txn) => (
            <li key={txn.id} className="flex items-center gap-4 px-5 py-4">
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${txn.type === 'credit'
                    ? 'bg-teal-50 text-teal-600'
                    : 'bg-red-50 text-red-500'
                  }`}
              >
                {txn.type === 'credit' ? (
                  <ArrowDownLeft className="w-5 h-5" />
                ) : (
                  <ArrowUpRight className="w-5 h-5" />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {reasonLabel[txn.reason]}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-medium shrink-0">
                    {txn.reason.replace('_', ' ')}
                  </span>
                </div>
                {txn.courseTitle && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">{txn.courseTitle}</p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(txn.createdAt)}</p>
              </div>

              {/* Amount */}
              <span
                className={`text-sm font-semibold shrink-0 ${txn.type === 'credit' ? 'text-teal-600' : 'text-red-500'
                  }`}
              >
                {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
              </span>
            </li>
          ))}
        </ul>

        {/* <div className="px-5 py-3 border-t border-gray-100 text-center">
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page >= totalPages}
            className="text-sm text-teal-600 font-medium hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
          >
            View All Transactions
          </button>
        </div> */}
      </div>
        {!!totalPages && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${page === i + 1 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        )}

    </div>
  );
};

export default MyWallet;