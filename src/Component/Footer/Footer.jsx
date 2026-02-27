import { Link, NavLink } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../Provider/AuthContext";

const Footer = () => {
  const { user } = useContext(AuthContext);

  const publicMenu = [
    { name: "Home", path: "/" },
    { name: "Search Donor", path: "/search-page" },
    { name: "Blood Donation Request", path: "/blood-donation-request" },
  ];

  return (
    <footer className="bg-[#ffcdd2] text-stone-700 py-10  border-t border-stone-300">
      <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        {/* Logo Section */}
        <div>
          <Link to="/" className="text-2xl font-bold text-red-500">
            Blood Donate
          </Link>
          <p className="mt-2 text-sm">
            A platform to connect donors and save lives.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            {publicMenu.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className="hover:text-orange-500 transition"
                >
                  {item.name}
                </NavLink>
              </li>
            ))}

            {user?.email && (
              <li>
                <NavLink
                  to="/dashboard"
                  className="hover:text-orange-500 transition"
                >
                  Dashboard
                </NavLink>
              </li>
            )}

            {!user?.email && (
              <>
                <li>
                  <NavLink to="/login" className="hover:text-orange-500 transition">
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/registration" className="hover:text-orange-500 transition">
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Contact Info or Socials */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <p className="text-sm">Email: shihabuddin2469@gmail.com</p>
          <p className="text-sm">Phone: +880 1786707639</p>
          <div className="mt-3">
            {/* You can add social icons if needed */}
            <p className="text-sm">&copy; {new Date().getFullYear()} Blood Donate. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;