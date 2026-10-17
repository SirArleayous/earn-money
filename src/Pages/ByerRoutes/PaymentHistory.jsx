import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import PaymentHistoryTable from "./PaymentHistoryTable";
import { ThemeContext } from "../../context/ThemeContext";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { theme } = useContext(ThemeContext);

  const { data: rawData = null, isLoading } = useQuery({
    queryKey: ["myHistories", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/api/payments/history/${user?.email}`);
      return data;
    },
    enabled: !!user?.email,
  });

  const depositsList = Array.isArray(rawData?.deposits) ? rawData.deposits : [];
  const paymentsList = Array.isArray(rawData?.payments)
    ? rawData.payments
    : Array.isArray(rawData)
    ? rawData
    : [];

  const list = [...depositsList, ...paymentsList];

  return (
    <div>
      <div className="py-10">
        <div
          className={`w-[60%] mx-auto shadow-xl rounded-xl py-10 ${
            theme === "light"
              ? "backdrop-blur-xl bg-[#FFFFFF] text-black"
              : "dark:bg-gradient-to-r from-[#020710] to-[#1b2028] dark:text-white"
          }`}
        >
          <h2 className="font-bold text-center text-3xl">Payment History Overview</h2>
          <p className="text-center w-[50%] mx-auto py-3">
            Track your coin deposit requests and successful account top-ups.
          </p>
        </div>
      </div>
      <div
        className={`w-[90%] mx-auto p-10 rounded-xl shadow-xl ${
          theme === "light"
            ? "backdrop-blur-xl bg-[#FFFFFF] text-black"
            : "dark:bg-gradient-to-r from-[#020710] to-[#1b2028] dark:text-white"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className={theme === "light" ? "text-black" : "dark:text-white"}>
                <th>Reference</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Coins</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {list.map((history, index) => (
                <PaymentHistoryTable
                  theme={theme}
                  key={history._id || index}
                  history={history}
                />
              ))}
            </tbody>
          </table>
          {!isLoading && list.length === 0 && (
            <p className="text-center py-6 text-slate-400">No payment history found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
