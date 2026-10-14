import { Outlet } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar/DashboardNavbar";
import Sidebar from "../components/Sidebar/Sidebar";

import useAuth from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { createContext, useEffect } from "react";
import { io } from "socket.io-client";

export const myInfoContext = createContext();

const DashBoardLayout = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // The server address this build is really using (VITE_BACKEND_URL is baked in when you run `npm run build`)
  const apiRoot = (axiosSecure.defaults.baseURL || "").replace(/\/api\/?$/, "");

  // Is the server reachable from this page? Checked every 15 seconds.
  const { isError: serverDown, refetch: recheck, isFetching } = useQuery({
    queryKey: ["server-health", apiRoot],
    retry: false,
    refetchInterval: 15000,
    queryFn: async () => {
      await axios.get(`${apiRoot}/`, { timeout: 8000 });
      return true;
    },
  });

  // Live socket updates are OFF by default (the server has no socket.io yet).
  // Turn on later with VITE_ENABLE_SOCKET=true once the server supports it.
  useEffect(() => {
    if (import.meta.env.VITE_ENABLE_SOCKET !== "true") return;
    const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000");

    const refreshAll = () => {
      ["open-tasks", "manageTasks", "admin-stats", "myInfo", "user-role", "requests", "users", "buyer-submissions", "my-submissions"].forEach(
        (k) => queryClient.invalidateQueries({ queryKey: [k] })
      );
    };

    const events = ["user:updated", "task:created", "task:deleted", "submission:created", "withdrawal:updated"];
    events.forEach((e) => socket.on(e, refreshAll));
    return () => {
      events.forEach((e) => socket.off(e, refreshAll));
      socket.disconnect();
    };
  }, [queryClient]);

  // Real profile (role, coins) from the backend, refreshed every 8 seconds
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["myInfo", user?.email],
    enabled: !!user?.email,
    queryFn: async () => (await axiosSecure.get(`/users/me/${user.email}`)).data,
    refetchInterval: 8000,
  });

  const myInfo = {
    ...data,
    name: data?.name || user?.displayName,
    email: data?.email || user?.email,
    photo: data?.photo || user?.photoURL,
    coin: data?.coin ?? 0,
  };

  const InfoNav = { myInfo, isLoading, refetch };

  return (
    <myInfoContext.Provider value={InfoNav}>
      {/* Phone shell: full width on phones, centered column on larger screens */}
      <div className="min-h-screen bg-[#05080f] flex justify-center">
        <div className="relative w-full max-w-lg min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col sm:border-x sm:border-slate-800/80">
          <DashboardNavbar myInfo={myInfo} />
          <main className="flex-1 px-4 pt-4 pb-28 overflow-x-hidden bg-gradient-to-b from-[#0B0F19] via-[#0d1322] to-[#0B0F19]">
            {serverDown && (
              <div className="mb-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200 space-y-1.5">
                <p className="font-bold text-sm">Cannot reach the server</p>
                <p className="break-all">This site is trying: <span className="font-mono">{apiRoot}</span></p>
                <p>Check that the backend is running, that <span className="font-mono">VITE_BACKEND_URL</span> was set when the site was built, and that this site's address is in <span className="font-mono">CLIENT_ORIGINS</span> on the server.</p>
                <button onClick={() => recheck()} disabled={isFetching} className="rounded-full bg-rose-500/80 text-white px-3 py-1 font-bold disabled:opacity-60">
                  {isFetching ? "Checking..." : "Try again"}
                </button>
              </div>
            )}
            <Outlet />
          </main>
          <Sidebar />
        </div>
      </div>
    </myInfoContext.Provider>
  );
};

export default DashBoardLayout;
