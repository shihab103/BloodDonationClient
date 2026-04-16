import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSpinner, 
  FaHistory, 
  FaHospital, 
  FaUserAlt, 
  FaCalendarAlt
} from "react-icons/fa";
import Loading from "../../Component/Loading/Loading";

const AdminDonationManagement = () => {
  const [inProgressRequests, setInProgressRequests] = useState([]);
  const [historyRequests, setHistoryRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/public-donation-requests`);
      
      const inProgress = res.data.filter(req => req.donationStatus === "inprogress");
      const history = res.data.filter(req => req.donationStatus === "done");
      
      setInProgressRequests(inProgress);
      setHistoryRequests(history);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const result = await Swal.fire({
        title: `Are you sure?`,
        text: status === 'done' ? "Is this donation successfully completed?" : "Do you want to cancel this progress?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: status === 'done' ? "#ffe2e2" : "#EF4444",
        confirmButtonText: "Yes, update it!",
      });

      if (result.isConfirmed) {
        await axios.patch(`${import.meta.env.VITE_API_URL}/admin/update-status/${id}`, { status });
        Swal.fire("Updated!", `Status changed to ${status}.`, "success");
        fetchRequests(); 
      }
    } catch (error) {
      Swal.fire("Error!", "Action failed.", "error");
    }
  };

  if (loading) return (
    <Loading/>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* --- Section 1: In-Progress Donations --- */}
        <section className="mb-16">
          <h2 className="text-3xl font-black text-gray-800 mb-8 uppercase flex items-center gap-3">
            In-Progress <span className="text-red-600">Donations</span>
          </h2>

          {inProgressRequests.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl shadow-sm text-center border-2 border-dashed">
              <p className="text-gray-500 font-bold italic">No active donation in progress.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {inProgressRequests.map((req) => (
                <div key={req._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-gray-800 uppercase flex items-center gap-2">
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-black">{req.bloodGroup}</span>
                      {req.recipientName}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <FaUserAlt className="text-gray-400 text-xs"/> <span className="font-bold">Donor:</span> {req.donorEmail}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-2 italic">
                      <FaHospital className="text-red-400"/> {req.hospitalName}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStatusUpdate(req._id, "done")}
                      className="flex items-center gap-2 bg-[#155dfc] text-white px-5 py-3 rounded-2xl font-black text-xs uppercase hover:bg-green-600 shadow-lg shadow-green-100 transition-all"
                    >
                      <FaCheckCircle /> Done
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(req._id, "canceled")}
                      className="flex items-center gap-2 bg-gray-100 text-gray-500 px-5 py-3 rounded-2xl font-black text-xs uppercase hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      <FaTimesCircle /> Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>


        {/* --- Section 2: Donation History (Done) --- */}
        <section>
          <h2 className="text-3xl font-black text-gray-800 mb-8 uppercase flex items-center gap-3 border-t pt-10">
            <FaHistory className="text-blue-500" /> Previous <span className="text-blue-500">History</span>
          </h2>

          {historyRequests.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl shadow-sm text-center">
              <p className="text-gray-400 italic">No historical data available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {historyRequests.map((req) => (
                <div key={req._id} className="bg-gray-100/50 p-6 rounded-2xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {/* Recipient Info */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recipient</span>
                      <span className="font-bold text-gray-700">{req.recipientName}</span>
                      <span className="text-xs text-red-500 font-black">{req.bloodGroup}</span>
                    </div>

                    {/* Donor Info */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hero Donor</span>
                      <span className="font-bold text-gray-700">{req.donorName}</span>
                      <span className="text-[10px] text-gray-500 truncate">{req.donorEmail}</span>
                    </div>

                    {/* Location & Date */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Details</span>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                        <FaHospital className="text-gray-400" /> {req.hospitalName}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                        <FaCalendarAlt className="text-gray-400" /> {req.donationDate} | {req.donationTime}
                      </div>
                    </div>
                  </div>

                  {/* Success Badge */}
                  <div className="hidden md:block">
                    <span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default AdminDonationManagement;