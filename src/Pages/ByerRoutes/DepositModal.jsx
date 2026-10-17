import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaCopy, FaCheck, FaTimes, FaBuilding, FaWallet } from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const DepositModal = ({ coins, price, onClose }) => {
  const axiosSecure = useAxiosSecure();
  const [accounts, setAccounts] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axiosSecure.get("/api/payment-methods")
      .then((res) => {
        setAccounts(res.data);
        if (res.data.length > 0) setSelectedAcc(res.data[0]);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reference.trim()) return toast.error("Please enter transfer reference ID");
    setSubmitting(true);

    try {
      await axiosSecure.post("/api/payments/purchase", {
        coins,
        price,
        account_id: selectedAcc?._id,
        account_label: selectedAcc ? `${selectedAcc.method} (${selectedAcc.account_number})` : "Direct Transfer",
        method: selectedAcc?.method || "Bank Transfer",
        reference,
        note,
      });
      toast.success("Deposit request submitted! Awaiting admin verification.");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit deposit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 text-slate-100 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl">
          <FaTimes />
        </button>

        <div>
          <h3 className="text-xl font-bold text-white">Deposit Account Details</h3>
          <p className="text-xs text-slate-400 mt-1">
            Transfer <span className="text-[#00d7c0] font-bold">${price} USD</span> for <span className="text-[#00d7c0] font-bold">{coins} Coins</span> to any of the accounts below.
          </p>
        </div>

        {/* Account Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Select Deposit Method</label>
          <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
            {accounts.map((acc) => (
              <button
                key={acc._id}
                type="button"
                onClick={() => setSelectedAcc(acc)}
                className={`p-3 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  selectedAcc?._id === acc._id
                    ? "bg-[#00d7c0]/10 border-[#00d7c0] text-white"
                    : "bg-[#0B0F19] border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                {acc.method.toLowerCase().includes("bank") || acc.method.toLowerCase().includes("opay") ? (
                  <FaBuilding className="text-[#00d7c0]" />
                ) : (
                  <FaWallet className="text-[#00d7c0]" />
                )}
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">{acc.label || acc.method}</div>
                  <div className="text-[10px] text-slate-400">{acc.method}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Account Card */}
        {selectedAcc && (
          <div className="bg-[#0B0F19] p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Account / Wallet:</span>
              <span className="font-bold text-white">{selectedAcc.label || selectedAcc.method}</span>
            </div>
            {selectedAcc.account_name && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Account Name:</span>
                <span className="font-semibold text-white">{selectedAcc.account_name}</span>
              </div>
            )}
            <div className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Account Number / Address</div>
                <div className="font-mono text-sm font-bold text-[#00d7c0]">{selectedAcc.account_number}</div>
              </div>
              <button
                onClick={() => handleCopy(selectedAcc.account_number, selectedAcc._id)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
              >
                {copiedId === selectedAcc._id ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
              </button>
            </div>
            {selectedAcc.extra && <p className="text-[11px] text-amber-400">Note: {selectedAcc.extra}</p>}
          </div>
        )}

        {/* Confirmation Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Reference / Transaction Hash *</label>
            <input
              type="text"
              required
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Enter transfer reference or transaction ID"
              className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-[#00d7c0]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Note / Sender Name (Optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Paid via Opay account John"
              className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-[#00d7c0]"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#00d7c0] hover:bg-[#00b8a4] text-slate-950 font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-[#00d7c0]/20 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "I Have Paid (Submit Request)"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepositModal;
