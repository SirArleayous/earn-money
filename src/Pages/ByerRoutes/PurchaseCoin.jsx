import React, { useState } from "react";
import { FaCoins, FaCreditCard, FaHistory } from "react-icons/fa";
import DepositModal from "./DepositModal";

const PurchaseCoin = () => {
  const [selectedCoins, setSelectedCoins] = useState(100);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const coinPackages = [
    { coins: 100, price: 10 },
    { coins: 500, price: 45 },
    { coins: 1000, price: 85 },
    { coins: 2500, price: 200 },
  ];

  const currentPkg = coinPackages.find((p) => p.coins === selectedCoins) || coinPackages[0];

  const handlePurchase = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-white">
          Purchase <span className="text-[#00d7c0]">Task Coins</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Top up your client coin balance to create and fund worker task listings across the SINEX network.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {coinPackages.map((pkg) => (
          <div
            key={pkg.coins}
            onClick={() => setSelectedCoins(pkg.coins)}
            className={`p-6 rounded-2xl border transition-all cursor-pointer text-center space-y-2 ${
              selectedCoins === pkg.coins
                ? "bg-[#00d7c0]/10 border-[#00d7c0] shadow-xl shadow-[#00d7c0]/10"
                : "bg-[#111827]/80 border-slate-800 hover:border-slate-700"
            }`}
          >
            <FaCoins className="text-3xl text-[#00d7c0] mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{pkg.coins} Coins</h3>
            <p className="text-slate-400 text-xs font-semibold">${pkg.price} USD</p>
          </div>
        ))}
      </div>

      <div className="bg-[#111827]/90 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <FaCreditCard className="text-[#00d7c0]" />
          Checkout & Payment Details
        </h3>
        <form onSubmit={handlePurchase} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Selected Package</label>
            <input
              type="text"
              readOnly
              value={`${currentPkg.coins} Coins ($${currentPkg.price} USD)`}
              className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-3 text-[#00d7c0] font-bold outline-none cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#00d7c0] hover:bg-[#00b8a4] text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#00d7c0]/20 cursor-pointer"
          >
            Complete Coin Top-Up
          </button>
        </form>
      </div>

      {isModalOpen && (
        <DepositModal
          coins={currentPkg.coins}
          price={currentPkg.price}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PurchaseCoin;
