import React, { useContext, useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { ThemeContext } from "../../context/ThemeContext";
import { FaBars, FaTimes, FaMoon, FaSun, FaBell, FaUser, FaSignOutAlt } from "react-icons/fa";
import Logo from "../../assets/logo.png";
import coinNav from "../../assets/coinNav.png";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const Navbar = () => {
  const { user, userSignOut } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Hidden by default on load
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navRef = useRef(null);
  const closeMenu = () => setIsMobileMenuOpen(false);

  // Close popovers on click outside
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

  const handleLogoutUser = () => {
    closeMenu();
    setShowProfileMenu(false);
    userSignOut().then(() => {
      navigate("/login");
    });
  };

  // Real balance query from server
  const { data: me = {} } = useQuery({
    queryKey: ["UserCoin", user?.email],
    enabled: !!user?.email,
    refetchInterval: 15000,
    queryFn: async () => (await axiosSecure.get(`/api/users/me/${user.email}`)).data || {},
  });

  const linkCls = ({ isActive }) =>
    `font-semibold transition-colors hover:text-[#00d7c0] ${isActive ? "text-[#00d7c0]" : "text-slate-200"}`;

  const commonLinks = (onClick) => (
    <>
      <NavLink to="/" onClick={onClick} className={linkCls}>Home</NavLink>
      <NavLink to="/about" onClick={onClick} className={linkCls}>About</NavLink>
      <NavLink to="/contact" onClick={onClick} className={linkCls}>Contact</NavLink>
      {user && <NavLink to="/dashboard" onClick={onClick} className={linkCls}>Dashboard</NavLink>}
    </>
  );

  const name = user?.displayName || me?.name || "User";
  const avatar = user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

  return (
    <header ref={navRef} className="fixed top-0 inset-x-0 z-50 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800 text-slate-100">
      <div className="w-11/12 max-w-6xl mx-auto py-3">
        <div className="flex justify-between items-center">
          {/* Logo & Brand Name */}
          <NavLink to="/" onClick={closeMenu} className="flex gap-2.5 items-center">
            <img className="w-10 h-10 rounded-full object-cover border border-[#00d7c0]/50" src={Logo} alt="SINEX Logo" />
            <h2 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-white to-[#00d7c0] bg-clip-text text-transparent">SINEX</h2>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {commonLinks()}

            {/* Wallet Coin Display */}
            {user && me?.role !== "Admin" && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#00d7c0]/10 border border-[#00d7c0]/30 rounded-full">
                <img src={coinNav} className="w-4 h-4 object-contain" alt="Coins" />
                <span className="text-xs font-bold text-[#00d7c0]">{me?.coin ?? 0}</span>
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                {/* Notification Dropdown Wrapper */}
                <div className="relative">
                  <button 
                    onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                    className="p-2 text-slate-300 hover:text-[#00d7c0] rounded-full hover:bg-slate-800/60 transition"
                  >
                    <FaBell size={18} />
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-72 bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-4 z-50">
                      <div className="border-b border-slate-800 pb-2 mb-2 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Notifications</span>
                      </div>
                      <p className="text-xs text-slate-400 py-6 text-center">No new notifications</p>
                    </div>
                  )}
                </div>

                {/* Profile Menu Dropdown Wrapper */}
                <div className="relative">
                  <button 
                    onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                    className="flex items-center gap-2 p-0.5 rounded-full ring-2 ring-[#00d7c0]/40 hover:ring-[#00d7c0] transition"
                  >
                    <img className="w-8 h-8 rounded-full object-cover" src={avatar} alt="Profile" referrerPolicy="no-referrer" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-3 w-56 bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-3 z-50">
                      <div className="px-3 py-2 border-b border-slate-800/80 mb-2">
                        <p className="text-sm font-bold text-slate-100 truncate">{name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <div className="space-y-1">
                        <NavLink 
                          to="/dashboard" 
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-[#00d7c0] hover:bg-slate-800/50 rounded-xl transition"
                        >
                          <FaUser size={14} /> Your Profile
                        </NavLink>
                        <button 
                          onClick={handleLogoutUser}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                        >
                          <FaSignOutAlt size={14} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink to="/login" className={linkCls}>Login</NavLink>
                <NavLink to="/register" className="px-5 py-2 rounded-full bg-gradient-to-r from-[#00a896] to-[#00d7c0] text-slate-950 text-sm font-extrabold shadow-lg shadow-[#00d7c0]/20">
                  Register
                </NavLink>
              </div>
            )}

            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-full text-slate-300 hover:text-white">
              {theme === "dark" ? <FaSun size={18} className="text-amber-400" /> : <FaMoon size={18} />}
            </button>
          </div>

          {/* Mobile Toggle Buttons */}
          <div className="lg:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full text-slate-300">
              {theme === "dark" ? <FaSun size={18} className="text-amber-400" /> : <FaMoon size={18} />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-full text-slate-200">
              {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3">
            <div className="flex flex-col gap-4 p-5 rounded-3xl bg-[#111827] border border-slate-800 shadow-2xl">
              {commonLinks(closeMenu)}
              <div className="pt-3 border-t border-slate-800">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img className="w-9 h-9 rounded-full object-cover ring-2 ring-[#00d7c0]/40" src={avatar} alt="Profile" />
                      <div>
                        <p className="text-sm font-bold text-slate-100">{name}</p>
                        <p className="text-xs text-slate-400">{user?.email}</p>
                      </div>
                    </div>
                    <button onClick={handleLogoutUser} className="w-full text-left py-2 text-sm font-semibold text-rose-400">
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <NavLink to="/login" onClick={closeMenu} className={linkCls}>Login</NavLink>
                    <NavLink to="/register" onClick={closeMenu} className="text-center py-2 rounded-full bg-gradient-to-r from-[#00a896] to-[#00d7c0] text-slate-950 font-bold">
                      Register
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;