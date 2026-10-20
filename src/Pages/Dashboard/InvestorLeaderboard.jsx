import React, { useContext, useState, useEffect } from "react";
import { FaTrophy, FaArrowUp, FaMoneyBillWave } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";

const InvestorLeaderboard = () => {
  const { theme } = useContext(ThemeContext);

  const initialLeaderboard = [
    { rank: 1, name: "Kato Mukasa", country: "Uganda", flag: "🇺🇬", capital: "$485,000", profit: "+$92,400", roi: "28.4% APY" },
    { rank: 2, name: "Aliyu Usman", country: "Nigeria", flag: "🇳🇬", capital: "$350,000", profit: "+$68,200", roi: "26.1% APY" },
    { rank: 3, name: "David Ochieng", country: "Kenya", flag: "🇰🇪", capital: "$290,000", profit: "+$51,800", roi: "24.8% APY" },
    { rank: 4, name: "Kwame Osei", country: "Ghana", flag: "🇬🇭", capital: "$210,000", profit: "+$39,500", roi: "22.5% APY" },
    { rank: 5, name: "Sipho Dlamini", country: "South Africa", flag: "🇿🇦", capital: "$185,000", profit: "+$31,200", roi: "21.0% APY" },
  ];

  const [withdrawals, setWithdrawals] = useState([
    { id: "WTH-902", name: "Amina Bello", country: "Nigeria 🇳🇬", amount: "$1,450.00", method: "Bank Transfer", time: "Just now" },
    { id: "WTH-418", name: "Kato Mukasa", country: "Uganda 🇺🇬", amount: "$3,200.00", method: "USDT TRC20", time: "2m ago" },
    { id: "WTH-105", name: "David Ochieng", country: "Kenya 🇰🇪", amount: "$850.00", method: "Bank Transfer", time: "5m ago" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const names = [
        { name: "Samuel K.", country: "Uganda 🇺🇬" },
        { name: "Chinedu O.", country: "Nigeria 🇳🇬" },
        { name: "Grace M.", country: "Tanzania 🇹🇿" },
        { name: "Kwame B.", country: "Ghana 🇬🇭" },
      ];
      const methods = ["USDT TRC20", "Bank Transfer"];
      const randomUser = names[Math.floor(Math.random() * names.length)];
      const randomAmount = `$${(Math.floor(Math.random() * 25) + 5) * 100}.00`;
      const randomMethod = methods[Math.floor(Math.random() * methods.length)];

      const newFeedItem = {
        id: `WTH-${Math.floor(100 + Math.random() * 900)}`,
        name: randomUser.name,
        country: randomUser.country,
        amount: randomAmount,
        method: randomMethod,
        time: "Just now",
      };

      setWithdrawals((prev) => [newFeedItem, ...prev.slice(0, 4)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-cyan-500/20 p-6 rounded-3xl text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
            Pan-African Investor Network
          </span>
          <h1 className="text-2xl md:text-3xl font-black flex items-center gap-3 mt-1">
            <FaTrophy className="text-amber-400" /> Pan-African Institutional Leaderboard
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span> Live Market Feed
        </div>
      </div>

      <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
        theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-[#111827] border-slate-800 text-white"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-xs text-slate-400 uppercase tracking-wider">
                <th className="p-4">Rank</th>
                <th className="p-4">Investor</th>
                <th className="p-4">Country</th>
                <th className="p-4">Total Capital</th>
                <th className="p-4">Realized Profit</th>
                <th className="p-4">Active APY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {initialLeaderboard.map((item) => (
                <tr key={item.rank} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-black">
                    {item.rank === 1 && <span className="text-amber-400 text-lg">🥇 #1</span>}
                    {item.rank === 2 && <span className="text-slate-300 text-lg">🥈 #2</span>}
                    {item.rank === 3 && <span className="text-amber-700 text-lg">🥉 #3</span>}
                    {item.rank > 3 && `#${item.rank}`}
                  </td>
                  <td className="p-4 font-bold text-white">{item.name}</td>
                  <td className="p-4 font-medium flex items-center gap-2">
                    <span className="text-lg">{item.flag}</span> {item.country}
                  </td>
                  <td className="p-4 font-mono font-bold">{item.capital}</td>
                  <td className="p-4 font-mono font-black text-emerald-400">{item.profit}</td>
                  <td className="p-4 font-mono font-bold text-cyan-400">{item.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
        theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-[#111827] border-slate-800 text-white"
      }`}>
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <FaMoneyBillWave className="text-emerald-400" /> Live Real-Time Investor Profit Withdrawals
          </h3>
          <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
            <FaArrowUp /> Auto-Sync Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {withdrawals.map((wth, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400">{wth.id}</span>
                <span className="text-[10px] text-slate-500 font-sans">{wth.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-sm">{wth.name}</p>
                  <p className="text-xs text-slate-400">{wth.country}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-emerald-400 text-sm">{wth.amount}</p>
                  <p className="text-[10px] text-cyan-400 font-mono">{wth.method}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestorLeaderboard;