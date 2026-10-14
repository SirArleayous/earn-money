import React, { useContext, useEffect, useRef, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { MdOutlineNotificationsActive, MdOutlineLogout } from "react-icons/md";
import { FaMoon, FaSun, FaUserFriends } from "react-icons/fa";
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
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [role] = useRole();
  const key = ["notifications", user?.email];

  // Which popover is open: "notif", "profile" or none. Both open under the bar, inside the phone frame.
  const [panel, setPanel] = useState(null);
  useEffect(() => setPanel(null), [location.pathname]); // close when the page changes
  useEffect(() => {
    if (!panel) return;
    const onDown = (e) => {
      if (!e.target.closest("[data-popover]")) setPanel(null); // click or tap outside closes it
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [panel]);

  // Real notifications from the backend, checked every 8 seconds
  const { data: raw } = useQuery({
    queryKey: key,
    enabled: !!user?.email,
    retry: 1,
    refetchInterval: 8000,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/notifications/${user.email}`);
      return Array.isArray(data) ? data : [];
    },
  });
  const notifications = Array.isArray(raw) ? raw : [];
  const unread = notifications.filter((n) => !n.read).length;

  // small toast for notifications that arrived since the last check
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

  // opening the bell marks everything as read (after a moment, so you still see what was new)
  const toggleNotif = () => {
    const opening = panel !== "notif";
    setPanel(opening ? "notif" : null);
    if (opening && unread && user?.email) {
      setTimeout(async () => {
        try {
          await axiosSecure.patch(`/notifications/read/${user.email}`);
          queryClient.setQueryData(key, (old = []) => old.map((n) => ({ ...n, read: true })));
        } catch {
          /* it will retry on the next open */
        }
      }, 1500);
    }
  };

  const handleProfileLogout = async () => {
    setPanel(null);
    await (auth.userSignOut || auth.logOut)?.();
  };

  const name = myInfo?.name || user?.displayName || "";
  const avatar = myInfo?.photo || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || "user")}`;

  // Popover boxes sit under the bar: full width on phones, a fixed width on wider screens
  const box = "absolute top-full mt-2 left-3 right-3 sm:left-auto sm:w-80 z-[3] rounded-2xl bg-[#111827] text-slate-200 border border-slate-800 shadow-2xl";

  return (
    <header className="sticky top-0 z-30 px-4 py-2.5 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="flex items-center justify-between gap-2">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 min-w-0">
          <img src={logo} className="w-8 h-8 rounded-full border border-[#00d7c0]/50" alt="SINEX Logo" />
          <span className="font-extrabold text-base tracking-wide bg-gradient-to-r from-white to-[#00d7c0] bg-clip-text text-transparent truncate">
            SINEX-earn
          </span>
        </NavLink>

        <div className="flex items-center gap-1.5">
          {role !== "Admin" && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#00d7c0]/10 border border-[#00d7c0]/30 rounded-full">
              <BsCoin className="text-[#00d7c0] text-sm" />
              <span className="text-xs font-bold text-[#00d7c0]">{Number(myInfo?.coin ?? 0)}</span>
            </div>
          )}

          {/* Bell */}
          <button data-popover onClick={toggleNotif} aria-label="Notifications"
            className="relative w-9 h-9 flex items-center justify-center rounded-full text-slate-300 hover:bg-slate-800/70">
            <MdOutlineNotificationsActive className="text-xl" />
            {unread > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#00d7c0] text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {/* Theme toggle */}
          <button onClick={toggleTheme} aria-label="Theme" className="w-9 h-9 flex items-center justify-center rounded-full text-slate-300 hover:bg-slate-800/70">
            {theme === "dark" ? <FaSun size={16} className="text-amber-400" /> : <FaMoon size={16} />}
          </button>

          {/* Avatar */}
          <button data-popover onClick={() => setPanel(panel === "profile" ? null : "profile")} aria-label="Account"
            className="w-8 h-8 rounded-full ring-2 ring-[#00d7c0]/40 overflow-hidden bg-slate-800">
            <img className="w-full h-full object-cover" src={avatar} alt="User Profile" />
          </button>
        </div>
      </div>

      {/* Notifications popover */}
      {panel === "notif" && (
        <div data-popover className={`${box} max-h-[70vh] overflow-y-auto p-2`}>
          <div className="text-xs font-bold uppercase text-slate-400 px-3 py-2 border-b border-slate-800">Notifications</div>
          {!notifications.length && <p className="text-xs text-slate-500 px-3 py-5 text-center">No notifications yet</p>}
          {notifications.map((n) => (
            <NavLink
              to={n.actionRoute || "/dashboard"}
              key={n._id}
              className={`flex gap-3 items-start rounded-xl px-3 py-2.5 hover:bg-slate-800/80 transition-colors ${n.read ? "" : "bg-[#00d7c0]/5"}`}
            >
              <div className="p-1.5 bg-[#00d7c0]/10 text-[#00d7c0] rounded-lg mt-0.5 shrink-0">
                <MdOutlineNotificationsActive className="text-base" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-200 break-words">{n.message}</p>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  {new Date(n.time).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              {!n.read && <span className="w-2 h-2 rounded-full bg-[#00d7c0] mt-1.5 shrink-0"></span>}
            </NavLink>
          ))}
        </div>
      )}

      {/* Account popover */}
      {panel === "profile" && (
        <div data-popover className={`${box} sm:w-64 p-2`}>
          <div className="px-3 py-2 border-b border-slate-800">
            <p className="font-bold text-slate-100 truncate">{name}</p>
            <p className="text-xs text-slate-400 truncate">{myInfo?.email || user?.email}</p>
            <span className="inline-block mt-1 text-[11px] text-[#00d7c0] font-semibold">{myInfo?.role || role}</span>
          </div>
          <NavLink to="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-[#00d7c0] hover:bg-slate-800/80">
            <CgProfile className="text-lg" /><span className="text-sm font-medium">Your Profile</span>
          </NavLink>
          <NavLink to="/dashboard/referral" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-[#00d7c0] hover:bg-slate-800/80">
            <FaUserFriends className="text-lg" /><span className="text-sm font-medium">Invite & Earn</span>
          </NavLink>
          <button onClick={handleProfileLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">
            <MdOutlineLogout className="text-lg" /><span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default DashboardNavbar;
