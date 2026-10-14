import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { ThemeContext } from "../../context/ThemeContext";
import { FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import Logo from "../../assets/logo.png";
import coinNav from "../../assets/coinNav.png";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const Navbar = () => {
  const { user, userSignOut } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleLogoutUser = () => {
    closeMenu();
    userSignOut().then(() => {
      navigate("/login");
    });
  };

  // Real balance from the server (the old address no longer exists, so it always showed 0)
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

  const name = user?.displayName || "";
  const avatar = user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || "user")}`;

  const authLinks = (onClick) =>
    user ? (
      <div className="flex items-center gap-3">
        <img className="w-9 h-9 rounded-full object-cover ring-2 ring-[#00d7c0]/40" src={avatar} alt="User Profile" referrerPolicy="no-referrer" />
        {me?.role !== "Admin" && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#00d7c0]/10 border border-[#00d7c0]/30 rounded-full">
            <img src={coinNav} className="w-4 h-4 object-contain" alt="Wallet" />
            <span className="text-xs font-bold text-[#00d7c0]">{me?.coin ?? 0} Coins</span>
          </div>
        )}
        <button onClick={handleLogoutUser} className="text-sm font-semibold text-rose-400 hover:text-rose-300">
          Logout
        </button>
      </div>
    ) : (
      <div className="flex items-center gap-3">
        <NavLink to="/login" onClick={onClick} className={linkCls}>Login</NavLink>
        <NavLink to="/register" onClick={onClick}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-[#00a896] to-[#00d7c0] text-slate-950 text-sm font-extrabold shadow-lg shadow-[#00d7c0]/20">
          Register
        </NavLink>
      </div>
    );

  return (
    <header className="fixed top-0 inset-x-0 z-20 bg-[#0B0F19]/85 backdrop-blur-xl border-b border-slate-800/80 text-slate-100">
      <div className="w-11/12 max-w-6xl mx-auto py-3">
        <div className="flex justify-between items-center">
          {/* Logo & Brand Name */}
          <NavLink to="/" onClick={closeMenu} className="flex gap-2.5 items-center">
            <img className="w-10 h-10 rounded-full object-cover border border-[#00d7c0]/50" src={Logo} alt="SINEX Logo" />
            <h2 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-white to-[#00d7c0] bg-clip-text text-transparent">SINEX</h2>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center justify-center gap-6">
            {commonLinks()}
            {authLinks()}
            <button onClick={toggleTheme} className="p-2 rounded-full text-slate-300 hover:text-white focus:outline-none">
              {theme === "dark" ? <FaSun size={20} className="text-amber-400" /> : <FaMoon size={20} />}
            </button>
          </div>

          {/* Mobile Toggle Buttons */}
          <div className="lg:hidden flex items-center gap-1">
            <button onClick={toggleTheme} className="p-2 rounded-full text-slate-300 focus:outline-none">
              {theme === "dark" ? <FaSun size={20} className="text-amber-400" /> : <FaMoon size={20} />}
            </button>
            <button onClick={() => setIsMobileMenuOpen((o) => !o)} className="p-2 rounded-full text-slate-200 focus:outline-none" aria-label="Menu">
              {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pb-1">
            <div className="flex flex-col gap-4 p-5 rounded-3xl bg-[#111827] border border-slate-800 shadow-2xl">
              {commonLinks(closeMenu)}
              <div className="pt-3 border-t border-slate-800">{authLinks(closeMenu)}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;