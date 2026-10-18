import React, { useContext, useState } from "react";
import { FaCog, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeContext";

const InvestorSettings = () => {
  const { theme } = useContext(ThemeContext);
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currPass || !newPass || !confirmPass) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Security credentials updated successfully!");
    setCurrPass("");
    setNewPass("");
    setConfirmPass("");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-cyan-500/20 p-6 rounded-3xl text-white shadow-xl space-y-2">
        <h1 className="text-2xl md:text-3xl font-black flex items-center gap-3">
          <FaCog className="text-cyan-400" /> Institutional Account Settings
        </h1>
        <p className="text-xs text-slate-400">
          Configure security credentials, notification triggers, and currency display preferences.
        </p>
      </div>

      <div className={`p-6 rounded-3xl border shadow-xl space-y-6 ${
        theme === "light" ? "bg-white border-slate-200 text-slate-900" : "bg-[#111827] border-slate-800 text-white"
      }`}>
        <h3 className="font-extrabold text-base flex items-center gap-2 border-b border-slate-800/80 pb-4">
          <FaLock className="text-cyan-400" /> Update Password Credentials
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Current Password</label>
            <input
              type="password"
              value={currPass}
              onChange={(e) => setCurrPass(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#030712] border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">New Password</label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#030712] border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Confirm New Password</label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#030712] border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            Update Security Credentials
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvestorSettings;