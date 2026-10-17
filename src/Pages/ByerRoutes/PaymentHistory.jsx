import React, { useState } from 'react';
import { FaCoins, FaCreditCard, FaHistory } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import DepositModal from './DepositModal';

const PurchaseCoin = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedCoins, setSelectedCoins] = useState(100);
  const [selectedPrice, setSelectedPrice] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const coinPackages = [
    { coins: 100, price: 10 },
    { coins: 500, price: 45 },
    { coins: 1000, price: 85 },
    { coins: 2500, price: 200 },
  ];

  // Fetch live purchase and deposit history
  const { data: rawHistory = null, isLoading } = useQuery({
    queryKey: ['myHistories', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/api/payments/history/${user?.email}`);
      return data;
    },
  });

  // Safely combine deposits and payments into a single list
  const depositsList = Array.isArray(rawHistory?.deposits) ? rawHistory.deposits : [];
  const paymentsList = Array.isArray(rawHistory?.payments)
    ? rawHistory.payments
    : Array.isArray(rawHistory)
    ? rawHistory
    : [];

  const paymentHistory = [...depositsList, ...paymentsList];

  const handleSelectPackage = (pkg) => {
    setSelectedCoins(pkg.coins);
    setSelectedPrice(pkg.price);
  };

  const handleOpenModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <div className='max-w-5xl mx-auto space-y-10 p-6'>
      <div className='text-center space-y-2'>
        <h2 className='text-3xl font-extrabold text-white'>
          Purchase <span className='text-[#00d7c0]'>Task Coins</span>
        </h2>
        <p className='text-slate-400 text-sm max-w-md mx-auto'>
          Top up your client coin balance to create and fund worker task listings across the SINEX network.
        </p>
      </div>

      {/* Coin Packages Selection */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {coinPackages.map((pkg) => (
          <div
            key={pkg.coins}
            onClick={() => handleSelectPackage(pkg)}
            className={`p-6 rounded-2xl border transition-all cursor-pointer text-center space-y-2 ${
              selectedCoins === pkg.coins
                ? 'bg-[#00d7c0]/10 border-[#00d7c0] shadow-xl shadow-[#00d7c0]/10'
                : 'bg-[#111827]/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <FaCoins className='text-3xl text-[#00d7c0] mx-auto mb-2' />
            <h3 className='text-2xl font-bold text-white'>{pkg.coins} Coins</h3>
            <p className='text-slate-400 text-xs font-semibold'>${pkg.price} USD</p>
          </div>
        ))}
      </div>

      {/* Payment Form / Trigger Modal */}
      <div className='bg-[#111827]/90 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6'>
        <h3 className='text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2'>
          <FaCreditCard className='text-[#00d7c0]' />
          Checkout & Payment Details
        </h3>
        <form onSubmit={handleOpenModal} className='space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-slate-300 mb-1'>Selected Package</label>
            <input
              type='text'
              readOnly
              value={`${selectedCoins} Coins ($${selectedPrice} USD)`}
              className='w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-3 text-[#00d7c0] font-bold outline-none cursor-not-allowed'
            />
          </div>
          <button
            type='submit'
            className='w-full bg-[#00d7c0] hover:bg-[#00b8a4] text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#00d7c0]/20 cursor-pointer'
          >
            Complete Coin Top-Up
          </button>
        </form>
      </div>

      {/* Payment History Table (Pending & Approved Purchases) */}
      <div className='bg-[#111827]/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4'>
        <h3 className='text-lg font-bold text-white flex items-center gap-2'>
          <FaHistory className='text-[#00d7c0]' />
          Payment History Overview
        </h3>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse text-sm'>
            <thead>
              <tr className='bg-[#0B0F19] text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800'>
                <th className='p-4'>Reference / ID</th>
                <th className='p-4'>Amount ($)</th>
                <th className='p-4'>Coins Added</th>
                <th className='p-4'>Method</th>
                <th className='p-4'>Status</th>
                <th className='p-4'>Date</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-800/60 text-slate-300'>
              {paymentHistory.map((item, index) => {
                const statusStr = (item.status || 'Pending').toLowerCase();
                const isApproved = statusStr === 'approved' || statusStr === 'completed';
                const isRejected = statusStr === 'rejected';

                return (
                  <tr key={item._id || item.reference || index} className='hover:bg-slate-800/40 transition-colors'>
                    <td className='p-4 font-mono text-xs text-slate-400'>
                      {item.reference || item.transaction_id || item._id?.slice(-8) || 'N/A'}
                    </td>
                    <td className='p-4 font-semibold text-white'>
                      ${item.price || item.amount || 0}
                    </td>
                    <td className='p-4 font-bold text-[#00d7c0]'>
                      +{item.coins || item.coins_added || 0} Coins
                    </td>
                    <td className='p-4 text-xs text-slate-300'>
                      {item.method || item.account_label || 'Manual Deposit'}
                    </td>
                    <td className='p-4'>
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                          isApproved
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : isRejected
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {item.status || 'Pending'}
                      </span>
                    </td>
                    <td className='p-4 text-xs text-slate-400'>
                      {item.created_at || item.date
                        ? new Date(item.created_at || item.date).toLocaleDateString()
                        : 'Recent'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!isLoading && paymentHistory.length === 0 && (
            <p className='text-center py-6 text-slate-400 text-xs'>
              No coin purchase transactions found.
            </p>
          )}
        </div>
      </div>

      {/* Deposit Popup Modal */}
      {isModalOpen && (
        <DepositModal
          coins={selectedCoins}
          price={selectedPrice}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PurchaseCoin;
