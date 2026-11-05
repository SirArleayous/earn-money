import React, { useContext } from "react";
import { FaCoins, FaCheckCircle } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";

const InvestorDividends = () => {
  const { theme } = useContext(ThemeContext);

  const dividendsData = [
    { id: "DIV_88301", pool: "Task Liquidity Reserve Pool #1", amount: "+$125.00", status: "Compounded", date: "2026-10-18 08:00 AM", tax: "$0.00" },
    { id: "DIV_88294", pool: "High-Yield Starter Reserve", amount: "+$210.00", status: "Compounded", date: "2026-10-17 08:00 AM", tax: "$0.00" },
    { id: "DIV_88102", pool: "Institutional Growth Pool", amount: "+$500.00", status: "Credited to Wallet", date: "2026-10-16 08:00 AM", tax: "$0.00" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-cyan-500/20 p-6 rounded-3xl text-white shadow-xl space-y-2">
        <h1 className="text-2xl md:text-3xl font-black flex items-center gap-3">
          <FaCoins className="text-emerald-400" /> Dividends & Compound Yield History
        </h1>
        <p className="text-xs text-slate-400">
          Automated daily dividend payout ledger across active capital liquidity pools.
        </p>
      </div>

      <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
        theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-[#111827] border-slate-800 text-white"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-xs text-slate-400 uppercase tracking-wider">
                <th className="p-4">Payout Hash</th>
                <th className="p-4">Liquidity Pool</th>
                <th className="p-4">Yield Earned</th>
                <th className="p-4">Tax Deduction</th>
                <th className="p-4">Action Status</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {dividendsData.map((div, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-300">{div.id}</td>
                  <td className="p-4 font-bold text-white">{div.pool}</td>
                  <td className="p-4 font-mono font-black text-emerald-400">{div.amount}</td>
                  <td className="p-4 font-mono text-slate-400">{div.tax}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-max">
                      <FaCheckCircle /> {div.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-mono text-slate-400">{div.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvestorDividends;