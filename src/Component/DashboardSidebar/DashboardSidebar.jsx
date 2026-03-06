
import { Link, useLocation } from "react-router";
import {
  FaUser,
  FaClipboardList,
  FaHandHoldingHeart,
  FaGift,
  FaUsers,
  FaFileAlt,
  FaListAlt,
} from "react-icons/fa";
import useRole from "../../utils/useRole";

const DashboardSidebar = ({ closeSidebar }) => {
  const { role } = useRole();
  // const role  = "donor";
  console.log(role)
  const location = useLocation();


  const isActive = (path) => location.pathname === path;
  const baseLinkClasses =
    "flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200";
  const activeLinkClasses = "bg-blue-600 text-white font-semibold shadow-md";
  const inactiveLinkClasses =
    "text-gray-700 hover:bg-blue-100 hover:text-blue-600";

  // Helper to call closeSidebar only if exists
  const handleClick = () => {
    if (closeSidebar) closeSidebar();
  };

  return (
    <aside className="w-64  shadow-lg rounded-md p-6 sticky top-4 h-[calc(100vh-32px)] overflow-auto">
      <nav className="flex flex-col gap-2">
        <Link
          to="/dashboard/profile"
          onClick={handleClick}
          className={`${baseLinkClasses} ${
            isActive("/dashboard/profile")
              ? activeLinkClasses
              : inactiveLinkClasses
          }`}
        >
          <FaUser size={18} /> Profile
        </Link>

        {role === "admin" && (
          <>
            <Link
              to="/dashboard"
              onClick={handleClick}
              className={`${baseLinkClasses} ${
                isActive("/dashboard") ? activeLinkClasses : inactiveLinkClasses
              }`}
            >
              <FaClipboardList size={18} /> Admin Dashboard Home
            </Link>

            <Link
              to="/dashboard/all-users"
              onClick={handleClick}
              className={`${baseLinkClasses} ${
                isActive("/dashboard/all-users")
                  ? activeLinkClasses
                  : inactiveLinkClasses
              }`}
            >
              <FaUsers size={18} /> All Users
            </Link>
            <Link
              to="/dashboard/all-blood-donation-request"
              onClick={handleClick}
              className={`${baseLinkClasses} ${
                isActive("/dashboard/all-blood-donation-request")
                  ? activeLinkClasses
                  : inactiveLinkClasses
              }`}
            >
              <FaListAlt size={18} /> All Donation Requests
            </Link>
            <Link
              to="/dashboard/contact"
              onClick={handleClick}
              className={`${baseLinkClasses} ${
                isActive("/dashboard/contact")
                  ? activeLinkClasses
                  : inactiveLinkClasses
              }`}
            >
              <FaListAlt size={18} /> Contact
            </Link>
          </>
        )}

        {role === "donor" && (
          <>
            <Link
              to="/dashboard"
              onClick={handleClick}
              className={`${baseLinkClasses} ${
                isActive("/dashboard") ? activeLinkClasses : inactiveLinkClasses
              }`}
            >
              <FaClipboardList size={18} /> Donor Dashboard Home
            </Link>
            <Link
              to="/dashboard/create-donation-request"
              onClick={handleClick}
              className={`${baseLinkClasses} ${
                isActive("/dashboard/create-donation-request")
                  ? activeLinkClasses
                  : inactiveLinkClasses
              }`}
            >
              <FaHandHoldingHeart size={18} /> Donation Request
            </Link>
            <Link
              to="/dashboard/my-donation-requests"
              onClick={handleClick}
              className={`${baseLinkClasses} ${
                isActive("/dashboard/my-donation-requests")
                  ? activeLinkClasses
                  : inactiveLinkClasses
              }`}
            >
              <FaGift size={18} /> My Donation Requests
            </Link>
                        
          </>
        )}

        {role === "volunteer" && (
          <>
            <Link
              to="/dashboard"
              onClick={handleClick}
              className={`${baseLinkClasses} ${
                isActive("/dashboard") ? activeLinkClasses : inactiveLinkClasses
              }`}
            >
              <FaClipboardList size={18} /> Volunteer Dashboard Home
            </Link>
            <Link
              to="/dashboard/all-blood-donation-request"
              onClick={handleClick}
              className={`${baseLinkClasses} ${
                isActive("/dashboard/all-blood-donation-request")
                  ? activeLinkClasses
                  : inactiveLinkClasses
              }`}
            >
              <FaListAlt size={18} /> All Donation Requests
            </Link>
            
          </>
        )}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;