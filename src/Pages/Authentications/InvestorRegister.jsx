import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../components/AuthProvider/AuthProvider";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaEye, 
  FaEyeSlash, 
  FaPhoneAlt, 
  FaChartLine, 
  FaIdCard, 
  FaFingerprint, 
  FaCalendarAlt, 
  FaBriefcase, 
  FaBuilding 
} from "react-icons/fa";
import { MdPerson, MdEmail, MdLock, MdShield } from "react-icons/md";
import CustomCursor from "../../components/CustomCursor/CustomCursor";
import { getAuthErrorMessage } from "../../utils/authError";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const inputCls =
  "w-full rounded-2xl bg-[#030712] border border-cyan-900/60 text-white placeholder-slate-500 pl-11 pr-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all";
const labelCls = "block mb-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider";
const errCls = "text-rose-400 text-xs mt-1 font-medium";
const iconCls = "absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-base";

const InvestorRegister = () => {
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const passwordValue = watch("password");

  const onSubmit = async ({
    name,
    email,
    phone,
    bvn,
    nin,
    dob,
    sourceOfFunds,
    investorType,
    password,
  }) => {
    const photoURL = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    try {
      await createUser(email, password);
      await updateUserProfile({ displayName: name, photoURL });

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
      };

      await axiosSecure.post("/api/users", investorPayload);
      toast.success("Investor Account Registered Successfully!");
      navigate("/dashboard/investor");
    } catch (error) {
      console.error("Investor Registration Error:", error);
      toast.error(getAuthErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex justify-center items-center px-4 py-10">
      <CustomCursor />
      <div className="w-full max-w-3xl space-y-6 text-slate-100">
        
        {/* Header Card */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-cyan-500/30 text-white shadow-2xl shadow-cyan-900/20 text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
            <FaChartLine className="text-2xl" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Institutional Investor Portal</h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Complete the 10-point institutional verification form to access high-yield capital liquidity pools.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl bg-[#0B0F19]/90 border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Desktop: 2-Column Grid / Mobile: Stacked */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Field 1: Full Legal Name */}
              <div>
                <label className={labelCls}>1. Full Legal Name</label>
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

              {/* Field 2: Email Address */}
              <div>
                <label className={labelCls}>2. Email Address</label>
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

              {/* Field 3: Phone Number */}
              <div>
                <label className={labelCls}>3. Phone Number</label>
                <div className="relative">
                  <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-xs" />
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    className={inputCls}
                    {...register("phone", { required: "Phone number is required" })}
                  />
                </div>
                {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
              </div>

              {/* Field 4: Date of Birth */}
              <div>
                <label className={labelCls}>4. Date of Birth</label>
                <div className="relative">
                  <FaCalendarAlt className={iconCls} />
                  <input
                    type="date"
                    className={`${inputCls} [color-scheme:dark]`}
                    {...register("dob", { required: "Date of Birth is required" })}
                  />
                </div>
                {errors.dob && <p className={errCls}>{errors.dob.message}</p>}
              </div>

              {/* Field 5: BVN Verification */}
              <div>
                <label className={labelCls}>5. BVN Verification</label>
                <div className="relative">
                  <FaFingerprint className={iconCls} />
                  <input
                    type="text"
                    maxLength={11}
                    placeholder="11-digit BVN"
                    className={inputCls}
                    {...register("bvn", {
                      required: "BVN is required",
                      minLength: { value: 11, message: "BVN must be exactly 11 digits" },
                      maxLength: { value: 11, message: "BVN must be exactly 11 digits" },
                      pattern: { value: /^[0-9]+$/, message: "BVN must contain digits only" },
                    })}
                  />
                </div>
                {errors.bvn && <p className={errCls}>{errors.bvn.message}</p>}
              </div>

              {/* Field 6: NIN Verification */}
              <div>
                <label className={labelCls}>6. NIN Verification</label>
                <div className="relative">
                  <FaIdCard className={iconCls} />
                  <input
                    type="text"
                    maxLength={11}
                    placeholder="11-digit NIN"
                    className={inputCls}
                    {...register("nin", {
                      required: "NIN is required",
                      minLength: { value: 11, message: "NIN must be exactly 11 digits" },
                      maxLength: { value: 11, message: "NIN must be exactly 11 digits" },
                      pattern: { value: /^[0-9]+$/, message: "NIN must contain digits only" },
                    })}
                  />
                </div>
                {errors.nin && <p className={errCls}>{errors.nin.message}</p>}
              </div>

              {/* Field 7: Source of Funds */}
              <div>
                <label className={labelCls}>7. Primary Source of Capital</label>
                <div className="relative">
                  <FaBriefcase className={iconCls} />
                  <select
                    className={`${inputCls} appearance-none bg-[#030712] cursor-pointer`}
                    {...register("sourceOfFunds", { required: "Select source of capital" })}
                  >
                    <option value="">Select capital origin</option>
                    <option value="Salary & Savings">Salary & Savings</option>
                    <option value="Business Profits">Business Profits</option>
                    <option value="Trading & Crypto Yield">Trading & Investment Yield</option>
                    <option value="Institutional Equity">Institutional / Corporate Equity</option>
                  </select>
                </div>
                {errors.sourceOfFunds && <p className={errCls}>{errors.sourceOfFunds.message}</p>}
              </div>

              {/* Field 8: Investor Classification */}
              <div>
                <label className={labelCls}>8. Investor Classification</label>
                <div className="relative">
                  <FaBuilding className={iconCls} />
                  <select
                    className={`${inputCls} appearance-none bg-[#030712] cursor-pointer`}
                    {...register("investorType", { required: "Select investor classification" })}
                  >
                    <option value="">Select account classification</option>
                    <option value="Retail Investor">Individual Retail Investor</option>
                    <option value="High-Net-Worth (HNWI)">High-Net-Worth Individual (HNWI)</option>
                    <option value="Corporate / Entity">Corporate / Business Entity</option>
                  </select>
                </div>
                {errors.investorType && <p className={errCls}>{errors.investorType.message}</p>}
              </div>

              {/* Field 9: Password */}
              <div>
                <label className={labelCls}>9. Account Password</label>
                <div className="relative">
                  <MdLock className={iconCls} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Set secure password"
                    className={`${inputCls} pr-12`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters required" },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className={errCls}>{errors.password.message}</p>}
              </div>

              {/* Field 10: Confirm Password */}
              <div>
                <label className={labelCls}>10. Confirm Password</label>
                <div className="relative">
                  <MdLock className={iconCls} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm account password"
                    className={`${inputCls} pr-12`}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (val) => val === passwordValue || "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <p className={errCls}>{errors.confirmPassword.message}</p>}
              </div>

            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all mt-4 text-sm"
            >
              {isSubmitting ? "Submitting 10-Point Verification..." : "Complete Institutional Registration"}
            </button>
          </form>
        </div>

        {/* Footer Navigation */}
        <p className="text-center text-xs text-slate-400">
          Already registered as an Investor?{" "}
          <NavLink to="/investor-login" className="text-cyan-400 font-bold underline">
            Investor Sign In
          </NavLink>
        </p>

        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-[10px] font-bold tracking-widest text-cyan-400">
            <MdShield className="text-cyan-400" /> 10-POINT INSTITUTIONAL IDENTITY VERIFIED
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvestorRegister;