import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { AuthContext } from "../../Provider/AuthContext";

const NotificationBell = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user?.email) {
      fetchNotifications();
    }
  }, [user?.email]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/notifications/${user.email}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-all"
      >
        <FaBell className="text-2xl text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 overflow-hidden">
          <div className="bg-gray-50 p-4 font-black text-xs uppercase text-gray-500 border-b">
            Notifications
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No notifications yet</div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`p-4 border-b last:border-0 hover:bg-gray-50 transition-all ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                >
                  <p className="text-sm font-bold text-gray-800 leading-tight">{notif.message}</p>
                  <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold">
                    {new Date(notif.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;