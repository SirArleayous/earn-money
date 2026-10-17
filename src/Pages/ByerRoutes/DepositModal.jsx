import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaCopy, FaCheck, FaTimes, FaBuilding, FaWallet, FaPaypal, FaUniversity } from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

// The 6 fixed deposit categories required
const PAYMENT_CATEGORIES = [
  { id: "binance", method: "Binance Wallet", icon: FaWallet },
  { id: "opay", method: "Opay", icon: FaBuilding },
  { id: "moniepoint", method: "Moniepoint", icon: FaBuilding },
  { id: "tonkeeper", method: "Tonkeeper", icon: FaWallet },
  { id: "paypal", method: "PayPal", icon: FaPaypal },
  { id: "banks", method: "Commercial Banks", icon: FaUniversity },
];

const DepositModal = ({ coins, price, onClose }) => {
  const axiosSecure = useAxiosSecure();
  const [dbAccounts, setDbAccounts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(PAYMENT_CATEGORIES[0]);
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axiosSecure
      .get("/api/payment-methods")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setDbAccounts(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching payment methods:", err);
      });
  }, []);

  // Filter accounts created by Admin matching the currently selected category
  const activeAccountsForCategory = dbAccounts.filter((acc) => {
    const m = (acc.method || "").toLowerCase();
    const cat = selectedCategory.method.toLowerCase();

    if (cat.includes("binance")) return m.includes("binance");
    if (cat.includes("opay")) return m.includes("opay");
    if (cat.includes("moniepoint")) return m.includes("moniepoint");
    if (cat.includes("tonkeeper")) return m.includes("tonkeeper");
    if (cat.includes("paypal")) return m.includes("paypal");
    if (cat.includes("commercial")) return m.includes("bank") || m.includes("commercial");
    return m.includes(cat);
  });

  const selectedAcc = activeAccountsForCategory[0];

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
        account_id: selectedAcc?._id || null,
        account_label: selectedAcc
          ? `${selectedAcc.label || selectedAcc.method} (${selectedAcc.account_number})`
          : selectedCategory.method,
        method: selectedCategory.method,
        reference,
        note,
      });
      toast.success("Deposit request submitted! Awaiting admin verification.");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit deposit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
        >
          <FaTimes />
        </button>

        <div>
          <h3 className="text-xl font-bold text-white">Deposit Account Details</h3>
          <p className="text-xs text-slate-400 mt-1">
            Transfer <span className="text-[#00d7c0] font-bold">${price} USD</span> for{" "}
            <span className="text-[#00d7c0] font-bold">{coins} Coins</span> to any of the options below.
          </p>
        </div>

        {/* Sidebar & Account Details Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Sidebar: Payment Categories */}
          <div className="space-y-1.5 md:border-r border-slate-800 pr-0 md:pr-3">
            <label className="text-xs font-semibold text-slate-400 block mb-2">
              Select Payment Option
            </label>
            {PAYMENT_CATEGORIES.map((cat) => {
              const IconComponent = cat.icon;
              const isSelected = selectedCategory.id === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    isSelected
                      ? "bg-[#00d7c0]/10 border-[#00d7c0] text-white font-bold"
                      : "bg-[#0B0F19] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <IconComponent className="text-[#00d7c0] text-lg flex-shrink-0" />
                  <span className="text-xs truncate">{cat.method}</span>
                </button>
              );
            })}
          </div>

          {/* Right Panel: Account Info & Details */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-[#0B0F19] p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Category:</span>
                <span className="font-bold text-[#00d7c0]">{selectedCategory.method}</span>
              </div>

              {selectedAcc ? (
                <>
                  {selectedAcc.label && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Account Label:</span>
                      <span className="font-semibold text-white">{selectedAcc.label}</span>
                    </div>
                  )}
                  {selectedAcc.account_name && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Account Name:</span>
                      <span className="font-semibold text-white">{selectedAcc.account_name}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <div className="truncate pr-2">
                      <div className="text-[10px] text-slate-500 uppercase">
                        Account Number / Wallet Address
                      </div>
                      <div className="font-mono text-xs md:text-sm font-bold text-[#00d7c0] truncate">
                        {selectedAcc.account_number}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedAcc.account_number, selectedAcc._id)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs flex-shrink-0"
                    >
                      {copiedId === selectedAcc._id ? (
                        <FaCheck className="text-emerald-400" />
                      ) : (
                        <FaCopy />
                      )}
                    </button>
                  </div>
                  {selectedAcc.extra && (
                    <p className="text-[11px] text-amber-400">Note: {selectedAcc.extra}</p>
                  )}
                </>
              ) : (
                <div className="p-4 text-center text-slate-400 space-y-1">
                  <p className="text-xs font-semibold text-slate-300">
                    No active account configured for {selectedCategory.method} yet.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    You can still submit your payment reference below after making the transfer.
                  </p>
                </div>
              )}
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Payment Reference / Transaction Hash *
                </label>
                <input
                  type="text"
                  required
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Enter transfer reference or transaction ID"
                  className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none focus:border-[#00d7c0]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Note / Sender Name (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Paid via account John"
                  className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none focus:border-[#00d7c0]"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#00d7c0] hover:bg-[#00b8a4] text-slate-950 font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-[#00d7c0]/20 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Submitting..." : "I Have Paid (Submit Request)"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
