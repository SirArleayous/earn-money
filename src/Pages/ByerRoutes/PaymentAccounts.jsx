import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const PaymentAccounts = () => {
  const axiosSecure = useAxiosSecure();
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ method: "Opay", label: "", account_name: "", account_number: "", extra: "", note: "" });
  const [editingId, setEditingId] = useState(null);

  const loadAccounts = () => {
    axiosSecure.get("/api/admin/payment-accounts").then((res) => setAccounts(res.data));
  };

  useEffect(() => { loadAccounts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosSecure.patch(`/api/admin/payment-accounts/${editingId}`, form);
        toast.success("Account updated");
      } else {
        await axiosSecure.post("/api/admin/payment-accounts", form);
        toast.success("Account added");
      }
      setForm({ method: "Opay", label: "", account_name: "", account_number: "", extra: "", note: "" });
      setEditingId(null);
      loadAccounts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (acc) => {
    setEditingId(acc._id);
    setForm({ method: acc.method, label: acc.label || "", account_name: acc.account_name || "", account_number: acc.account_number, extra: acc.extra || "", note: acc.note || "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment account?")) return;
    try {
      await axiosSecure.delete(`/api/admin/payment-accounts/${id}`);
      toast.success("Deleted");
      loadAccounts();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-4">
        <h4 className="font-bold text-white text-sm">{editingId ? "Edit Account" : "Add Payment Account"}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-400">Method Type</label>
            <select
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
              className="w-full bg-[#0B0F19] border border-slate-800 text-slate-100 rounded-lg p-2.5 mt-1"
            >
              <option value="Opay">Opay</option>
              <option value="Moniepoint">Moniepoint</option>
              <option value="Binance Wallet">Binance Wallet</option>
              <option value="Tonkeeper">Tonkeeper</option>
              <option value="PayPal">PayPal</option>
              <option value="Commercial Bank">Commercial Bank</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400">Label (e.g. GTBank / USDT TRC20)</label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="w-full bg-[#0B0F19] border border-slate-800 text-slate-100 rounded-lg p-2 mt-1"
            />
          </div>
          <div>
            <label className="text-slate-400">Account Name</label>
            <input
              type="text"
              value={form.account_name}
              onChange={(e) => setForm({ ...form, account_name: e.target.value })}
              className="w-full bg-[#0B0F19] border border-slate-800 text-slate-100 rounded-lg p-2 mt-1"
            />
          </div>
          <div>
            <label className="text-slate-400">Account No / Wallet Address *</label>
            <input
              type="text"
              required
              value={form.account_number}
              onChange={(e) => setForm({ ...form, account_number: e.target.value })}
              className="w-full bg-[#0B0F19] border border-slate-800 text-slate-100 rounded-lg p-2 mt-1"
            />
          </div>
        </div>
        <button type="submit" className="px-4 py-2 bg-[#00d7c0] text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1">
          <FaPlus /> {editingId ? "Update Account" : "Save Account"}
        </button>
      </form>

      <div className="overflow-x-auto bg-slate-900/60 border border-slate-800 rounded-xl">
        <table className="table w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400">
            <tr>
              <th className="p-3">Method</th>
              <th className="p-3">Account Name</th>
              <th className="p-3">Account No / Address</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {accounts.map((acc) => (
              <tr key={acc._id}>
                <td className="p-3 font-bold text-white">{acc.label || acc.method}</td>
                <td className="p-3 text-slate-300">{acc.account_name || "-"}</td>
                <td className="p-3 font-mono text-cyan-400">{acc.account_number}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleEdit(acc)} className="text-amber-400"><FaEdit /></button>
                  <button onClick={() => handleDelete(acc._id)} className="text-red-400"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentAccounts;
