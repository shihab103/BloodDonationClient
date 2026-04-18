import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from "../../Provider/AuthContext"; 
import Loading from '../../Component/Loading/Loading';

const FindDonor = () => {
  const { user } = useContext(AuthContext); 
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGroup, setFilterGroup] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await axios.get(`${API_URL}/voluntary-donors`);
        setDonors(response.data);
      } catch (error) {
        console.error("Error fetching donors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, [API_URL]);

  const handleRequestBlood = async (donor) => {
    const requestId = donor._id; 

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to request blood from ${donor.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, Request!'
    });

    if (result.isConfirmed) {
      const updateData = {
        donationStatus: "inprogress",
        donorId: donor._id, 
        donorName: donor.name,
        donorEmail: donor.email,
      };

      try {
        const response = await axios.patch(`${API_URL}/donation-request/${requestId}`, updateData);
        
        if (response.data.modifiedCount > 0 || response.data.acknowledged) {

          // ✅ donor list থেকে remove
          setDonors(prevDonors => 
            prevDonors.filter(d => d._id !== donor._id)
          );

          Swal.fire({
            title: 'Request Sent!',
            text: 'The request is now in-progress and removed from list.',
            icon: 'success',
            confirmButtonColor: '#dc2626',
          });
        }
      } catch (error) {
        console.error("Update error:", error);
        Swal.fire('Error', 'Failed to update donation status', 'error');
      }
    }
  };

  // ✅ filter + optional status check
  const filteredDonors = donors.filter(d => 
    (!filterGroup || d.bloodGroup === filterGroup)
  );

  if (loading) return <Loading/>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h2 className="text-3xl font-extrabold text-slate-800">
            Find a <span className="text-red-600">Donor</span>
          </h2>
          
          <select 
            className="select select-bordered w-full max-w-xs border-2 border-red-100 rounded-xl"
            onChange={(e) => setFilterGroup(e.target.value)}
          >
            <option value="">All Blood Groups</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        {/* Donor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.length > 0 ? (
            filteredDonors.map((donor) => {
              const isCurrentUser = user?.email === donor.email;

              return (
                <div 
                  key={donor._id} 
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-shadow relative overflow-hidden group"
                >
                  
                  {/* Blood Group Badge */}
                  <div className="absolute top-0 right-0 bg-red-600 text-white px-5 py-2 rounded-bl-3xl font-bold">
                    {donor.bloodGroup}
                  </div>

                  {/* Profile */}
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={donor.photoURL || 'https://via.placeholder.com/150'} 
                      alt={donor.name} 
                      className="w-16 h-16 rounded-2xl object-cover ring-4 ring-red-50"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">
                        {donor.name}{" "}
                        {isCurrentUser && (
                          <span className="text-[10px] text-red-500 ml-1">(You)</span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {donor.location || "Location not set"}
                      </p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-3 mb-6 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Availability</span>
                      <span className="text-emerald-600 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md">
                        {donor.status || "Available"}
                      </span>
                    </div>
                  </div>

                  {/* Button */}
                  <button 
                    onClick={() => !isCurrentUser && handleRequestBlood(donor)}
                    disabled={isCurrentUser}
                    className={`w-full py-3 font-bold rounded-2xl transition-all active:scale-95 
                      ${isCurrentUser 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'}`}
                  >
                    {isCurrentUser ? "Your Profile" : "Request Blood"}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl">
              <p className="text-slate-400 font-medium">
                No donors found for this group.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindDonor;