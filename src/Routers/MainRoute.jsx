import { createBrowserRouter } from "react-router";
import RootLayout from "../Layout/RootLayout";
import Login from "../Component/Login/Login";
import Register from "../Component/Register/Register";
import Home from "../Pages/Home/Home";
import DonationRequest from "../Pages/DonorDashboard/DonationRequest";
import DashboardLayout from "../Layout/DashboardLayout";
import MyDonationRequests from "../Pages/DonorDashboard/MyDonationRequests";
import HomeStats from "../Pages/HomeComponent/HomeStats";
import Profile from "../Component/Profile/Profile";
import DonorDashboard from "../Pages/DonorDashboard/DonorDashboard";
import AllUsers from "../Pages/AdminDashboard/AllUsers";
import BloodDonationRequests from "../Pages/PublicPages/BloodDonationRequests";
import AdminDonationManagement from "../Pages/AdminDashboard/AdminDonationManagement";
import SelflessContribution from "../Pages/PublicPages/SelflessContribution";
import FindDonor from "../Pages/PublicPages/FindDonor";
import NotificationBell from "../Pages/PublicPages/NotificationBell";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "/login", Component: Login },
      { path: "/registration", Component: Register },
      { path: "/about", Component: HomeStats },
      { path: "nn", Component: NotificationBell },
      {
        path: "blood-donation-request",
        Component: BloodDonationRequests,
      },
      {
        path: "selfless-contribution",
        Component: SelflessContribution,
      },
      {
        path: "find-donor",
        Component: FindDonor,
      },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, Component: DonorDashboard },
          {
            path: "create-donation-request",
            Component: DonationRequest,
          },
          {
            path: "my-donation-requests",
            Component: MyDonationRequests,
          },
          {
            path: "profile",
            Component: Profile,
          },
          {
            path: "all-users",
            Component: AllUsers,
          },
          {
            path: "donation-management",
            Component: AdminDonationManagement,
          },
        ],
      },
    ],
  },
]);
