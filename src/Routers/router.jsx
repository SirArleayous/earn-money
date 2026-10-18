import { createBrowserRouter } from "react-router-dom";
import HomePageLayout from "../Layouts/HomePageLayout";
import Home from "../Pages/Home";
import InvestorLogin from "../Pages/Authentications/InvestorLogin";
import InvestorRegister from "../Pages/Authentications/InvestorRegister";
import InvestorHome from "../Pages/Dashboard/InvestorHome";
import Login from "../Pages/Authentications/Login";
import Register from "../Pages/Authentications/Register";
import ForgotPassword from "../Pages/Authentications/ForgotPassword";
import Referral from "../Pages/Referral/Referral";
import ErrorPage from "../Pages/ErrorPage";
import DashBoardLayout from "../Layouts/DashBoardLayout";
import DashboardHome from "../Pages/DashboardHome";
import PrivetRouter from "./PrivetRouter";
import AddNewTasks from "../Pages/ByerRoutes/AddNewTasks";
import MyTasks from "../Pages/ByerRoutes/MyTasks";
import BuyerRouter from "./BuyerRouter";
import ManageUsers from "../Pages/AdminRoutes/ManageUsers";
import ManageWithdrawals from "../Pages/AdminRoutes/ManageWithdrawals";
import ActivityLog from "../Pages/AdminRoutes/ActivityLog";
import AdminRouter from "./AdminRouter";
import TaskLists from "../Pages/WorkerRoutes/TaskLists";
import TaskDetails from "../Pages/WorkerRoutes/TaskDetails";
import MySubmissions from "../Pages/WorkerRoutes/MySubmissions";
import ApprovedSubmissions from "../Pages/WorkerRoutes/ApprovedSubmissions";
import TaskToReview from "../Pages/ByerRoutes/TaskToReview";
import PurchaseCoin from "../Pages/ByerRoutes/PurchaseCoin";
import PaymentHistory from "../Pages/ByerRoutes/PaymentHistory";
import Payment from "../Pages/Payment/Payment";
import Withdrawals from "../Pages/WorkerRoutes/Withdrawals";
import ManageTasks from "../Pages/AdminRoutes/ManageTasks";
import WorkerRouter from "./WorkerRouter";
import About from "../components/About/About";
import Contact from "../components/Contact/Contact";
import Profile from "../Pages/Profile/Profile";
import TopRatedTaskDetails from "../components/TopRatedTasks/TopRatedTaskDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePageLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "task/:id",
        element: <TopRatedTaskDetails />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "investor-login",
    element: <InvestorLogin />,
  },
  {
    path: "investor-register",
    element: <InvestorRegister />,
  },
  {
    path: "investor",
    element: <InvestorHome />,
  },
  {
    path: "dashboard",
    element: <DashBoardLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivetRouter>
            <DashboardHome />
          </PrivetRouter>
        ),
      },
      {
        path: "investor",
        element: <InvestorHome />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "referral",
        element: (
          <PrivetRouter>
            <Referral />
          </PrivetRouter>
        ),
      },
      {
        path: "payment/:id",
        element: (
          <PrivetRouter>
            <BuyerRouter>
              <Payment />
            </BuyerRouter>
          </PrivetRouter>
        ),
      },
      {
        path: "addNewTasks",
        element: (
          <PrivetRouter>
            <BuyerRouter>
              <AddNewTasks />
            </BuyerRouter>
          </PrivetRouter>
        ),
      },
      {
        path: "myTasks",
        element: (
          <PrivetRouter>
            <BuyerRouter>
              <MyTasks />
            </BuyerRouter>
          </PrivetRouter>
        ),
      },
      {
        path: "tasksToReview",
        element: (
          <PrivetRouter>
            <BuyerRouter>
              <TaskToReview />
            </BuyerRouter>
          </PrivetRouter>
        ),
      },
      {
        path: "purchaseCoin",
        element: (
          <PrivetRouter>
            <BuyerRouter>
              <PurchaseCoin />
            </BuyerRouter>
          </PrivetRouter>
        ),
      },
      {
        path: "paymentHistory",
        element: (
          <PrivetRouter>
            <BuyerRouter>
              <PaymentHistory />
            </BuyerRouter>
          </PrivetRouter>
        ),
      },
      {
        path: "manageTasks",
        element: (
          <PrivetRouter>
            <AdminRouter>
              <ManageTasks />
            </AdminRouter>
          </PrivetRouter>
        ),
      },
      {
        path: "manageUsers",
        element: (
          <PrivetRouter>
            <AdminRouter>
              <ManageUsers />
            </AdminRouter>
          </PrivetRouter>
        ),
      },
      {
        path: "withdrawRequests",
        element: (
          <PrivetRouter>
            <AdminRouter>
              <ManageWithdrawals />
            </AdminRouter>
          </PrivetRouter>
        ),
      },
      {
        path: "admin/withdrawals",
        element: (
          <PrivetRouter>
            <AdminRouter>
              <ManageWithdrawals />
            </AdminRouter>
          </PrivetRouter>
        ),
      },
      {
        path: "activityLog",
        element: (
          <PrivetRouter>
            <AdminRouter>
              <ActivityLog />
            </AdminRouter>
          </PrivetRouter>
        ),
      },
      {
        path: "taskDetails/:id",
        element: (
          <PrivetRouter>
            <TaskDetails />
          </PrivetRouter>
        ),
      },
      {
        path: "mySubmission",
        element: (
          <PrivetRouter>
            <WorkerRouter>
              <MySubmissions />
            </WorkerRouter>
          </PrivetRouter>
        ),
      },
      {
        path: "approvedSubmissions",
        element: (
          <PrivetRouter>
            <WorkerRouter>
              <ApprovedSubmissions />
            </WorkerRouter>
          </PrivetRouter>
        ),
      },
      {
        path: "withdrawals",
        element: (
          <PrivetRouter>
            <WorkerRouter>
              <Withdrawals />
            </WorkerRouter>
          </PrivetRouter>
        ),
      },
      {
        path: "taskLists",
        element: (
          <PrivetRouter>
            <WorkerRouter>
              <TaskLists />
            </WorkerRouter>
          </PrivetRouter>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;