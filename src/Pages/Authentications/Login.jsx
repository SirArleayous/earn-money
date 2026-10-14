import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../components/AuthProvider/AuthProvider";
import toast from "react-hot-toast";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail, MdLock, MdLogin, MdPersonOutline } from "react-icons/md";
import CustomCursor from "../../components/CustomCursor/CustomCursor";
import { getAuthErrorMessage } from "../../utils/authError";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";

const inputCls =
  "w-full rounded-2xl bg-[#0B0F19] border border-slate-800 text-white placeholder-slate-600 pl-12 pr-4 py-3.5 text-sm outline-none focus:border-[#00d7c0] focus:ring-2 focus:ring-[#00d7c0]/20";
const labelCls = "block mb-1.5 text-xs font-semibold text-slate-300";
const errCls = "text-red-400 text-xs mt-1";
const iconCls = "absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg";

const Login = () => {
  const { createSignInUser, signInWithGoogle } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const refreshProfile = (email) => {
    queryClient.invalidateQueries({ queryKey: ["user-role", email] });
    queryClient.invalidateQueries({ queryKey: ["myInfo", email] });
  };

  const onSubmit = async ({ email, password }) => {
    try {
      // Remove stale local role so fresh role is fetched from DB
      localStorage.removeItem("sinex_user_role");
      await createSignInUser(email, password);
      refreshProfile(email);
      toast.success("Login successful! Welcome to SINEX.");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      toast.error(getAuthErrorMessage(error));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      localStorage.removeItem("sinex_user_role");
      const { user } = await signInWithGoogle();

      await axiosSecure
        .post("/users", { name: user.displayName, email: user.email, photo: user.photoURL, role: "Worker", coin: 10 })
        .catch((e) => console.warn("Backend user sync failed:", e.message));

      refreshProfile(user.email);

      toast.success("Google login successful!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(getAuthErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex justify-center px-4 py-8">
      <CustomCursor />
      <div className="w-full max-w-md space-y-5 text-slate-100">
        {/* Header card */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-teal-700 via-[#00a896] to-[#00d7c0] text-slate-950 shadow-xl shadow-[#00d7c0]/15 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center shrink-0">
            <MdLogin className="text-3xl" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold leading-tight">Welcome Back</h1>
            <p className="text-sm font-medium opacity-80">Log in to your account to continue your activities and track your earnings.</p>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-3xl bg-[#111827]/90 border border-slate-800 p-5 space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00d7c0]/10 text-[#00d7c0] flex items-center justify-center shrink-0">
              <MdPersonOutline className="text-2xl" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Secure Login</h2>
              <p className="text-xs text-slate-400">Enter your credentials to access your dashboard.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className={labelCls}>Email Address</label>
              <div className="relative">
                <MdEmail className={iconCls} />
                <input type="email" placeholder="Enter your email address" className={inputCls}
                  {...register("email", { required: "Email is required" })} />
              </div>
              {errors.email && <p className={errCls}>{errors.email.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Password</label>
              <div className="relative">
                <MdLock className={iconCls} />
                <input type={showPassword ? "text" : "password"} placeholder="Enter your password"
                  className={`${inputCls} pr-12`}
                  {...register("password", { required: "Password is required" })} />
                <button type="button" onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className={errCls}>{errors.password.message}</p>}
            </div>

            {/* "Remember me" is only for show for now */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-[#00d7c0]" />
                Remember me
              </label>
              <NavLink to="/forgot-password" className="text-xs font-bold text-[#00d7c0] underline">
                Forgot Password?
              </NavLink>
            </div>

            <div className="pt-1 space-y-3">
              <button type="submit" disabled={isSubmitting}
                className="w-full rounded-full bg-gradient-to-r from-[#00a896] to-[#00d7c0] text-slate-950 font-extrabold py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-[#00d7c0]/20 active:scale-[0.99] disabled:opacity-60">
                <MdLogin className="text-xl" />
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
              <button type="button" onClick={handleGoogleLogin}
                className="w-full rounded-full bg-[#0B0F19] hover:bg-slate-800 border border-slate-800 text-white py-3 flex items-center justify-center gap-2 text-sm font-semibold">
                <img src="https://i.ibb.co/TvvzXfq/google.png" className="w-5 h-5 object-contain" alt="Google" />
                Continue With Google
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <NavLink to="/register" className="text-[#00d7c0] font-bold underline">Sign Up Instead</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;