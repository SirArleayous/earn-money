import React, { useContext, useEffect, useRef, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { MdOutlineNotificationsActive, MdOutlineLogout } from "react-icons/md";
import { FaMoon, FaSun } from "react-icons/fa";
import useRole from "../../Hooks/useRole";
import { BsCoin } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { ThemeContext } from "../../context/ThemeContext";
import logo from "../../assets/logo.png";

const DashboardNavbar = ({ myInfo }) => {
  const auth = useAuth();
  const { user } = auth;
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [role] = useRole();
  const key = ["notifications", user?.email];

  // State control for popovers (Hidden by default)
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Real notifications query
  const { data: notifications = [] } = useQuery({
    queryKey: key,
    enabled: !!user?.email,
    retry: 1,
    refetchInterval: 8000,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/notifications/${user.email}`);
      return Array.isArray(data) ? data : [];
    },
  });

  const unread = notifications.filter((n) => !n.read).length;

  const lastSeen = useRef(null);
  useEffect(() => {
    if (!notifications.length) return;
    const newest = notifications[0]._id;
    if (lastSeen.current && lastSeen.current !== newest) {
      const idx = notifications.findIndex((n) => n._id === lastSeen.current);
      const fresh = idx === -1 ? notifications : notifications.slice(0, idx);
      fresh.filter((n) => !n.read).slice(0, 3).forEach((n) => toast(n.message, { icon: "🔔" }));
    }
    lastSeen.current = newest;
  }, [notifications]);

  const markRead = () => {
    if (!unread || !user?.email) return;
    setTimeout(async () => {
      try {
        await axiosSecure.patch(`/notifications/read/${user.email}`);
        queryClient.setQueryData(key, (old = []) => old.map((n) => ({ ...n, read: true })));
      } catch {
        /* silent retry */
      }
    }, 1500);
  };

  const handleProfileLogout = async () => {
    setShowProfileMenu(false);
    await (auth.userSignOut || auth.logOut)?.();
  };

  const name = myInfo?.name || user?.displayName || "";
  const avatar = myInfo?.photo || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || "user")}`;

  return (
    <header ref={navRef} className="sticky top-0 z-40 flex items-center justify-between gap-2 px-4 py-2.5 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800/80 text-slate-100">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2 min-w-0">
        <img src={logo} className="w-8 h-8 rounded-full border border-[#00d7c0]/50" alt="SINEX Logo" />
        <span className="font-extrabold text-base tracking-wide bg-gradient-to-r from-white to-[#00d7c0] bg-clip-text text-transparent truncate">
          SINEX-earn
        </span>
      </NavLink>

      <div className="flex items-center gap-2">
        {/* Coin Balance */}
        {role !== "Admin" && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#00d7c0]/10 border border-[#00d7c0]/30 rounded-full">
            <BsCoin className="text-[#00d7c0] text-sm" />
            <span className="text-xs font-bold text-[#00d7c0]">{Number(myInfo?.coin ?? 0)}</span>
          </div>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
              markRead();
            }} 
            className="p-2 text-slate-300 hover:text-[#00d7c0] rounded-full hover:bg-slate-800/60 transition relative"
          >
            <MdOutlineNotificationsActive className="text-xl" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#00d7c0]"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 max-h-80 overflow-y-auto">
              <div className="text-xs font-bold uppercase text-slate-400 px-3 py-2 border-b border-slate-800">Notifications</div>
              {!notifications.length && <p className="text-xs text-slate-500 px-3 py-4 text-center">No notifications yet</p>}
              {notifications.map((n) => (
                <NavLink
                  to={n.actionRoute || "/dashboard"}
                  onClick={() => setShowNotifications(false)}
                  className={`hover:bg-slate-800/80 rounded-xl px-3 py-2 flex gap-3 items-start transition-colors my-1 ${n.read ? "" : "bg-[#00d7c0]/5"}`}
                  key={n._id}
                >
                  <div className="p-1.5 bg-[#00d7c0]/10 text-[#00d7c0] rounded-lg mt-0.5">
                    <MdOutlineNotificationsActive className="text-base" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-200">{n.message}</p>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      {new Date(n.time).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="p-2 text-slate-300 hover:text-white rounded-full transition-all">
          {theme === "dark" ? <FaSun size={16} className="text-amber-400" /> : <FaMoon size={16} />}
        </button>

        {/* Profile Menu Dropdown */}
        <div className="relative">
          <button 
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="w-8 h-8 rounded-full ring-2 ring-[#00d7c0]/40 overflow-hidden bg-slate-800 cursor-pointer flex items-center justify-center"
          >
            <img className="w-full h-full object-cover" src={avatar} alt="User Profile" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 space-y-1">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="font-bold text-slate-100 truncate">{name}</p>
                <p className="text-xs text-slate-400 truncate">{myInfo?.email || user?.email}</p>
                <span className="text-[11px] text-[#00d7c0] font-medium capitalize">{myInfo?.role || role || "Worker"}</span>
              </div>
              <NavLink 
                to="/dashboard/profile" 
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-[#00d7c0] hover:bg-slate-800/80 rounded-xl text-sm font-medium transition"
              >
                <CgProfile className="text-lg" />
                <span>Your Profile</span>
              </NavLink>
              <button 
                onClick={handleProfileLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl text-sm font-medium transition"
              >
                <MdOutlineLogout className="text-lg" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;