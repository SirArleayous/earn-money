import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../components/AuthProvider/AuthProvider";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaPhoneAlt, FaChartLine } from "react-icons/fa";
import { MdPerson, MdEmail, MdLock, MdShield } from "react-icons/md";
import CustomCursor from "../../components/CustomCursor/CustomCursor";
import { getAuthErrorMessage } from "../../utils/authError";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const inputCls =
  "w-full rounded-2xl bg-[#030712] border border-cyan-900/60 text-white placeholder-slate-500 pl-12 pr-4 py-3.5 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20";
const labelCls = "block mb-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider";
const errCls = "text-rose-400 text-xs mt-1";
const iconCls = "absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-lg";

const InvestorRegister = () => {
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ name, email, phone, password }) => {
    const photoURL = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    try {
      await createUser(email, password);
      await updateUserProfile({ displayName: name, photoURL });

      const investorPayload = {
        name,
        email,
        phone,
        photo: photoURL,
        role: "Investor",
      };

      await axiosSecure.post("/api/users", investorPayload);
      toast.success("Investor Account Created Successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Investor Registration Error:", error);
      toast.error(getAuthErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex justify-center items-center px-4 py-10">
      <CustomCursor />
      <div className="w-full max-w-md space-y-6 text-slate-100">
        {/* Investor Header */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-cyan-500/30 text-white shadow-2xl shadow-cyan-900/20 text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
            <FaChartLine className="text-3xl" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Investor Portal</h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Create an institutional account to deploy liquidity pools and track daily yield dividends.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl bg-[#0B0F19]/90 border border-slate-800 p-6 space-y-5 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className={labelCls}>Full Name</label>
              <div className="relative">
                <MdPerson className={iconCls} />
                <input
                  type="text"
                  placeholder="Enter full legal name"
                  className={inputCls}
                  {...register("name", { required: "Full name is required" })}
                />
              </div>
              {errors.name && <p className={errCls}>{errors.name.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Email Address</label>
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
              <label className={labelCls}>Phone Number</label>
              <div className="relative">
                <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-sm" />
                <input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  className={inputCls}
                  {...register("phone", { required: "Phone number is required" })}
                />
              </div>
              {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Password</label>
              <div className="relative">
                <MdLock className={iconCls} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Set account password"
                  className={`${inputCls} pr-12`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters required" },
                  })}
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
              {isSubmitting ? "Creating Investor Account..." : "Register Investor Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400">
          Already registered as an Investor?{" "}
          <NavLink to="/investor-login" className="text-cyan-400 font-bold underline">
            Investor Sign In
          </NavLink>
        </p>

        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-[10px] font-bold tracking-widest text-cyan-400">
            <MdShield className="text-cyan-400" /> INSTITUTIONAL CAPITAL SUITE
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvestorRegister;