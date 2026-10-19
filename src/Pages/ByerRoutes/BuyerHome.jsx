import React, { useContext } from "react";
import { LuActivity } from "react-icons/lu";
import { MdOutlinePending, MdOutlinePayment } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import TaskToReview from "./TaskToReview";
import BuyerChart from "../../components/ApexCharts/BuyerChart";
import { ThemeContext } from "../../context/ThemeContext";

const BuyerHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { theme } = useContext(ThemeContext);
  // all three lists refresh every 8 seconds so the numbers stay current
  const live = { enabled: !!user?.email, refetchInterval: 8000 };

  const { data: rawAddedTasks = [] } = useQuery({
    queryKey: ["addedTasks", user?.email],
    ...live,
    queryFn: async () => (await axiosSecure.get(`/api/tasks/my/${user?.email}`)).data,
  });

  const { data: rawTotalWorkers = [], refetch: workerRefetch } = useQuery({
    queryKey: ["totalWorkers", user?.email],
    ...live,
    queryFn: async () => (await axiosSecure.get(`/api/tasks/my/${user?.email}`)).data,
  });

  const { data: rawMyAmounts = [] } = useQuery({
    queryKey: ["myAmounts", user?.email],
    ...live,
    queryFn: async () => (await axiosSecure.get(`/api/payments/history/${user?.email}`)).data,
  });

  // Safely extract array data regardless of backend object structure
  const addedTasks = Array.isArray(rawAddedTasks)
    ? rawAddedTasks
    : Array.isArray(rawAddedTasks?.tasks)
    ? rawAddedTasks.tasks
    : [];

  const totalWorkers = Array.isArray(rawTotalWorkers)
    ? rawTotalWorkers
    : Array.isArray(rawTotalWorkers?.tasks)
    ? rawTotalWorkers.tasks
    : [];

  const myAmounts = Array.isArray(rawMyAmounts)
    ? rawMyAmounts
    : Array.isArray(rawMyAmounts?.payments)
    ? rawMyAmounts.payments
    : Array.isArray(rawMyAmounts?.deposits)
    ? rawMyAmounts.deposits
    : [];

  const totalWorker = totalWorkers.reduce(
    (total, Worker) => total + (Worker.required_workers || Worker.worker || 0),
    0
  );

  const myAmount = myAmounts.reduce(
    (total, amount) => total + (amount.amount || 0),
    0
  );

  const usdAmount = myAmount / 100;

  return (
    <div
      className={`p-8 ${
        theme === "light"
          ? "bg-[#f9fafc] text-black"
          : "dark:bg-black dark:text-white"
      }`}
    >
      <div className="lg:flex gap-4">
        <div className="lg:w-[70%] ">
          <div
            className={`p-8 rounded-xl shadow-2xl ${
              theme === "light"
                ? "backdrop-blur-xl bg-[#FFFFFF] text-black"
                : "dark:bg-gradient-to-r from-[#020710] to-[#1b2028]"
            }`}
          >
            <BuyerChart />
          </div>
          <div
            className={`p-8 rounded-xl shadow-2xl mt-8  ${
              theme === "light"
                ? "backdrop-blur-xl bg-[#FFFFFF] text-black"
                : "dark:bg-gradient-to-r from-[#020710] to-[#1b2028]"
            }`}
          >
            <TaskToReview workerRefetch={workerRefetch} />
          </div>
        </div>
        <div
          className={`lg:w-[30%] p-8 rounded-xl mt-10 lg:mt-0  ${
            theme === "light"
              ? "backdrop-blur-xl bg-[#FFFFFF] text-black"
              : "dark:bg-gradient-to-r from-[#020710] to-[#1b2028] dark:text-white"
          }`}
        >
          <div className="space-y-4">
            <div className="stats shadow w-full bg-gradient-to-r from-[#193a98] to-[#070c2e] text-white">
              <div className="stat">
                <div className="stat-title text-center text-white font-bold">
                  Total Task Count
                </div>
                <button className="font-bold text-2xl py-3 flex justify-center">
                  <LuActivity />
                </button>
                <div className="stat-value text-center">
                  {addedTasks.length}
                </div>
              </div>
            </div>
            <div className="stats shadow w-full bg-gradient-to-r from-[#20d6ef] to-[#0846da] text-white">
              <div className="stat">
                <div className="stat-title text-center text-white font-bold">
                  Total Workers
                </div>
                <button className="font-bold text-2xl py-3 flex justify-center">
                  <MdOutlinePending />
                </button>
                <div className="stat-value text-center">{totalWorker}</div>
              </div>
            </div>
            <div className="stats shadow w-full bg-gradient-to-r from-[#551f8b] to-[#1c172d] text-white">
              <div className="stat">
                <div className="stat-title text-center font-bold text-white">
                  Total Payment
                </div>
                <button className="font-bold text-2xl py-3 flex justify-center">
                  <MdOutlinePayment />
                </button>
                <div className="stat-value text-center">{usdAmount}$</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerHome;
