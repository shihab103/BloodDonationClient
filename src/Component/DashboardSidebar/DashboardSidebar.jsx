import { Link, useLocation } from "react-router";
import {
  FaUser,
  FaClipboardList,
  FaHandHoldingHeart,
  FaGift,
  FaUsers,
  FaListAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import useRole from "../../utils/useRole";

const DashboardSidebar = ({ closeSidebar }) => {
  const { role } = useRole();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleClick = () => {
    if (closeSidebar) closeSidebar();
  };

  const baseLinkClasses =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-1 group";

  const activeLinkClasses =
    "bg-[#155dfc] text-white shadow-lg shadow-blue-200 translate-x-1";

  const inactiveLinkClasses =
    "text-gray-600 hover:bg-[#eff6ff] hover:text-[#155dfc]";

  return (
    <aside className="w-64 bg-white border-r border-gray-100 p-5 sticky top-4 h-[calc(100vh-32px)] flex flex-col justify-between">
      <div>
        <div className="mb-8 px-4">
          <h2 className="text-xl font-bold text-[#155dfc] tracking-tight">
            Dashboard
          </h2>
          <div className="h-1 w-10 bg-[#d32f2f] rounded-full mt-1"></div>
        </div>

        <nav className="flex flex-col">
          <Link
            to="/dashboard/profile"
            onClick={handleClick}
            className={`${baseLinkClasses} ${
              isActive("/dashboard/profile")
                ? activeLinkClasses
                : inactiveLinkClasses
            }`}
          >
            <FaUser
              className={`${isActive("/dashboard/profile") ? "text-white" : "text-gray-400 group-hover:text-[#155dfc]"}`}
              size={18}
            />
            <span className="font-medium">My Profile</span>
          </Link>

          {/* Admin Links */}
          {role === "admin" && (
            <>
              <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-6 mb-2 ml-4">
                Admin Menu
              </div>
              <Link
                to="/dashboard"
                onClick={handleClick}
                className={`${baseLinkClasses} ${isActive("/dashboard") ? activeLinkClasses : inactiveLinkClasses}`}
              >
                <FaClipboardList size={18} /> Admin Home
              </Link>
              <Link
                to="/dashboard/create-donation-request"
                onClick={handleClick}
                className={`${baseLinkClasses} ${isActive("/dashboard/create-donation-request") ? activeLinkClasses : inactiveLinkClasses}`}
              >
                <FaHandHoldingHeart size={18} /> Request Donation
              </Link>
              <Link
                to="/dashboard/my-donation-requests"
                onClick={handleClick}
                className={`${baseLinkClasses} ${isActive("/dashboard/my-donation-requests") ? activeLinkClasses : inactiveLinkClasses}`}
              >
                <FaGift size={18} /> My Requests
              </Link>
              <Link
                to="/dashboard/all-users"
                onClick={handleClick}
                className={`${baseLinkClasses} ${isActive("/dashboard/all-users") ? activeLinkClasses : inactiveLinkClasses}`}
              >
                <FaUsers size={18} /> All Users
              </Link>
              <Link
                to="/dashboard/donation-management"
                onClick={handleClick}
                className={`${baseLinkClasses} ${isActive("/dashboard/donation-management") ? activeLinkClasses : inactiveLinkClasses}`}
              >
                <FaListAlt size={18} /> Manage Donations
              </Link>
            </>
          )}

          {/* Donor Links */}
          {role === "donor" && (
            <>
              <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-6 mb-2 ml-4">
                Donor Menu
              </div>
              <Link
                to="/dashboard"
                onClick={handleClick}
                className={`${baseLinkClasses} ${isActive("/dashboard") ? activeLinkClasses : inactiveLinkClasses}`}
              >
                <FaClipboardList size={18} /> Donor Home
              </Link>
              <Link
                to="/dashboard/create-donation-request"
                onClick={handleClick}
                className={`${baseLinkClasses} ${isActive("/dashboard/create-donation-request") ? activeLinkClasses : inactiveLinkClasses}`}
              >
                <FaHandHoldingHeart size={18} /> Request Donation
              </Link>
              <Link
                to="/dashboard/my-donation-requests"
                onClick={handleClick}
                className={`${baseLinkClasses} ${isActive("/dashboard/my-donation-requests") ? activeLinkClasses : inactiveLinkClasses}`}
              >
                <FaGift size={18} /> My Requests
              </Link>
            </>
          )}
        </nav>
      </div>

      <div className="mt-auto border-t border-gray-100 pt-4">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-[#ffcdd2] hover:text-[#d32f2f] transition-all duration-300"
        >
          <FaSignOutAlt size={18} />
          <span className="font-medium">Exit Dashboard</span>
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
