import React, { useContext, useEffect, useState } from "react";
import { 
  FaHeartbeat, 
  FaMapMarkerAlt, 
  FaTint, 
  FaCalendarAlt, 
  FaClock, 
  FaFilter, 
  FaHospital,
  FaRoute,
  FaLocationArrow,
} from "react-icons/fa";
import { FaTruckMedical } from "react-icons/fa6"; 
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../Provider/AuthContext";
import Loading from "../../Component/Loading/Loading";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1)); 
};

const DonateButton = ({ req, onDonate, onCancel, currentUserEmail }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const isDonor = req.donorEmail === currentUserEmail;
  const isInProgress = req.donationStatus === "inprogress";

  const handleClick = () => {
    if (isInProgress && isDonor) {
      onCancel(req._id);
      return;
    }
    if (req.donationStatus === "pending") {
      setIsAnimating(true);
      setTimeout(() => {
        onDonate(req._id);
        setIsAnimating(false);
      }, 800);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isInProgress && !isDonor}
      className={`relative w-full py-4 rounded-2xl font-black text-sm transition-all duration-300 overflow-hidden uppercase tracking-wider shadow-lg 
        ${isInProgress && isDonor ? "bg-white border-2 border-red-600 text-red-600" : 
          isInProgress ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-red-600 text-white hover:bg-gray-900"}`}
    >
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "400%" }}
            transition={{ duration: 0.8, ease: "linear" }}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl z-20 text-white"
          >
            <FaTruckMedical />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ y: isAnimating ? -20 : 0, opacity: isAnimating ? 0 : 1 }}
        className="relative z-10 flex items-center justify-center gap-2"
      >
        {isInProgress && isDonor ? "Cancel Offer ❌" : isInProgress ? "Taken by Hero" : "Donate Now ❤️"}
      </motion.div>
    </button>
  );
};

const BloodDonationRequests = () => {
  const { user } = useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filterGroup, setFilterGroup] = useState("All");
  const [filterDistance, setFilterDistance] = useState("All"); 
  const [isLoading, setIsLoading] = useState(true); 

  const bloodGroups = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const distanceRanges = [
    { label: "All Distance", value: "All" },
    { label: "Under 20 KM", value: 20 },
    { label: "Under 50 KM", value: 50 },
    { label: "Under 100 KM", value: 100 },
    { label: "Under 200 KM", value: 200 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); 
      try {
        if (user?.email) {
          const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/users/${user.email}`);
          setDbUser(userRes.data);
        }

        const upazilaRes = await fetch("/upazilas.json");
        const upazilaData = await upazilaRes.json();
        const extractedUpazilas = upazilaData.find(item => item.name === "upazilas")?.data || [];
        setUpazilas(extractedUpazilas);

        await fetchRequests();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.email]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/public-donation-requests`);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDonate = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/donation-request/${id}`, {
        donationStatus: "inprogress",
        donorId: user._id || user.uid,
        donorName: user.displayName,
        donorEmail: user.email,
      });
      fetchRequests();
    } catch (error) {
      Swal.fire("Error!", "Failed to accept.", "error");
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/cancel-donation/${id}`);
      fetchRequests();
    } catch (error) {
      Swal.fire("Error!", "Failed to cancel.", "error");
    }
  };

  const filteredRequests = requests.filter(req => {
    if (req.donationStatus === "done") return false;
    const matchesGroup = filterGroup === "All" || req.bloodGroup === filterGroup;
    
    let matchesDistance = true;
    if (filterDistance !== "All" && dbUser && upazilas.length > 0) {
      const userUpazilaGeo = upazilas.find(u => u.name === dbUser.upazilaName);
      const reqUpazilaGeo = upazilas.find(u => u.name === req.recipientUpazila);

      if (userUpazilaGeo && reqUpazilaGeo) {
        const dist = calculateDistance(userUpazilaGeo.lat, userUpazilaGeo.lon, reqUpazilaGeo.lat, reqUpazilaGeo.lon);
        matchesDistance = dist <= filterDistance;
      } else {
        matchesDistance = false;
      }
    }
    return matchesGroup && matchesDistance;
  });

  // --- লোডিং স্ক্রিন কম্পোনেন্ট ---
  if (isLoading) {
    return <Loading/>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h2 className="text-4xl font-black text-gray-800 flex justify-center items-center gap-4 uppercase tracking-tighter">
          <FaHeartbeat className="text-red-600 animate-pulse" />
          Blood <span className="text-red-600">Network</span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar Filter */}
        <div className="w-full md:w-72 shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 sticky top-24">
            <div className="mb-8">
              <h4 className="flex items-center gap-2 font-bold text-gray-400 mb-4 uppercase text-[10px] tracking-widest border-b pb-2">
                <FaFilter className="text-red-500" /> Blood Group
              </h4>
              <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
                {bloodGroups.map((group) => (
                  <button
                    key={group}
                    onClick={() => setFilterGroup(group)}
                    className={`py-2 px-3 rounded-xl text-[11px] font-black transition-all ${
                      filterGroup === group ? "bg-red-600 text-white shadow-lg" : "bg-gray-50 text-gray-400 hover:text-red-600"
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="flex items-center gap-2 font-bold text-gray-400 mb-4 uppercase text-[10px] tracking-widest border-b pb-2">
                <FaLocationArrow className="text-blue-500" /> Distance Range
              </h4>
              <div className="flex flex-col gap-2">
                {distanceRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setFilterDistance(range.value)}
                    className={`py-2.5 px-4 rounded-xl text-left text-[11px] font-bold transition-all ${
                      filterDistance === range.value ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="flex-1">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
              <p className="text-gray-400 text-lg font-bold">No active requests found.</p>
              <button onClick={() => {setFilterGroup("All"); setFilterDistance("All");}} className="mt-4 text-red-600 font-bold underline">Reset Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {filteredRequests.map((req) => {
                const userUpazilaGeo = upazilas.find(u => u.name === dbUser?.upazilaName);
                const reqUpazilaGeo = upazilas.find(u => u.name === req.recipientUpazila);
                const distance = (userUpazilaGeo && reqUpazilaGeo) 
                  ? calculateDistance(userUpazilaGeo.lat, userUpazilaGeo.lon, reqUpazilaGeo.lat, reqUpazilaGeo.lon) 
                  : null;

                return (
                  <div key={req._id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 bg-red-600 text-white px-8 py-3 rounded-bl-[2.5rem] font-black text-2xl z-10">
                      {req.bloodGroup}
                    </div>

                    <div>
                      <div className="mb-6">
                        <h3 className="text-2xl font-black text-gray-800 uppercase leading-none">{req.recipientName}</h3>
                        {distance !== null && (
                          <div className="mt-3 flex items-center gap-1.5 text-blue-600 font-bold text-[10px] uppercase tracking-widest bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100">
                            <FaRoute className="animate-bounce text-xs" />
                            {distance} KM Away from you
                          </div>
                        )}
                        <span className={`inline-block mt-3 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                          req.donationStatus === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          • {req.donationStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600 mb-8">
                        <div className="flex items-center gap-4 bg-red-50/50 p-4 rounded-2xl col-span-1 sm:col-span-2 border border-red-100">
                          <div className="bg-red-600 p-2.5 rounded-xl text-white shadow-md">
                            <FaHospital />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black text-red-400">Hospital</span>
                            <span className="text-sm font-bold text-gray-800">{req.hospitalName}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                          <FaMapMarkerAlt className="text-red-500" />
                          <span className="text-[11px] font-bold truncate">{req.recipientUpazila}, {req.recipientDistrict}</span>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                          <FaCalendarAlt className="text-red-500" />
                          <span className="text-[11px] font-bold">{req.donationDate}</span>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                          <FaClock className="text-red-500" />
                          <span className="text-[11px] font-bold">{req.donationTime}</span>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                          <FaTint className="text-red-500" />
                          <span className="text-[11px] font-bold">Need: {req.bloodGroup}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                      {req.requesterEmail === user?.email ? (
                        <div className="w-full text-center py-4 bg-gray-100 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                          Your Own Request
                        </div>
                      ) : (
                        <DonateButton req={req} onDonate={handleDonate} onCancel={handleCancel} currentUserEmail={user?.email} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BloodDonationRequests;