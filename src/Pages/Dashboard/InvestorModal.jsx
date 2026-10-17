import React, { useState } from "react";
import { FaShieldAlt, FaChartLine, FaCheckCircle, FaTimes } from "react-icons/fa";
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
        pool_id: selectedPool._id,
        amount_invested: Number(amount),
        risk_profile: riskProfile,
        auto_reinvest: autoReinvest,
        holding_period: holdingPeriod,
      };

      // Simulated success / triggers backend submission
      toast.success("Investment allocation submitted successfully!");
      if (onInvestSuccess) onInvestSuccess(payload);
      onClose();
    } catch (err) {
      toast.error("Investment allocation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0b0f19] border border-cyan-500/30 rounded-3xl w-full max-w-lg p-6 space-y-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white text-lg cursor-pointer"
        >
          <FaTimes />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <FaChartLine className="text-cyan-400" /> Capital Allocation Questionnaire
          </h2>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
            Step {step} of 4
          </span>
        </div>

        {/* Step 1: Capital & Pool Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Select Investment Pool</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {pools.map((p) => (
                  <div
                    key={p._id || p.pool_name}
                    onClick={() => setSelectedPool(p)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedPool?.pool_name === p.pool_name
                        ? "bg-cyan-500/10 border-cyan-400"
                        : "bg-slate-900 border-slate-800"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-white">{p.pool_name}</span>
                      <span className="text-xs font-bold text-emerald-400">+{p.roi_percentage}% ROI</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Duration: {p.duration_days} Days | Min: ${p.min_investment}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Investment Amount ($)</label>
              <input
                type="number"
                min="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#030712] border border-slate-800 rounded-2xl px-4 py-3 text-cyan-400 font-bold outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        )}

        {/* Step 2: Risk Profile */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-300">Select Risk Profile</label>
            <div className="grid grid-cols-3 gap-3">
              {["Conservative", "Balanced", "Aggressive"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRiskProfile(r)}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    riskProfile === r
                      ? "bg-cyan-500/10 border-cyan-400 text-cyan-400"
                      : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  <FaShieldAlt className="mx-auto text-xl mb-2" />
                  <p className="text-xs font-bold">{r}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Yield Preference */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-slate-200">Auto-Reinvest Daily Dividends</span>
                <input
                  type="checkbox"
                  checked={autoReinvest}
                  onChange={(e) => setAutoReinvest(e.target.checked)}
                  className="w-5 h-5 accent-cyan-400"
                />
              </label>
              <p className="text-[11px] text-slate-400">
                Automatically compounds daily ROI earnings back into active pools.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Target Holding Period</label>
              <select
                value={holdingPeriod}
                onChange={(e) => setHoldingPeriod(e.target.value)}
                className="w-full bg-[#030712] border border-slate-800 rounded-2xl px-4 py-3 text-white text-sm outline-none"
              >
                <option value="Flexible">Flexible (On-Demand)</option>
                <option value="30 Days">30 Days</option>
                <option value="90 Days">90 Days</option>
                <option value="1 Year">1 Year Lockup (+2% Bonus Yield)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Summary & Confirm */}
        {step === 4 && (
          <div className="space-y-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <h3 className="font-bold text-cyan-400 text-sm border-b border-slate-800 pb-2">
              Allocation Summary
            </h3>
            <div className="flex justify-between">
              <span className="text-slate-400">Selected Pool:</span>
              <span className="font-bold text-white">{selectedPool?.pool_name || "Starter Pool"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Amount Invested:</span>
              <span className="font-bold text-white">${amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target ROI Rate:</span>
              <span className="font-bold text-emerald-400">+{selectedPool?.roi_percentage || 15}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Auto-Compounding:</span>
              <span className="font-bold text-white">{autoReinvest ? "Enabled" : "Disabled"}</span>
            </div>
          </div>
        )}

        {/* Modal Controls */}
        <div className="flex justify-between gap-3 pt-2">
          {step > 1 && (
            <button
              onClick={handlePrev}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={handleNext}
              className="ml-auto px-6 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="ml-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs cursor-pointer"
            >
              {isSubmitting ? "Allocating..." : "Confirm & Deposit Capital"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorModal;