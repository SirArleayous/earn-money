import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaWhatsapp, FaShareAlt, FaCopy, FaUserPlus, FaCoins, FaCheckCircle } from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const copyText = async (text, okMsg) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(okMsg);
  } catch {
    // older browsers: select-and-copy fallback
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    toast.success(okMsg);
  }
};

const Referral = () => {
  const axiosSecure = useAxiosSecure();
  const [showAll, setShowAll] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["referrals"],
    refetchInterval: 20000,
    queryFn: async () => (await axiosSecure.get("/api/referrals/me")).data,
  });

  if (isLoading) return <div className="flex justify-center py-20"><span className="loading loading-ring loading-lg"></span></div>;
  if (isError || !data) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-rose-400 text-sm">Could not load your referral details.</p>
        <button onClick={() => refetch()} className="px-5 py-2 rounded-full bg-[#00d7c0] text-slate-950 font-bold text-sm">Try again</button>
      </div>
    );
  }

  const link = `${window.location.origin}/register?ref=${data.code}`;
  const message = `Join me on SINEX-earn and earn coins by completing simple tasks. Sign up with my link: ${link}`;
  const invited = Array.isArray(data.invited) ? data.invited : [];
  const rows = showAll ? invited : invited.slice(0, 5);

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "SINEX-earn", text: message, url: link });
      } catch {
        /* cancelled */
      }
    } else {
      copyText(message, "Invite message copied");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Invite & <span className="text-[#00d7c0]">Earn</span></h2>
        <p className="text-slate-400 text-xs mt-1">Share your link and earn coins for every friend who gets started.</p>
      </div>

      {/* How you earn */}
      <div className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-5 space-y-4">
        <h3 className="font-bold text-white">How you earn</h3>
        <div className="flex gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#00d7c0]/10 text-[#00d7c0] border border-[#00d7c0]/20 flex items-center justify-center shrink-0"><FaCoins /></div>
          <div>
            <p className="font-bold text-white text-sm">+{data.bonus} coins per friend</p>
            <p className="text-xs text-slate-400">When someone you invite finishes their first activity: a worker's first approved task, or a client's first coin purchase.</p>
          </div>
        </div>
        <div className="flex gap-3 opacity-60">
          <div className="w-11 h-11 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0"><FaUserPlus /></div>
          <div>
            <p className="font-bold text-white text-sm">Trust Score & commissions <span className="ml-1 text-[10px] font-bold text-slate-400 border border-slate-700 rounded-full px-2 py-0.5">Soon</span></p>
            <p className="text-xs text-slate-400">More ways to earn from your invites are on the way.</p>
          </div>
        </div>
      </div>

      {/* Link + code */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-400 px-1">Your referral link</p>
        <div className="flex gap-2">
          <div className="flex-1 min-w-0 bg-[#111827] border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-200 truncate">{link}</div>
          <button onClick={() => copyText(link, "Link copied")} className="shrink-0 w-14 rounded-2xl bg-[#00d7c0] text-slate-950 flex items-center justify-center text-lg" aria-label="Copy link">
            <FaCopy />
          </button>
        </div>
        <div className="flex items-center justify-between bg-[#111827] border border-dashed border-slate-700 rounded-2xl px-4 py-3">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-500">YOUR CODE</p>
            <p className="text-lg font-extrabold text-[#00d7c0] tracking-widest">{data.code}</p>
          </div>
          <button onClick={() => copyText(data.code, "Code copied")} className="px-4 py-2 rounded-full bg-slate-800 text-slate-200 text-xs font-bold">Copy code</button>
        </div>
        <a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer"
          className="w-full rounded-2xl bg-[#25d366] text-slate-950 font-extrabold py-3.5 flex items-center justify-center gap-2">
          <FaWhatsapp className="text-xl" /> Share on WhatsApp
        </a>
        <button onClick={share} className="w-full rounded-2xl bg-[#111827] border border-slate-800 text-[#00d7c0] font-bold py-3.5 flex items-center justify-center gap-2">
          <FaShareAlt /> More share options
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Invited", value: data.totals.invited },
          { label: "Rewarded", value: data.totals.rewarded },
          { label: "Coins earned", value: data.totals.earned },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-[#111827]/90 border border-slate-800 p-3 text-center">
            <p className="text-2xl font-extrabold text-white">{s.value}</p>
            <p className="text-[11px] text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Invited people */}
      <div className="space-y-3">
        <h3 className="font-bold text-white">Referred users</h3>
        {invited.length === 0 ? (
          <p className="text-center text-slate-500 text-sm py-6">Nobody has joined with your link yet. Share it to start earning!</p>
        ) : (
          <>
            {rows.map((u, i) => (
              <div key={i} className="bg-[#111827]/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{u.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{u.email} · {u.role === "Buyer" ? "Client" : u.role} · {new Date(u.joined).toLocaleDateString()}</p>
                </div>
                {u.rewarded ? (
                  <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <FaCheckCircle /> +{data.bonus}
                  </span>
                ) : (
                  <span className="shrink-0 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">Pending</span>
                )}
              </div>
            ))}
            {invited.length > 5 && (
              <button onClick={() => setShowAll((v) => !v)} className="w-full text-center text-xs font-bold text-[#00d7c0] py-2">
                {showAll ? "Show less" : `Show all ${invited.length}`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Referral;