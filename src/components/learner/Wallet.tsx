import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Gift, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import type { AppDispatch } from '../../redux/store';
// import { getWalletDetails } from '../../../redux/services/learnerServices';

interface WalletData {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: Date;
}

const MyWallet = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setLoading(true);
        // const response = await dispatch(getWalletDetails()).unwrap();
        // setWallet(response.data);
        
        // Mock data
        setWallet({
          balance: 1250.00,
          totalEarned: 500.00,
          totalSpent: 2500.00,
          transactions: [
            { id: 't1', type: 'credit', amount: 100, description: 'Referral bonus', date: new Date('2025-01-10') },
            { id: 't2', type: 'debit', amount: 799, description: 'Course purchase: React Masterclass', date: new Date('2025-01-08') },
            { id: 't3', type: 'credit', amount: 50, description: 'Course completion reward', date: new Date('2025-01-05') },
            { id: 't4', type: 'debit', amount: 499, description: 'Course purchase: Node.js Backend', date: new Date('2024-12-20') },
          ]
        });
      } catch (err) {
        toast.error(err as string);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [dispatch]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading wallet...</div>;
  }

  if (!wallet) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Wallet Not Available</h3>
        <p className="text-gray-500">Unable to load wallet details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8" />
            <span className="text-teal-100">Available Balance</span>
          </div>
          <button className="flex items-center gap-2 bg-white text-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Money
          </button>
        </div>
        <div className="text-4xl font-bold mb-6">₹{wallet.balance.toLocaleString()}</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2 text-teal-100 text-sm mb-1">
              <ArrowDownLeft className="w-4 h-4" /> Total Earned
            </div>
            <div className="text-xl font-semibold">₹{wallet.totalEarned.toLocaleString()}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2 text-teal-100 text-sm mb-1">
              <ArrowUpRight className="w-4 h-4" /> Total Spent
            </div>
            <div className="text-xl font-semibold">₹{wallet.totalSpent.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-teal-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">Add Money</span>
        </button>
        <button className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Gift className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">Redeem Code</span>
        </button>
        <button className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-amber-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">Payment Methods</span>
        </button>
        <button className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">Withdraw</span>
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {wallet.transactions.map((txn) => (
            <div key={txn.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {txn.type === 'credit' ? (
                    <ArrowDownLeft className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{txn.description}</div>
                  <div className="text-xs text-gray-500">{formatDate(txn.date)}</div>
                </div>
              </div>
              <div className={`font-semibold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-100">
          <button className="w-full text-center text-teal-600 hover:text-teal-700 text-sm font-medium">
            View All Transactions
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyWallet;
