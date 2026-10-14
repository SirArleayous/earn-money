import React from "react";
import useRole from "../Hooks/useRole";
import useAuth from "../Hooks/useAuth";

import WorkerHome from "./WorkerRoutes/WorkerHome";
import BuyerHome from "./BuyerRoutes/BuyerHome"; // Fixed path spelling from ByerRoutes -> BuyerRoutes
import AdminHome from "./AdminRoutes/AdminHome";

const DashboardHome = () => {
  const [role, isLoading] = useRole();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#00d7c0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check role from Database or fallback check
  const currentRole = role || user?.role;

  if (currentRole === "Admin") {
    return <AdminHome />;
  }

  if (currentRole === "Buyer" || currentRole === "Client") {
    return <BuyerHome />;
  }

  return <WorkerHome />;
};

export default DashboardHome;