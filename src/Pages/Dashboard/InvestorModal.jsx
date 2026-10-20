import React, { useState } from "react";
import { FaShieldAlt, FaChartLine, FaTimes, FaCoins, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";

const InvestorModal = ({ isOpen, onClose, pools = [], onInvestSuccess }) => {
  const [step, setStep] = useState(1);
  const [selectedPool, setSelectedPool] = useState(pools[0] || null);
  const [amount, setAmount] = useState(100);
  const [riskProfile, setRiskProfile] = useState("Balanced");
  const [autoReinvest, setAutoReinvest] = useState(true);
  const [holdingPeriod, setHoldingPeriod] = useState("30 Days");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!selectedPool) return toast.error("Please select an investment pool.");
    setIsSubmitting(true);

    try {
      const payload = {
        pool_id: selectedPool._id || "POOL_DEFAULT",
        pool_name: selectedPool.pool_name || "Standard Liquidity Pool",
        amount_invested: Number(amount),
        risk_profile: riskProfile,
        auto_reinvest: autoReinvest,
        holding_period: holdingPeriod,
      };

      toast.success("Investment allocation submitted successfully!");
      if (onInvestSuccess) onInvestSuccess(payload);
      onClose();
    } catch (err) {
      console.error("Investment error:", err);
      toast.error("Investment allocation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0b0f19] border border-cyan-500/30 rounded-3xl w-full max-w-lg p-6 space-y-6 text-white shadow-2xl relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white text-lg cursor-pointer transition-colors"
        >
          <FaTimes />
        </button>

        {/* Modal Header & Progress */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <FaChartLine className="text-cyan-400" /> Capital Allocation Suite
          </h2>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
            Step {step} of 4
          </span>
        </div>

        {/* Step 1: Select Pool & Amount */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                1. Select Investment Pool
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {pools.length > 0 ? (
                  pools.map((p, idx) => (
                    <div
                      key={p._id || idx}
                      onClick={() => setSelectedPool(p)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        selectedPool?.pool_name === p.pool_name
                          ? "bg-cyan-500/10 border-cyan-400 ring-1 ring-cyan-400"
                          : "bg-slate-900 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-white">{p.pool_name}</span>
                        <span className="text-xs font-bold text-emerald-400">+{p.roi_percentage || 15}% ROI</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Duration: {p.duration_days || 30} Days | Min Investment: ${p.min_investment || 50}
                      </p>
                    </div>
                  ))
                ) : (
                  <div
                    onClick={() => setSelectedPool({ pool_name: "Task Yield Reserve", roi_percentage: 12, duration_days: 30 })}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedPool?.pool_name === "Task Yield Reserve"
                        ? "bg-cyan-500/10 border-cyan-400"
                        : "bg-slate-900 border-slate-800"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-white">Task Yield Reserve Pool</span>
                      <span className="text-xs font-bold text-emerald-400">+12% ROI</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Duration: 30 Days | Min: $50</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                2. Capital Principal Amount ($)
              </label>
              <div className="relative">
                <FaCoins className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-sm" />
                <input
                  type="number"
                  min="10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#030712] border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-cyan-400 font-bold outline-none focus:border-cyan-400 transition-all text-sm"
                  placeholder="Enter capital amount"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Risk Profile */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Capital Risk Tolerance
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Conservative", desc: "Capital Protected" },
                { name: "Balanced", desc: "Optimal Growth" },
                { name: "Aggressive", desc: "Max Yield Yield" }
              ].map((r) => (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => setRiskProfile(r.name)}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    riskProfile === r.name
                      ? "bg-cyan-500/10 border-cyan-400 text-cyan-400 ring-1 ring-cyan-400"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <FaShieldAlt className="mx-auto text-xl mb-2" />
                  <p className="text-xs font-bold text-white">{r.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Yield & Holding Preferences */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-slate-200">Auto-Reinvest Daily Dividends</span>
                <input
                  type="checkbox"
                  checked={autoReinvest}
                  onChange={(e) => setAutoReinvest(e.target.checked)}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </label>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Automatically compounds daily dividend ROI payouts back into active liquidity pools.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Target Lockup / Holding Period
              </label>
              <select
                value={holdingPeriod}
                onChange={(e) => setHoldingPeriod(e.target.value)}
                className="w-full bg-[#030712] border border-slate-800 rounded-2xl px-4 py-3 text-white text-sm outline-none cursor-pointer focus:border-cyan-400"
              >
                <option value="Flexible">Flexible (On-Demand Withdrawal)</option>
                <option value="30 Days">30 Days Lockup</option>
                <option value="90 Days">90 Days Lockup</option>
                <option value="1 Year">1 Year Lockup (+2% Bonus Yield)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Final Summary & Confirmation */}
        {step === 4 && (
          <div className="space-y-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <h3 className="font-bold text-cyan-400 text-sm border-b border-slate-800 pb-2 flex items-center justify-between">
              Allocation Summary <FaCheck className="text-emerald-400" />
            </h3>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Target Pool:</span>
              <span className="font-bold text-white">{selectedPool?.pool_name || "Task Yield Reserve"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Capital Amount:</span>
              <span className="font-bold text-cyan-400">${amount}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Risk Profile:</span>
              <span className="font-bold text-white">{riskProfile}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Holding Period:</span>
              <span className="font-bold text-white">{holdingPeriod}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Auto-Compounding:</span>
              <span className="font-bold text-emerald-400">{autoReinvest ? "Active" : "Disabled"}</span>
            </div>
          </div>
        )}

        {/* Modal Controls */}
        <div className="flex justify-between gap-3 pt-2 border-t border-slate-800/60">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-all"
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs cursor-pointer transition-all"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="ml-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs cursor-pointer transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Confirm & Allocate Capital"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorModal;