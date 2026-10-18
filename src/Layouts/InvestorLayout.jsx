import React, { useContext } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { FaChartLine, FaWallet, FaHistory, FaUserShield } from "react-icons/fa";
import { MdDashboard, MdShield } from "react-icons/md";
import useAuth from "../Hooks/useAuth";
import { ThemeContext } from "../context/ThemeContext";

const InvestorLayout = () => {
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen flex flex-col ${
      theme === "light" ? "bg-[#f8fafc] text-slate-900" : "bg-[#0b0f19] text-white"
    }`}>
      {/* Dedicated Investor Top Header */}
      <header className="sticky top-0 z-40 bg-[#030712]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-black">
            <FaChartLine className="text-lg" />
          </div>
          <div>
            <span className="font-black tracking-wider text-sm text-white block">SINEX INVESTOR</span>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">Institutional Suite</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-xs font-bold text-cyan-400">
            <MdShield className="text-cyan-400" /> Verified Investor
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3 py-1 text-xs font-bold text-slate-200">
            <img
              src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName || "Investor"}`}
              alt="Investor"
              className="w-6 h-6 rounded-full border border-cyan-400"
            />
            <span className="hidden md:inline">{user?.displayName || "Investor Portal"}</span>
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-1 pb-20 md:pb-8">
        <Outlet />
      </main>

      {/* Dedicated Investor Bottom Navigation Bar (Mobile View) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#030712]/95 border-t border-cyan-500/20 backdrop-blur-lg px-6 py-2 flex justify-around items-center">
        <NavLink
          to="/investor/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
              isActive ? "text-cyan-400 scale-105" : "text-slate-400"
            }`
          }
        >
          <MdDashboard className="text-lg" /> Dashboard
        </NavLink>
        <NavLink
          to="/investor/portfolio"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
              isActive ? "text-cyan-400 scale-105" : "text-slate-400"
            }`
          }
        >
          <FaWallet className="text-lg" /> Allocations
        </NavLink>
        <NavLink
          to="/investor/dividends"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
              isActive ? "text-cyan-400 scale-105" : "text-slate-400"
            }`
          }
        >
          <FaHistory className="text-lg" /> Dividends
        </NavLink>
      </nav>
    </div>
  );
};

export default InvestorLayout;