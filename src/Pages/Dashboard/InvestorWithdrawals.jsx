import React, { useContext, useState } from "react";
import { FaWallet, FaUniversity, FaLock } from "react-icons/fa";
import { SiTether } from "react-icons/si";
import toast from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeContext";

const InvestorWithdrawals = () => {
  const { theme } = useContext(ThemeContext);
  const [payoutMethod, setPayoutMethod] = useState("Bank");
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [accName, setAccName] = useState("");
  const [usdtAddress, setUsdtAddress] = useState("");
  const [pinCode, setPinCode] = useState("");

  const handleWithdrawal = (e) => {
    e.preventDefault();
    if (!amount || !pinCode) {
      toast.error("Please fill in all mandatory security fields.");
      return;
    }
    if (payoutMethod === "Bank" && (!bankName || !accNumber || !accName)) {
      toast.error("Complete bank account verification details.");
      return;
    }
    if (payoutMethod === "USDT" && !usdtAddress) {
      toast.error("Provide a valid TRC-20 USDT wallet address.");
      return;
    }

    toast.success("Withdrawal Request Queued! Compliance audit pending (1-2 hrs).");
    setAmount("");
    setPinCode("");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-cyan-500/20 p-6 rounded-3xl text-white shadow-xl space-y-2">
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
          Capital Redemption
        </span>
        <h1 className="text-2xl md:text-3xl font-black flex items-center gap-3">
          <FaWallet className="text-cyan-400" /> Institutional Capital & Profit Redemption
        </h1>
        <p className="text-xs text-slate-400">
          Execute profits or capital lockup redemptions directly to pre-verified corporate accounts.
        </p>
      </div>

      <div className={`p-6 rounded-3xl border shadow-xl space-y-6 ${
        theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-[#111827] border-slate-800 text-white"
      }`}>
        <form onSubmit={handleWithdrawal} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Select Payout Destination</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPayoutMethod("Bank")}
                className={`p-4 rounded-2xl border flex items-center justify-center gap-3 font-bold text-sm cursor-pointer transition-all ${
                  payoutMethod === "Bank"
                    ? "bg-cyan-500/10 border-cyan-400 text-cyan-400"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <FaUniversity /> Bank Transfer
              </button>
              <button
                type="button"
                onClick={() => setPayoutMethod("USDT")}
                className={`p-4 rounded-2xl border flex items-center justify-center gap-3 font-bold text-sm cursor-pointer transition-all ${
                  payoutMethod === "USDT"
                    ? "bg-emerald-500/10 border-emerald-400 text-emerald-400"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <SiTether /> USDT (TRC-20)
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Redemption Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 2500"
              className="w-full bg-[#030712] border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          {payoutMethod === "Bank" && (
            <div className="space-y-4 border-t border-slate-800/80 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. Zenith Bank"
                    className="w-full bg-[#030712] border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Account Number</label>
                  <input
                    type="text"
                    value={accNumber}
                    onChange={(e) => setAccNumber(e.target.value)}
                    placeholder="10-digit account number"
                    className="w-full bg-[#030712] border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Account Name (Must match BVN/NIN)</label>
                <input
                  type="text"
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  placeholder="e.g. Aliyu Usman"
                  className="w-full bg-[#030712] border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {payoutMethod === "USDT" && (
            <div className="space-y-2 border-t border-slate-800/80 pt-4">
              <label className="text-xs font-bold text-slate-400 uppercase">USDT Wallet Address (TRC-20)</label>
              <input
                type="text"
                value={usdtAddress}
                onChange={(e) => setUsdtAddress(e.target.value)}
                placeholder="T..."
                className="w-full bg-[#030712] border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          )}

          <div className="space-y-1 border-t border-slate-800/80 pt-4">
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
              <FaLock className="text-cyan-400" /> Security PIN / 2FA Auth Code
            </label>
            <input
              type="password"
              maxLength={6}
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              placeholder="6-digit PIN"
              className="w-full bg-[#030712] border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400 font-mono tracking-widest text-center"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            Confirm Withdrawal Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvestorWithdrawals;