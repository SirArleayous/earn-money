import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Loader, fmtDate } from "./ui";

const DepositRequests = () => {
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-deposits", page],
    queryFn: async () => (await axiosSecure.get("/api/admin/deposits", { params: { page } })).data,
  });

  const handleApprove = async (id) => {
    try {
      await axiosSecure.patch(`/api/admin/deposits/${id}/approve`);
      toast.success("Deposit approved and coins added!");
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection:", "Invalid transaction reference");
    if (reason === null) return;
    try {
      await axiosSecure.patch(`/api/admin/deposits/${id}/reject`, { reason });
      toast.success("Deposit request rejected");
      refetch();
    } catch (err) {
      toast.error("Rejection failed");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="overflow-x-auto bg-slate-900/60 border border-slate-800 rounded-2xl">
      <table className="table w-full text-left text-xs">
        <thead className="bg-slate-950 text-slate-400 uppercase">
          <tr>
            <th className="p-4">User</th>
            <th className="p-4">Coins</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Reference</th>
            <th className="p-4">Status</th>
            <th className="p-4">Date</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {data?.items.map((dep) => (
            <tr key={dep._id}>
              <td className="p-4"><span className="font-bold block text-white">{dep.name}</span><span className="text-[10px] text-slate-400">{dep.email}</span></td>
              <td className="p-4 font-bold text-amber-400">+{dep.coins}</td>
              <td className="p-4 text-emerald-400">${(dep.amount / 100).toFixed(2)}</td>
              <td className="p-4 font-mono text-cyan-400">{dep.reference}</td>
              <td className="p-4">
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  dep.status === "Approved" ? "bg-emerald-500/20 text-emerald-400" :
                  dep.status === "Rejected" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                }`}>{dep.status}</span>
              </td>
              <td className="p-4 text-slate-400">{fmtDate(dep.createdAt)}</td>
              <td className="p-4 space-x-2">
                {dep.status === "Pending" && (
                  <>
                    <button onClick={() => handleApprove(dep._id)} className="px-2 py-1 bg-emerald-600 text-white rounded font-bold">Approve</button>
                    <button onClick={() => handleReject(dep._id)} className="px-2 py-1 bg-red-600 text-white rounded font-bold">Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepositRequests;
