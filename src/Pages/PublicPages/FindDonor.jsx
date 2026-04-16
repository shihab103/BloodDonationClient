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
    const { value: formValues } = await Swal.fire({
      title: `<h2 class="text-2xl font-bold text-slate-800">Request <span class="text-red-600">Blood</span></h2>`,
      html: `
        <div class="text-left mt-4 space-y-4 px-2">
          <div>
            <label class="block text-sm font-semibold text-slate-600 mb-1">Hospital Name</label>
            <input id="hospitalName" class="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="Enter hospital name...">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-600 mb-1">Full Address</label>
            <input id="fullAddress" class="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="Street, Upazila, District">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-600 mb-1">Donation Date</label>
              <input id="donationDate" type="date" class="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all">
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-600 mb-1">Time</label>
              <input id="donationTime" type="time" class="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all">
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-600 mb-1">Emergency Message</label>
            <textarea id="requestMessage" class="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all h-20" placeholder="Why do you need blood? (Optional)"></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit Request',
      confirmButtonColor: '#dc2626',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#94a3b8',
      focusConfirm: false,
      customClass: {
        popup: 'rounded-[32px] border-none shadow-2xl',
        confirmButton: 'rounded-xl px-6 py-3 font-bold',
        cancelButton: 'rounded-xl px-6 py-3 font-bold'
      },
      preConfirm: () => {
        const hospitalName = document.getElementById('hospitalName').value;
        const fullAddress = document.getElementById('fullAddress').value;
        const donationDate = document.getElementById('donationDate').value;
        const donationTime = document.getElementById('donationTime').value;
        const requestMessage = document.getElementById('requestMessage').value;

        if (!hospitalName || !fullAddress || !donationDate || !donationTime) {
          Swal.showValidationMessage('Please fill all required fields');
          return false;
        }
        return { hospitalName, fullAddress, donationDate, donationTime, requestMessage };
      }
    });

    if (formValues) {
      // অ্যাডমিন প্যানেলের ফিল্ডের সাথে মিল রেখে ডেটা অবজেক্ট
      const requestData = {
        requesterName: user?.displayName,
        requesterEmail: user?.email,
        donorName: donor.name,    // অ্যাডমিন পেজে এটি প্রয়োজন
        donorEmail: donor.email,  // অ্যাডমিন পেজে এটি প্রয়োজন
        recipientName: donor.name, 
        recipientDistrict: donor.location,
        bloodGroup: donor.bloodGroup,
        hospitalName: formValues.hospitalName,
        fullAddress: formValues.fullAddress,
        donationDate: formValues.donationDate,
        donationTime: formValues.donationTime,
        requestMessage: formValues.requestMessage,
        donationStatus: "inprogress", // অ্যাডমিন সরাসরি ইন-প্রগ্রেস সেকশনে দেখতে পাবে
        createdAt: new Date(),
      };

      try {
        const response = await axios.post(`${API_URL}/create-donation-request`, requestData);
        if (response.data.insertedId) {
          Swal.fire({
            title: 'Request Sent!',
            text: 'Your request is now in progress and visible to Admin.',
            icon: 'success',
            confirmButtonColor: '#dc2626',
            customClass: { popup: 'rounded-[24px]' }
          });
        }
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Something went wrong', 'error');
      }
    }
  };

  const filteredDonors = filterGroup 
    ? donors.filter(d => d.bloodGroup === filterGroup)
    : donors;

  if (loading) return <Loading/>;

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
              const isCurrentUser = user?.email === donor.email;

              return (
                <div key={donor._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-red-600 text-white px-5 py-2 rounded-bl-3xl font-bold">
                    {donor.bloodGroup}
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={donor.photoURL || 'https://via.placeholder.com/150'} 
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
                          {donor.joinedAt ? new Date(donor.joinedAt).toLocaleDateString() : 'N/A'}
                        </span>
                     </div>
                  </div>

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