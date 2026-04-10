import { useContext, useState } from "react";
import { CgMenuMotion } from "react-icons/cg";
import { RiMenuAddLine } from "react-icons/ri";
import { Link, NavLink, useNavigate } from "react-router";
import { AuthContext } from "../../Provider/AuthContext";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const publicMenu = [
    { name: "Home", path: "/" },
    { name: "Blood Donation Request", path: "/blood-donation-request" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="overflow-x-clip bg-red-50 shadow-md sticky top-0 z-50">
      <div className="w-11/12 mx-auto py-5 flex justify-between items-center relative">
        <Link to="/" className="logo">
          <span className="text-xl font-bold text-red-500">Blood Donate</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-5 font-medium">
          {publicMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "text-red-500 font-semibold" : "hover:text-red-500"
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* Show Dashboard only if user is logged in */}
          {user?.email && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "text-red-500 font-semibold" : "hover:text-red-500"
              }
            >
              Dashboard
            </NavLink>
          )}

          {user?.email ? (
            <button onClick={handleLogout} className="ml-4 hover:text-red-500">
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/registration">Register</NavLink>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          {isMenuOpen ? (
            <CgMenuMotion
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl cursor-pointer"
            />
          ) : (
            <RiMenuAddLine
              onClick={() => setIsMenuOpen(true)}
              className="text-2xl cursor-pointer"
            />
          )}
        </div>

        {/* Mobile Menu */}
        <div
          className={`absolute top-20 left-0 w-full bg-white z-40 transition-all duration-300 ease-in-out ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <ul className="flex flex-col items-center gap-4 py-5">
            {publicMenu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "text-orange-500 font-semibold" : "hover:text-orange-500"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}

            {/* Show Dashboard only if user is logged in */}
            {user?.email && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "text-orange-500 font-semibold" : "hover:text-orange-500"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </NavLink>
            )}

            {user?.email ? (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>Login</NavLink>
                <NavLink to="/registration" onClick={() => setIsMenuOpen(false)}>Register</NavLink>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;