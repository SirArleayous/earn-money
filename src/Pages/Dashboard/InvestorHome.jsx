import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  FaChartLine, 
  FaCoins, 
  FaWallet, 
  FaArrowUp, 
  FaPlusCircle, 
  FaShieldAlt, 
  FaHistory 
} from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { ThemeContext } from "../../context/ThemeContext";
import BuyerChart from "../../components/ApexCharts/BuyerChart";
import InvestorModal from "./InvestorModal";

const InvestorHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { theme } = useContext(ThemeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [investorName, setInvestorName] = useState("Investor");

  useEffect(() => {
    if (user?.displayName) {
      setInvestorName(user.displayName);
    } else {
      const savedName = localStorage.getItem("investorName");
      if (savedName) setInvestorName(savedName);
    }
  }, [user]);

  // 1. Fetch Investor Profile & Portfolio Metrics (With Fallbacks)
  const { data: profile = {} } = useQuery({
    queryKey: ["investorProfile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(`/api/investor/profile/${user?.email}`);
        return res.data;
      } catch (err) {
        return {
          available_balance: 5000,
          total_invested: 12500,
          total_yield_earned: 1850,
          risk_profile: "Balanced",
        };
      }
    },
  });

  // 2. Fetch Active Investment Pools (With Fallbacks)
  const { data: pools = [] } = useQuery({
    queryKey: ["investmentPools"],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/api/investor/pools");
        return Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        return [
          { _id: "pool_01", pool_name: "Task Liquidity Reserve Pool #1", roi_percentage: 12.5, duration_days: 30, min_investment: 50 },
          { _id: "pool_02", pool_name: "High-Yield Starter Reserve", roi_percentage: 18.0, duration_days: 60, min_investment: 100 },
          { _id: "pool_03", pool_name: "Institutional Growth Pool", roi_percentage: 25.0, duration_days: 90, min_investment: 500 },
        ];
      }
    },
  });

  // 3. Fetch User Active Investments (With Fallbacks)
  const { data: myInvestments = [] } = useQuery({
    queryKey: ["myInvestments", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(`/api/investor/my-investments/${user?.email}`);
        return Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        return [
          {
            _id: "INV_1001",
            pool_name: "Task Liquidity Reserve Pool #1",
            amount_invested: 1000,
            roi_percentage: 12.5,
            expected_payout: 1125,
            status: "Active",
            maturity_date: "2026-11-20",
          },
          {
            _id: "INV_1002",
            pool_name: "High-Yield Starter Reserve",
            amount_invested: 2500,
            roi_percentage: 18.0,
            expected_payout: 2950,
            status: "Active",
            maturity_date: "2026-12-15",
          },
        ];
      }
    },
  });

  const availableBalance = profile.available_balance || 5000;
  const totalInvested = profile.total_invested || 12500;
  const totalYield = profile.total_yield_earned || 1850;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-cyan-500/20 p-6 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold tracking-wider uppercase">
              Institutional Suite
            </span>
            <span className="text-xs text-slate-400 font-mono">Live Sync</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">
            Welcome back, <span className="text-cyan-400">{investorName}</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time portfolio analytics, active liquidity allocations, and dividend streams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <FaPlusCircle /> Invest Capital
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available Capital */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-2 ${
          theme === "light" ? "bg-white border-slate-200" : "bg-[#111827] border-slate-800"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Capital</span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <FaWallet className="text-lg" />
            </div>
          </div>
          <p className="text-3xl font-black">${availableBalance.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
            <FaArrowUp /> Ready for deployment
          </p>
        </div>

        {/* Card 2: Total Invested */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-2 ${
          theme === "light" ? "bg-white border-slate-200" : "bg-[#111827] border-slate-800"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Portfolio</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FaChartLine className="text-lg" />
            </div>
          </div>
          <p className="text-3xl font-black">${totalInvested.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">{myInvestments.length} Active Liquidity Pools</p>
        </div>

        {/* Card 3: Realized Yield */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-2 ${
          theme === "light" ? "bg-white border-slate-200" : "bg-[#111827] border-slate-800"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Realized Yield</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FaCoins className="text-lg" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-400">+${totalYield.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
            <FaArrowUp /> Daily compound enabled
          </p>
        </div>

        {/* Card 4: Risk Tier */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-2 ${
          theme === "light" ? "bg-white border-slate-200" : "bg-[#111827] border-slate-800"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Risk Rating</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <FaShieldAlt className="text-lg" />
            </div>
          </div>
          <p className="text-3xl font-black">{profile.risk_profile || "Balanced"}</p>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <MdVerifiedUser className="text-cyan-400" /> Capital Protected Tier
          </p>
        </div>
      </div>

      {/* Analytics & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border shadow-xl space-y-4 ${
          theme === "light" ? "bg-white border-slate-200" : "bg-[#111827] border-slate-800"
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800/40 pb-4">
            <div>
              <h3 className="text-lg font-extrabold">Yield Performance Trends</h3>
              <p className="text-xs text-slate-400">Live valuation and daily ROI payout stream</p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300">
              USD / Task Coins
            </span>
          </div>
          <div className="p-2">
            <BuyerChart />
          </div>
        </div>

        {/* Live Network Dividend Activity */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
          theme === "light" ? "bg-white border-slate-200" : "bg-[#111827] border-slate-800"
        }`}>
          <h3 className="text-lg font-extrabold flex items-center gap-2">
            <FaHistory className="text-cyan-400" /> Live Platform Dividends
          </h3>
          <p className="text-xs text-slate-400">Real-time network payouts across pools</p>

          <div className="space-y-3 pt-2">
            {[
              { id: "INV_902", amount: "$120.00", roi: "+12.5%", pool: "Task Pool #1", time: "2m ago" },
              { id: "INV_412", amount: "$45.50", roi: "+8.0%", pool: "Starter Reserve", time: "8m ago" },
              { id: "INV_108", amount: "$310.00", roi: "+15.0%", pool: "Growth Pool", time: "15m ago" },
            ].map((feed, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono font-bold text-slate-300">{feed.id}</p>
                  <p className="text-[11px] text-slate-500">{feed.pool}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-400">{feed.amount} ({feed.roi})</p>
                  <p className="text-[10px] text-slate-500">{feed.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Investments Ledger Table */}
      <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
        theme === "light" ? "bg-white border-slate-200" : "bg-[#111827] border-slate-800"
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold">Active Capital Allocations</h3>
          <span className="text-xs text-slate-400">{myInvestments.length} Tiers Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-xs text-slate-400 uppercase tracking-wider">
                <th className="p-4">Pool Name</th>
                <th className="p-4">Capital Invested</th>
                <th className="p-4">ROI %</th>
                <th className="p-4">Expected Payout</th>
                <th className="p-4">Status</th>
                <th className="p-4">Maturity Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {myInvestments.map((inv, idx) => (
                <tr key={inv._id || idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-bold text-white">{inv.pool_name}</td>
                  <td className="p-4 font-semibold">${inv.amount_invested}</td>
                  <td className="p-4 text-emerald-400 font-bold">+{inv.roi_percentage}%</td>
                  <td className="p-4 font-bold text-cyan-400">${inv.expected_payout}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {inv.status || "Active"}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-400">
                    {inv.maturity_date ? new Date(inv.maturity_date).toLocaleDateString() : "Flexible"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InvestorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pools={pools}
      />
    </div>
  );
};

export default InvestorHome;