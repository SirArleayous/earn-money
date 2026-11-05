import React, { useContext, useState } from "react";
import { 
  FaUniversity, 
  FaCopy, 
  FaCheckCircle, 
  FaCloudUploadAlt, 
  FaInfoCircle 
} from "react-icons/fa";
import { SiTether } from "react-icons/si";
import toast from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeContext";

const InvestorDeposits = () => {
  const { theme } = useContext(ThemeContext);
  const [copiedField, setCopiedField] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [txRef, setTxRef] = useState("");

  const bankDetails = {
    bankName: "First Bank of Nigeria",
    accountName: "SINEX INNOVATION NEXUS LTD - INVESTOR RESERVE",
    accountNumber: "0123456789",
    swiftCode: "FBNINGLA",
  };

  const usdtDetails = {
    network: "USDT (TRC-20)",
    walletAddress: "T9xZXkP29mVLK8NqW2pL34zA98X12vMnQk",
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 3000);
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (!depositAmount || !txRef) {
      toast.error("Please fill in all deposit notification fields.");
      return;
    }
    toast.success("Deposit Notification Submitted! Compliance audit usually takes 10-30 mins.");
    setDepositAmount("");
    setTxRef("");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-cyan-500/20 p-6 rounded-3xl text-white shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
            Capital Liquidity Vault
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black flex items-center gap-3">
          <FaUniversity className="text-cyan-400" /> Institutional Deposits & Banking
        </h1>
        <p className="text-xs text-slate-400">
          Fund your institutional investor wallet via dedicated corporate bank accounts or USDT crypto network.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Method 1: Corporate Bank Wire Transfer */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-6 ${
          theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-[#111827] border-slate-800 text-white"
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xl">
                <FaUniversity />
              </div>
              <div>
                <h3 className="font-extrabold text-base">Direct Bank Wire</h3>
                <p className="text-xs text-slate-400">Naira (NGN) & USD Wire</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              Zero Fee
            </span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Bank Name</span>
                <span className="font-bold text-white text-sm font-sans">{bankDetails.bankName}</span>
              </div>
              <button onClick={() => copyToClipboard(bankDetails.bankName, "Bank Name")} className="p-2 text-cyan-400 hover:text-white cursor-pointer">
                {copiedField === "Bank Name" ? <FaCheckCircle className="text-emerald-400" /> : <FaCopy />}
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Account Name</span>
                <span className="font-bold text-white text-xs font-sans">{bankDetails.accountName}</span>
              </div>
              <button onClick={() => copyToClipboard(bankDetails.accountName, "Account Name")} className="p-2 text-cyan-400 hover:text-white cursor-pointer">
                {copiedField === "Account Name" ? <FaCheckCircle className="text-emerald-400" /> : <FaCopy />}
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Account Number</span>
                <span className="font-bold text-cyan-400 text-lg font-mono">{bankDetails.accountNumber}</span>
              </div>
              <button onClick={() => copyToClipboard(bankDetails.accountNumber, "Account Number")} className="p-2 text-cyan-400 hover:text-white cursor-pointer">
                {copiedField === "Account Number" ? <FaCheckCircle className="text-emerald-400" /> : <FaCopy />}
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-sans">SWIFT / BIC Code</span>
                <span className="font-bold text-white text-sm font-mono">{bankDetails.swiftCode}</span>
              </div>
              <button onClick={() => copyToClipboard(bankDetails.swiftCode, "SWIFT Code")} className="p-2 text-cyan-400 hover:text-white cursor-pointer">
                {copiedField === "SWIFT Code" ? <FaCheckCircle className="text-emerald-400" /> : <FaCopy />}
              </button>
            </div>
          </div>
        </div>

        {/* Method 2: USDT Crypto Deposit */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-6 ${
          theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-[#111827] border-slate-800 text-white"
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl">
                <SiTether />
              </div>
              <div>
                <h3 className="font-extrabold text-base">USDT Crypto Deposit</h3>
                <p className="text-xs text-slate-400">TRC-20 TRON Network</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
              Instant Confirm
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Network</span>
                <span className="font-bold text-emerald-400 text-sm font-mono">{usdtDetails.network}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-slate-400 block text-[10px] uppercase">USDT Deposit Address</span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-white break-all">{usdtDetails.walletAddress}</span>
                <button onClick={() => copyToClipboard(usdtDetails.walletAddress, "USDT Address")} className="p-2 text-cyan-400 hover:text-white shrink-0 cursor-pointer">
                  {copiedField === "USDT Address" ? <FaCheckCircle className="text-emerald-400" /> : <FaCopy />}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-3">
              <FaInfoCircle className="text-cyan-400 text-lg shrink-0 mt-0.5" />
              <p className="text-[11px]">
                Only transfer USDT over the TRC-20 network. Minimum deposit threshold is <strong>$100.00</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Notification Form */}
      <div className={`p-6 rounded-3xl border shadow-xl space-y-6 ${
        theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-[#111827] border-slate-800 text-white"
      }`}>
        <h3 className="font-extrabold text-lg flex items-center gap-2">
          <FaCloudUploadAlt className="text-cyan-400" /> Notify Compliance of Capital Deposit
        </h3>

        <form onSubmit={handleDepositSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Deposit Amount ($)</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full bg-[#030712] border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Transaction Ref / Hash</label>
            <input
              type="text"
              value={txRef}
              onChange={(e) => setTxRef(e.target.value)}
              placeholder="Bank Ref / TxHash"
              className="w-full bg-[#030712] border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="space-y-1 md:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              Submit Deposit Slip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestorDeposits;