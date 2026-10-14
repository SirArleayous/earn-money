import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";
import { MdEmail, MdLockReset, MdArrowBack, MdMarkEmailRead } from "react-icons/md";
import CustomCursor from "../../components/CustomCursor/CustomCursor";
import { getAuthErrorMessage } from "../../utils/authError";

const inputCls =
  "w-full rounded-2xl bg-[#0B0F19] border border-slate-800 text-white placeholder-slate-600 pl-12 pr-4 py-3.5 text-sm outline-none focus:border-[#00d7c0] focus:ring-2 focus:ring-[#00d7c0]/20";

const ForgotPassword = () => {
  const [sentTo, setSentTo] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Firebase sends the reset email (you can edit its text in Firebase console > Authentication > Templates)
  const onSubmit = async ({ email }) => {
    const clean = email.trim();
    try {
      await sendPasswordResetEmail(getAuth(), clean);
      setSentTo(clean);
    } catch (error) {
      // Do not reveal whether an email has an account
      if (error.code === "auth/user-not-found") {
        setSentTo(clean);
        return;
      }
      console.error("Reset error:", error);
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
            <MdLockReset className="text-3xl" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold leading-tight">Forgot Password?</h1>
            <p className="text-sm font-medium opacity-80">No problem. Enter your email and we will send you a link to choose a new password.</p>
          </div>
        </div>

        <div className="rounded-3xl bg-[#111827]/90 border border-slate-800 p-5 space-y-5">
          {sentTo ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <MdMarkEmailRead className="text-3xl" />
              </div>
              <h2 className="text-lg font-extrabold text-white">Check your email</h2>
              <p className="text-sm text-slate-400">
                If an account exists for <strong className="text-slate-200 break-all">{sentTo}</strong>, a reset link is on its way.
                It can take a minute. Check your spam folder too.
              </p>
              <button onClick={() => setSentTo("")} className="text-sm font-bold text-[#00d7c0] underline">
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                  <input type="email" placeholder="Enter your email address" className={inputCls}
                    {...register("email", { required: "Email is required" })} />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting}
                className="w-full rounded-full bg-gradient-to-r from-[#00a896] to-[#00d7c0] text-slate-950 font-extrabold py-3.5 shadow-lg shadow-[#00d7c0]/20 active:scale-[0.99] disabled:opacity-60">
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm">
          <NavLink to="/login" className="inline-flex items-center gap-1.5 text-[#00d7c0] font-bold underline">
            <MdArrowBack /> Back to Log In
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;