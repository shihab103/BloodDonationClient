import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from "../../Provider/AuthContext"; 

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

  const handleRequestBlood = (donor) => {
    Swal.fire({
      title: `Request Blood from ${donor.name}?`,
      text: `Send a request for ${donor.bloodGroup} blood?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      confirmButtonText: 'Send Request',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Sent!', 'Your request has been sent to the donor.', 'success');
      }
    });
  };

  const filteredDonors = filterGroup 
    ? donors.filter(d => d.bloodGroup === filterGroup)
    : donors;

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h2 className="text-3xl font-extrabold text-slate-800">Find a <span className="text-red-600">Donor</span></h2>
          
          <select 
            className="select select-bordered w-full max-w-xs border-2 border-red-100 focus:border-red-600 rounded-xl"
            onChange={(e) => setFilterGroup(e.target.value)}
          >
            <option value="">All Blood Groups</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.length > 0 ? (
            filteredDonors.map((donor) => {
              // চেক করা হচ্ছে কার্ডটি বর্তমান ইউজারের কি না
              const isCurrentUser = user?.email === donor.email;

              return (
                <div key={donor._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-red-600 text-white px-5 py-2 rounded-bl-3xl font-bold">
                    {donor.bloodGroup}
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={donor.photoURL} 
                      alt={donor.name} 
                      className="w-16 h-16 rounded-2xl object-cover ring-4 ring-red-50"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">
                        {donor.name} {isCurrentUser && <span className="text-[10px] text-red-500 font-normal ml-1">(You)</span>}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        {donor.location}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Status</span>
                        <span className="text-emerald-600 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md">
                          {donor.status}
                        </span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Joined</span>
                        <span className="text-slate-700 font-medium">
                          {new Date(donor.joinedAt).toLocaleDateString()}
                        </span>
                     </div>
                  </div>

                  {/* বাটন কন্ডিশনাল রেন্ডারিং */}
                  <button 
                    onClick={() => !isCurrentUser && handleRequestBlood(donor)}
                    disabled={isCurrentUser}
                    className={`w-full py-3 font-bold rounded-2xl transition-all active:scale-95 
                      ${isCurrentUser 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70' 
                        : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'}`}
                  >
                    {isCurrentUser ? "Your Profile" : "Request Blood"}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-inner">
               <p className="text-slate-400 font-medium">No donors found for this blood group.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindDonor;