import React, { useContext } from "react";
import { FaShieldAlt, FaEnvelope, FaPhone, FaFingerprint, FaIdCard, FaCheckCircle } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import { ThemeContext } from "../../context/ThemeContext";

const InvestorProfile = () => {
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);

  const profileData = {
    name: user?.displayName || localStorage.getItem("investorName") || "Aliyu Usman",
    email: user?.email ? `${user.email.substring(0, 3)}***@${user.email.split("@")[1]}` : "ali***@sinex.com",
    phone: "+234 814 **** 597",
    bvn: "222****4444",
    nin: "111****3333",
    kycLevel: "Tier 3 Institutional Verified",
    classification: "Corporate / Business Entity",
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-cyan-500/20 p-6 rounded-3xl text-white shadow-xl flex items-center gap-6">
        <img
          src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profileData.name)}`}
          alt="Investor Profile"
          className="w-20 h-20 rounded-3xl border-2 border-cyan-400 shadow-xl"
        />
        <div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 mb-2">
            <FaCheckCircle /> {profileData.kycLevel}
          </span>
          <h1 className="text-2xl font-black text-white">{profileData.name}</h1>
          <p className="text-xs text-slate-400">{profileData.classification}</p>
        </div>
      </div>

      <div className={`p-6 rounded-3xl border shadow-xl space-y-6 ${
        theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-[#111827] border-slate-800 text-white"
      }`}>
        <h3 className="font-extrabold text-lg flex items-center gap-2 border-b border-slate-800/80 pb-4">
          <FaShieldAlt className="text-cyan-400" /> Masked Compliance Identity Record
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
              <FaEnvelope className="text-cyan-400" /> Email Address
            </span>
            <p className="font-mono text-sm text-white font-bold">{profileData.email}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
              <FaPhone className="text-cyan-400" /> Phone Number
            </span>
            <p className="font-mono text-sm text-white font-bold">{profileData.phone}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
              <FaFingerprint className="text-cyan-400" /> BVN Number
            </span>
            <p className="font-mono text-sm text-cyan-400 font-bold">{profileData.bvn}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
              <FaIdCard className="text-cyan-400" /> NIN Number
            </span>
            <p className="font-mono text-sm text-cyan-400 font-bold">{profileData.nin}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorProfile;