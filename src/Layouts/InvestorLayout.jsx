import React, { useContext, useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { 
  FaChartLine, FaWallet, FaHistory, FaSun, FaMoon, FaTrophy, 
  FaUsers, FaUniversity, FaShieldAlt, FaFileDownload, FaKey, FaCog, FaUser 
} from "react-icons/fa";
import { MdShield, MdDashboard } from "react-icons/md";
import useAuth from "../Hooks/useAuth";
import { ThemeContext } from "../context/ThemeContext";

const InvestorLayout = () => {
  const { user } = useAuth();
  const themeContext = useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );
  const [displayName, setDisplayName] = useState("Investor");

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    } else {
      const savedName = localStorage.getItem("investorName");
      if (savedName) setDisplayName(savedName);
    }
  }, [user]);

  // Handle Theme Switch
  const toggleTheme = () => {
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setCurrentTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (themeContext?.setTheme) {
      themeContext.setTheme(nextTheme);
    }
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const tabs = [
    { name: "Overview", path: "/investor", icon: <MdDashboard />, ready: true },
    { name: "Allocations", path: "/investor/portfolio", icon: <FaWallet />, ready: true },
    { name: "Deposits & Banking", path: "/investor/deposits", icon: <FaUniversity />, ready: true },
    { name: "Investor Leaderboard", path: "/investor/leaderboard", icon: <FaTrophy />, ready: true },
    { name: "Ecosystem Activity", path: "/investor/ecosystem", icon: <FaUsers />, ready: false },
    { name: "Dividends History", path: "/investor/dividends", icon: <FaHistory />, ready: true },
    { name: "Risk Strategy", path: "/investor/risk", icon: <FaShieldAlt />, ready: false },
    { name: "Withdrawals", path: "/investor/withdrawals", icon: <FaWallet />, ready: true },
    { name: "My Profile", path: "/investor/profile", icon: <FaUser />, ready: true },
    { name: "Reports & Audits", path: "/investor/reports", icon: <FaFileDownload />, ready: false },
    { name: "API & Security", path: "/investor/security", icon: <FaKey />, ready: false },
    { name: "Settings", path: "/investor/settings", icon: <FaCog />, ready: true },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      currentTheme === "light" ? "bg-[#f8fafc] text-slate-900" : "bg-[#0b0f19] text-white"
    }`}>
      {/* Top Header */}
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
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white transition-all cursor-pointer"
            title="Toggle Light/Dark Theme"
          >
            {currentTheme === "dark" ? <FaSun className="text-amber-400 text-sm" /> : <FaMoon className="text-cyan-400 text-sm" />}
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-xs font-bold text-cyan-400">
            <MdShield className="text-cyan-400" /> Verified Investor
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3.5 py-1 text-xs font-bold text-slate-200">
            <img
              src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`}
              alt="Investor Avatar"
              className="w-6 h-6 rounded-full border border-cyan-400"
            />
            <span className="text-cyan-400 font-extrabold">{displayName}</span>
          </div>
        </div>
      </header>

      {/* Navigation Bar with "Coming Soon" toggles */}
      <div className="bg-[#030712] border-b border-slate-800/80 px-4 md:px-8 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 py-2 min-w-max">
          {tabs.map((tab, idx) => (
            <NavLink
              key={idx}
              to={tab.path}
              end={tab.path === "/investor"}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`
              }
            >
              {!tab.ready && (
                <span className="text-[9px] font-black text-rose-500 animate-pulse uppercase tracking-tighter">
                  Coming Soon
                </span>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm">{tab.icon}</span>
                <span>{tab.name}</span>
              </div>
            </NavLink>
          ))}
        </div>
      </div>

      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default InvestorLayout;