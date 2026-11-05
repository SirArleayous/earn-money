import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../components/AuthProvider/AuthProvider";
import toast from "react-hot-toast";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash, FaChartLine } from "react-icons/fa";
import { MdEmail, MdLock, MdShield } from "react-icons/md";
import CustomCursor from "../../components/CustomCursor/CustomCursor";
import { getAuthErrorMessage } from "../../utils/authError";

const inputCls =
  "w-full rounded-2xl bg-[#030712] border border-cyan-900/60 text-white placeholder-slate-500 pl-12 pr-4 py-3.5 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20";
const labelCls = "block mb-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider";
const errCls = "text-rose-400 text-xs mt-1";
const iconCls = "absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-lg";

const InvestorLogin = () => {
  const { createSignInUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    try {
      localStorage.removeItem("sinex_user_role");
      await createSignInUser(email, password);
      toast.success("Investor Portal Access Granted!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Investor Login Error:", error);
      toast.error(getAuthErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex justify-center items-center px-4 py-10">
      <CustomCursor />
      <div className="w-full max-w-md space-y-6 text-slate-100">
        <div className="rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-cyan-500/30 text-white shadow-2xl shadow-cyan-900/20 text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
            <FaChartLine className="text-3xl" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Investor Sign In</h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Access real-time portfolio metrics, active liquidity pools, and dividend logs.
          </p>
        </div>

        <div className="rounded-3xl bg-[#0B0F19]/90 border border-slate-800 p-6 space-y-5 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className={labelCls}>Investor Email</label>
              <div className="relative">
                <MdEmail className={iconCls} />
                <input
                  type="email"
                  placeholder="investor@domain.com"
                  className={inputCls}
                  {...register("email", { required: "Email address is required" })}
                />
              </div>
              {errors.email && <p className={errCls}>{errors.email.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Password</label>
              <div className="relative">
                <MdLock className={iconCls} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className={`${inputCls} pr-12`}
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className={errCls}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all"
            >
              {isSubmitting ? "Authenticating..." : "Sign In To Investor Suite"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400">
          New Investor?{" "}
          <NavLink to="/investor-register" className="text-cyan-400 font-bold underline">
            Register Institutional Account
          </NavLink>
        </p>

        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-[10px] font-bold tracking-widest text-cyan-400">
            <MdShield className="text-cyan-400" /> SECURE INVESTOR GATEWAY
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvestorLogin;