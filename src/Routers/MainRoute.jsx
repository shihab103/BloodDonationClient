import { createBrowserRouter } from "react-router";
import RootLayout from "../Layout/RootLayout";
import Login from "../Component/Login/Login";
import Register from "../Component/Register/Register";
import Home from "../Pages/Home/Home";
import DonationRequest from "../Pages/DonorDashboard/DonationRequest";
import DashboardLayout from "../Layout/DashboardLayout";
import PrivateRoute from "../../../../BloodOld/Blood-Donation-Client/src/Routers/PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "/login", Component: Login },
      { path: "/register", Component: Register },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "create-donation-request",
            Component: DonationRequest,
          },
        ],
      },
    ],
  },
]);
