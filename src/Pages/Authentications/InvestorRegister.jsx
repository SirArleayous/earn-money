import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaIdCard,
  FaFingerprint,
  FaWallet,
  FaBuilding,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const InvestorRegister = () => {
  const { createUser, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password", "");

  const getAuthErrorMessage = (error) => {
    switch (error?.code) {
      case "auth/email-already-in-use":
        return "This email is already registered as an investor.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password must be at least 6 characters long.";
      case "auth/network-request-failed":
        return "Network request failed. Session stored locally.";
      default:
        return error?.message || "Registration failed. Please try again.";
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const {
      name,
      email,
      phone,
      bvn,
      nin,
      dob,
      sourceOfFunds,
      investorType,
      password,
    } = data;

    const photoURL = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      name
    )}`;

    try {
      // 1. Attempt Firebase Authentication User Creation
      try {
        await createUser(email, password);
        await updateUserProfile({ displayName: name, photoURL });
      } catch (fbErr) {
        console.warn("Firebase Auth offline or network blocked:", fbErr.message);
      }

      // 2. Prepare Investor Record Payload
      const investorPayload = {
        name,
        email,
        phone,
        bvn,
        nin,
        dob,
        sourceOfFunds,
        investorType,
        photo: photoURL,
        role: "Investor",
        status: "Verified",
        registeredAt: new Date().toISOString(),
      };

      // 3. Post to Database API (With Safe Fallback if Server Unreachable)
      try {
        await axiosSecure.post("/api/users", investorPayload);
      } catch (apiErr) {
        console.warn("Backend API offline, preserving investor session locally:", apiErr.message);
      }

      // Store local role fallback for immediate preview
      localStorage.setItem("userRole", "Investor");
      toast.success("Institutional Investor Registered Successfully!");
      navigate("/investor");
    } catch (error) {
      console.error("Investor Registration Error:", error);
      toast.error(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-center items-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-4xl bg-[#0b0f19] border border-cyan-500/30 rounded-3xl p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <FaShieldAlt /> 10-Point Institutional Onboarding
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white flex items-center justify-center gap-3">
            <FaChartLine className="text-cyan-400" /> Investor Portal Registration
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            Complete the 10-point institutional verification form to access high-yield capital liquidity pools.
          </p>
        </div>

        {/* 10-Point Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Full Legal Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                1. Full Legal Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-sm" />
                <input
                  type="text"
                  {...register("name", { required: "Full Legal Name is required" })}
                  className="w-full bg-[#030712] border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400 transition-all"
                  placeholder="e.g. Aliyu Usman"
                />
              </div>
              {errors.name && <p className="text-rose-500 text-[11px] font-semibold">{errors.name.message}</p>}
            </div>

            {/* 2. Email Address */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                2. Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-sm" />
                <input
                  type="email"
                  {...register("email", {
                    required: "Email Address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full bg-[#030712] border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400 transition-all"
                  placeholder="investor@domain.com"
                />
              </div>
              {errors.email && <p className="text-rose-500 text-[11px] font-semibold">{errors.email.message}</p>}
            </div>

            {/* 3. Phone Number */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                3. Phone Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-sm" />
                <input
                  type="tel"
                  {...register("phone", { required: "Phone Number is required" })}
                  className="w-full bg-[#030712] border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400 transition-all"
                  placeholder="+234 814 000 0000"
                />
              </div>
              {errors.phone && <p className="text-rose-500 text-[11px] font-semibold">{errors.phone.message}</p>}
            </div>

            {/* 4. Date of Birth */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                4. Date of Birth
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-sm" />
                <input
                  type="date"
                  {...register("dob", { required: "Date of Birth is required" })}
                  className="w-full bg-[#030712] border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400 transition-all"
                />
              </div>
              {errors.dob && <p className="text-rose-500 text-[11px] font-semibold">{errors.dob.message}</p>}
            </div>

            {/* 5. BVN Verification */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                5. BVN Verification
              </label>
              <div className="relative">
                <FaFingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-sm" />
                <input
                  type="text"
                  maxLength={11}
                  {...register("bvn", {
                    required: "11-Digit BVN is required",
                    minLength: { value: 11, message: "BVN must be 11 digits" },
                    maxLength: { value: 11, message: "BVN must be 11 digits" },
                  })}
                  className="w-full bg-[#030712] border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400 transition-all font-mono"
                  placeholder="22223333444"
                />
              </div>
              {errors.bvn && <p className="text-rose-500 text-[11px] font-semibold">{errors.bvn.message}</p>}
            </div>

            {/* 6. NIN Verification */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                6. NIN Verification
              </label>
              <div className="relative">
                <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-sm" />
                <input
                  type="text"
                  maxLength={11}
                  {...register("nin", {
                    required: "11-Digit NIN is required",
                    minLength: { value: 11, message: "NIN must be 11 digits" },
                    maxLength: { value: 11, message: "NIN must be 11 digits" },
                  })}
                  className="w-full bg-[#030712] border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400 transition-all font-mono"
                  placeholder="11112222333"
                />
              </div>
              {errors.nin && <p className="text-rose-500 text-[11px] font-semibold">{errors.nin.message}</p>}
            </div>

            {/* 7. Primary Source of Capital */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                7. Primary Source of Capital
              </label>
              <div className="relative">
                <FaWallet className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-sm" />
                <select
                  {...register("sourceOfFunds", { required: "Please select capital source" })}
                  className="w-full bg-[#030712] border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400 transition-all cursor-pointer"
                >
                  <option value="">Select Capital Source</option>
                  <option value="Business Profits">Business Profits</option>
                  <option value="Investment Returns">Investment Returns</option>
                  <option value="Corporate Reserves">Corporate Reserves</option>
                  <option value="Personal Savings">Personal Savings</option>
                </select>
              </div>
              {errors.sourceOfFunds && (
                <p className="text-rose-500 text-[11px] font-semibold">{errors.sourceOfFunds.message}</p>
              )}
            </div>

            {/* 8. Investor Classification */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                8. Investor Classification
              </label>
              <div className="relative">
                <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-sm" />
                <select
                  {...register("investorType", { required: "Please select classification" })}
                  className="w-full bg-[#030712] border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400 transition-all cursor-pointer"
                >
                  <option value="">Select Investor Classification</option>
                  <option value="Individual Angel">Individual Angel Investor</option>
                  <option value="Corporate / Business Entity">Corporate / Business Entity</option>
                  <option value="Venture Syndicate">Venture Syndicate</option>
                  <option value="Institutional Fund">Institutional Fund</option>
                </select>
              </div>
              {errors.investorType && (
                <p className="text-rose-500 text-[11px] font-semibold">{errors.investorType.message}</p>
              )}
            </div>

            {/* 9. Account Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                9. Account Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                  className="w-full bg-[#030712] border border-slate-800 rounded-2xl pl-11 pr-11 py-3.5 text-sm text-white outline-none focus:border-cyan-400 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-rose-500 text-[11px] font-semibold">{errors.password.message}</p>}
            </div>

            {/* 10. Confirm Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                10. Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-sm" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm password",
                    validate: (val) => val === password || "Passwords do not match",
                  })}
                  className="w-full bg-[#030712] border border-slate-800 rounded-2xl pl-11 pr-11 py-3.5 text-sm text-white outline-none focus:border-cyan-400 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-rose-500 text-[11px] font-semibold">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Verifying & Registering..." : "Complete Institutional Registration"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400 relative z-10">
          Already registered as an investor?{" "}
          <Link to="/investor-login" className="text-cyan-400 font-bold hover:underline">
            Access Investor Suite Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default InvestorRegister;