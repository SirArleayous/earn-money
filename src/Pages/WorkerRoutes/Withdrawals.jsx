import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { myInfoContext } from "../../Layouts/DashBoardLayout";

const COIN_USD = 0.05; // keep in sync with the server rules
const MIN_COINS = 200;

const chip = {
  Approved: { label: "Paid", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  Pending: { label: "Processing", cls: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  Rejected: { label: "Rejected", cls: "bg-rose-500/10 text-rose-400 border-rose-500/30" },
};

const Withdrawals = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const ctx = useContext(myInfoContext);
  const balance = ctx?.myInfo?.coin ?? 0;

  const [coins, setCoins] = useState("");
  const [account, setAccount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("MTN Mobile Money");
  const [busy, setBusy] = useState(false);
  const usdAmount = (Number(coins) * COIN_USD).toFixed(2);

  // Real withdrawal history (refreshes every 10 seconds so "Processing" turns into "Paid" by itself)
  const { data: historyData, refetch } = useQuery({
    queryKey: ["my-withdrawals", user?.email],
    enabled: !!user?.email,
    refetchInterval: 10000,
    queryFn: async () => (await axiosSecure.get(`/api/withdrawals/my/${user.email}`)).data,
  });
  // never crash on an unexpected reply: treat anything that is not a list as empty
  const history = Array.isArray(historyData) ? historyData : [];

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const n = Number(coins);
    if (!Number.isInteger(n) || n < MIN_COINS) return toast.error(`Minimum withdrawal is ${MIN_COINS} coins ($${(MIN_COINS * COIN_USD).toFixed(2)})`);
    if (n > balance) return toast.error("Insufficient coin balance!");
    setBusy(true);
    try {
      // the server holds the coins right away and the admin sees the request
      await axiosSecure.post("/api/withdrawals", { withdrawal_coin: n, payment_system: paymentMethod, account_number: account });
      toast.success("Withdrawal request submitted successfully!");
      setCoins("");
      setAccount("");
      refetch();
      ctx?.refetch?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    } finally {
      setBusy(false);
    }
  };

  const input = "w-full bg-[#0B0F19] border border-slate-800 focus:border-[#00d7c0] rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 outline-none transition-all text-sm";
  const label = "text-xs font-semibold text-slate-300 block mb-1.5";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-white">My <span className="text-[#00d7c0]">Wallet</span></h2>
        <p className="text-slate-400 text-xs mt-1">Convert your reward coins into wallet balance fast and securely.</p>
      </div>

      {/* Summary card */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-[#00d7c0] to-teal-700 text-slate-950 shadow-xl shadow-[#00d7c0]/10">
        <span className="text-sm font-semibold opacity-80 block">Available Balance</span>
        <h3 className="text-4xl font-extrabold mt-1">
          {balance} <span className="text-base font-bold">Coins</span>
        </h3>
        <p className="text-sm font-semibold opacity-80 mt-1">≈ ${(balance * COIN_USD).toFixed(2)} USD</p>
      </div>

      {/* Withdrawal form */}
      <form onSubmit={handleWithdraw} className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div>
          <label className={label}>Coins To Withdraw (min {MIN_COINS})</label>
          <input type="number" min={MIN_COINS} placeholder={`Enter coin amount (e.g. ${MIN_COINS})`} value={coins}
            onChange={(e) => setCoins(e.target.value)} required className={input} />
        </div>
        <div>
          <label className={label}>Equivalent Amount ($ USD)</label>
          <input type="text" readOnly value={`$ ${usdAmount}`}
            className="w-full bg-[#0B0F19]/60 border border-slate-800 rounded-xl px-4 py-3 text-[#00d7c0] font-bold outline-none cursor-not-allowed text-sm" />
        </div>
        <div>
          <label className={label}>Account / Wallet Number</label>
          <input type="text" placeholder="Enter phone or account number" value={account}
            onChange={(e) => setAccount(e.target.value)} required className={input} />
        </div>
        <div>
          <label className={label}>Payment Method</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={input}>
            <option value="MTN Mobile Money">MTN Mobile Money</option>
            <option value="Airtel Money">Airtel Money</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Crypto (USDT)">Crypto (USDT)</option>
          </select>
        </div>
        <button type="submit" disabled={busy}
          className="w-full bg-[#00d7c0] hover:bg-[#00b8a4] text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-[#00d7c0]/20 active:scale-[0.99] disabled:opacity-50">
          {busy ? "Submitting..." : "Request Withdrawal"}
        </button>
      </form>

      {/* History */}
      <div className="space-y-3">
        <h3 className="font-bold text-white">Withdrawal History</h3>
        {history.length === 0 ? (
          <p className="text-center text-slate-500 text-sm py-6">No withdrawals yet.</p>
        ) : (
          history.map((w) => {
            const c = chip[w.status] || chip.Pending;
            return (
              <div key={w._id} className="bg-[#111827]/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-white text-sm">{w.withdrawal_coin} coins</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {w.payment_system} · {new Date(w.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-[#00d7c0] text-sm">${w.withdrawal_amount}</p>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${c.cls}`}>{c.label}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Withdrawals;
