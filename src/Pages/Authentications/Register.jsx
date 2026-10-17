import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../components/AuthProvider/AuthProvider";
import toast from "react-hot-toast";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash, FaPhoneAlt, FaChartLine } from "react-icons/fa";
import {
  MdPerson,
  MdEmail,
  MdLock,
  MdPersonAdd,
  MdInfo,
  MdCheck,
  MdVerifiedUser,
  MdCardGiftcard,
} from "react-icons/md";
import CustomCursor from "../../components/CustomCursor/CustomCursor";
import { getAuthErrorMessage } from "../../utils/authError";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const avatarFor = (name = "user") =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

const inputCls =
  "w-full rounded-2xl bg-[#0B0F19] border border-slate-800 text-white placeholder-slate-600 pl-12 pr-4 py-3.5 text-sm outline-none focus:border-[#00d7c0] focus:ring-2 focus:ring-[#00d7c0]/20";
const labelCls = "block mb-1.5 text-xs font-semibold text-slate-300";
const errCls = "text-red-400 text-xs mt-1";
const iconCls = "absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg";
const primaryBtn =
  "w-full rounded-full bg-gradient-to-r from-[#00a896] to-[#00d7c0] text-slate-950 font-extrabold py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-[#00d7c0]/20 active:scale-[0.99] disabled:opacity-60 cursor-pointer";

const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [showPassword, setShowPassword] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [pending, setPending] = useState(null);
  const [strength, setStrength] = useState({ label: "Weak", color: "bg-red-500", progress: 0 });
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const refFromLink = (
    params.get("ref") || localStorage.getItem("sinex_ref") || ""
  ).toUpperCase();

  useEffect(() => {
    if (params.get("ref")) localStorage.setItem("sinex_ref", params.get("ref"));
  }, [params]);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { referralCode: refFromLink } });

  const explain = (err) => {
    const base = axiosSecure.defaults.baseURL;
    if (!err.response)
      return `Cannot reach the server at ${base}. Start the backend, and make sure this site's address is listed in CLIENT_ORIGINS on the server.`;
    const { status, data } = err.response;
    if (status === 401)
      return "The server rejected your login token. Check the Firebase service account in the server .env.";
    if (status === 404)
      return `The server has no route ${err.config?.url} (base URL ${base}). Check the base URL in useAxiosSecure.`;
    return `${data?.message || "Server error"} (status ${status})`;
  };

  const saveUser = async (userData) => {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await axiosSecure.post("/api/users", userData);
        setSyncError("");
        return true;
      } catch (err) {
        console.warn("Backend user save failed:", err);
        const retryable = !err.response || err.response.status >= 500;
        if (!retryable || attempt === 3) {
          setSyncError(explain(err));
          return false;
        }
        await new Promise((r) => setTimeout(r, attempt * 1500));
      }
    }
  };

  const retrySave = async () => {
    if (!pending) return;
    if (await saveUser(pending)) {
      toast.success("Profile saved!");
      setPending(null);
      navigate("/dashboard");
    }
  };

  const { onChange: rhfOnChange, ...passwordReg } = register("password", {
    required: "Password is required",
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
      message: "At least 6 characters with uppercase & lowercase letters",
    },
  });

  const evaluateStrength = (pw) => {
    let score = 0;
    if (pw.length >= 6) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[!@#$%^&*]/.test(pw)) score++;
    if (!pw || score <= 2)
      setStrength({ label: "Weak", color: "bg-red-500", progress: pw ? 25 : 0 });
    else if (score === 3)
      setStrength({ label: "Medium", color: "bg-yellow-500", progress: 50 });
    else setStrength({ label: "Strong", color: "bg-green-500", progress: 100 });
  };

  const onSubmit = async ({ name, email, phone, password, role, referralCode }) => {
    const photoURL = avatarFor(name);

    try {
      await createUser(email, password);
      await updateUserProfile({ displayName: name, photoURL });
      const profile = {
        name,
        email,
        phone,
        photo: photoURL,
        role,
        ...(referralCode?.trim() ? { referralCode: referralCode.trim() } : {}),
      };
      const saved = await saveUser(profile);
      if (!saved) {
        setPending(profile);
        return;
      }
      toast.success(
        `Welcome to SINEX! Registered as ${
          role === "Buyer" ? "Client / Business" : "Worker"
        }.`
      );
      reset();
      localStorage.removeItem("sinex_ref");
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(getAuthErrorMessage(error));
    }
  };

  const handleGoogleRegister = async () => {
    const role = getValues("role");
    if (!role)
      return toast.error("Choose an account type first, then continue with Google.");
    try {
      const { user } = await signInWithGoogle();
      const code = (getValues("referralCode") || "").trim();
      const profile = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL || avatarFor(user.displayName),
        role,
        ...(code ? { referralCode: code } : {}),
      };
      const saved = await saveUser(profile);
      if (!saved) {
        setPending(profile);
        return;
      }
      toast.success("Registered successfully with Google!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Google auth error:", error);
      toast.error(getAuthErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex justify-center px-4 py-8">
      <CustomCursor />
      <div className="w-full max-w-md space-y-5 text-slate-100">
        {/* Investor Switch Banner */}
        <div className="rounded-2xl p-4 bg-gradient-to-r from-cyan-900/40 via-blue-900/30 to-slate-900 border border-cyan-500/30 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00d7c0]/20 text-[#00d7c0] flex items-center justify-center">
              <FaChartLine className="text-xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Are you an Investor?</p>
              <p className="text-[11px] text-slate-400">Access portfolio capital management</p>
            </div>
          </div>
          <NavLink
            to="/investor-register"
            className="px-3.5 py-1.5 rounded-full bg-[#00d7c0] text-slate-950 text-xs font-extrabold hover:bg-[#00b8a4] transition-all"
          >
            Investor Portal
          </NavLink>
        </div>

        {/* Header card */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-teal-700 via-[#00a896] to-[#00d7c0] text-slate-950 shadow-xl shadow-[#00d7c0]/15 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center shrink-0">
            <MdPersonAdd className="text-3xl" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold leading-tight">Create Your Account</h1>
            <p className="text-sm font-medium opacity-80">
              Join us today, complete simple tasks, and start unlocking your earning opportunities.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="rounded-3xl bg-[#111827]/90 border border-slate-800 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#00d7c0] text-slate-950 font-extrabold flex items-center justify-center ring-4 ring-[#00d7c0]/20">
                1
              </span>
              <div>
                <p className="text-[10px] font-bold text-slate-500 tracking-widest">STEP 1</p>
                <p className="text-sm font-bold text-[#00d7c0]">Your Details</p>
              </div>
            </div>
            <div className="flex items-center gap-3 opacity-60">
              <span className="w-10 h-10 rounded-full border border-slate-700 text-slate-400 font-extrabold flex items-center justify-center">
                2
              </span>
              <div>
                <p className="text-[10px] font-bold text-slate-500 tracking-widest">STEP 2</p>
                <p className="text-sm font-bold text-slate-400">Dashboard</p>
              </div>
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full mt-4">
            <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#00a896] to-[#00d7c0]" />
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-3xl bg-[#111827]/90 border border-slate-800 p-5 space-y-5">
          {pending && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300 space-y-2">
              <p className="font-semibold">Your account was created, but your profile could not be saved.</p>
              <p>{syncError}</p>
              <button
                type="button"
                onClick={retrySave}
                className="rounded-full bg-[#00d7c0] px-4 py-1.5 font-bold text-slate-950 cursor-pointer"
              >
                Retry saving profile
              </button>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00d7c0]/10 text-[#00d7c0] flex items-center justify-center shrink-0">
              <MdPerson className="text-2xl" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Personal Information</h2>
              <p className="text-xs text-slate-400">
                Enter your basic details to create your account.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className={labelCls}>
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <MdPerson className={iconCls} />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className={inputCls}
                  {...register("name", { required: "Name is required" })}
                />
              </div>
              {errors.name && <p className={errCls}>{errors.name.message}</p>}
            </div>

            <div>
              <label className={labelCls}>
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <MdEmail className={iconCls} />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className={inputCls}
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && <p className={errCls}>{errors.email.message}</p>}
            </div>

            <div>
              <label className={labelCls}>
                Phone Number <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
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
              <label className={labelCls}>
                Account Type <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "Worker", title: "Worker", text: "Complete tasks & earn rewards" },
                  { value: "Buyer", title: "Client / Business", text: "Create campaigns" },
                ].map((r) => (
                  <label key={r.value} className="cursor-pointer">
                    <input
                      type="radio"
                      value={r.value}
                      className="peer sr-only"
                      {...register("role", { required: "Role selection is required" })}
                    />
                    <div className="h-full rounded-2xl border border-slate-800 bg-[#0B0F19] p-3 text-center transition-all peer-checked:border-[#00d7c0] peer-checked:bg-[#00d7c0]/10 peer-checked:ring-2 peer-checked:ring-[#00d7c0]/20">
                      <p className="text-sm font-bold text-white">{r.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{r.text}</p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.role && <p className={errCls}>{errors.role.message}</p>}
            </div>

            <div>
              <label className={labelCls}>
                Create Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <MdLock className={iconCls} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className={`${inputCls} pr-12`}
                  {...passwordReg}
                  onChange={(e) => {
                    rhfOnChange(e);
                    evaluateStrength(e.target.value);
                  }}
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
              <div className="mt-3">
                <div className="h-1.5 w-full bg-slate-800 rounded-full">
                  <div
                    className={`h-full ${strength.color} rounded-full transition-all duration-300`}
                    style={{ width: `${strength.progress}%` }}
                  />
                </div>
                <p className="text-xs mt-1.5 text-slate-400 flex items-center gap-1.5">
                  <MdInfo className="shrink-0" /> {strength.label}. Use letters, numbers & symbols.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Referral Code</label>
                <span className="text-[10px] font-bold tracking-widest text-slate-400 bg-[#0B0F19] border border-slate-800 rounded-full px-2.5 py-0.5">
                  OPTIONAL
                </span>
              </div>
              <div className="relative">
                <MdCardGiftcard className={iconCls} />
                <input
                  type="text"
                  placeholder="Enter referral code"
                  className={`${inputCls} uppercase`}
                  {...register("referralCode")}
                />
              </div>
            </div>

            <div className="pt-1 space-y-3">
              <button type="submit" disabled={isSubmitting} className={primaryBtn}>
                {isSubmitting ? "Creating account..." : "Create Account"}
              </button>
              <button
                type="button"
                onClick={handleGoogleRegister}
                className="w-full rounded-full bg-[#0B0F19] hover:bg-slate-800 border border-slate-800 text-white py-3 flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer"
              >
                <img
                  src="https://i.ibb.co/TvvzXfq/google.png"
                  className="w-5 h-5 object-contain"
                  alt="Google"
                />
                Continue With Google
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <NavLink to="/login" className="text-[#00d7c0] font-bold underline">
            Log In
          </NavLink>
        </p>
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#111827] border border-slate-800 text-[10px] font-bold tracking-widest text-slate-400">
            <MdVerifiedUser className="text-emerald-400" /> SECURE REGISTRATION
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;