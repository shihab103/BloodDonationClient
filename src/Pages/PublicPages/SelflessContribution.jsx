import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Provider/AuthContext";
import Swal from "sweetalert2";
import Loading from "../../Component/Loading/Loading";

const SelflessContribution = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const authLoading = auth?.loading;

  const API_URL = import.meta.env.VITE_API_URL;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) {
        if (!authLoading) setLoading(false);
        return;
      }

      try {
        // Only fetching main user profile data
        const response = await axios.get(`${API_URL}/users/${user.email}`);
        setUserData(response.data);
      } catch (error) {
        console.error("User data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.email, authLoading, API_URL]);

  const handleContribute = async () => {
    if (!userData) return;

    // Initial Confirmation
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to register as a voluntary blood donor?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Register!',
    });

    if (result.isConfirmed) {
      try {
        setIsSubmitting(true);
        const payload = {
          userId: userData._id,
          name: userData.name,
          email: userData.email,
          bloodGroup: userData.bloodGroup,
          location: `${userData.upazilaName}, ${userData.districtName}`,
          photoURL: userData.photoURL,
          joinedAt: new Date(),
          status: 'active'
        };

        const response = await axios.post(`${API_URL}/add-voluntary-donor`, payload);
        
        if (response.data.insertedId) {
          await Swal.fire({
            title: 'Success!',
            text: 'Thank you! You are now a registered donor. ❤️',
            icon: 'success',
            confirmButtonColor: '#d32f2f',
          });
          window.history.back();
        }
      } catch (error) {
        // Backend handles duplicate checking and sends the message
        Swal.fire({
          title: 'Notice',
          text: error.response?.data?.message || "Something went wrong. Please try again.",
          icon: error.response?.status === 400 ? 'info' : 'error',
          confirmButtonColor: '#d32f2f',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading || authLoading) {
    return (
      <Loading/>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
        <p className="text-xl font-bold text-red-600">Please login to access this page.</p>
        <button 
          onClick={() => window.history.back()}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg shadow-md"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Header Section */}
      <div className="relative bg-[#d32f2f] pb-12 mb-25 pt-12 text-white shadow-inner">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
             <img 
                src={userData?.photoURL || "https://via.placeholder.com/150"} 
                className="h-28 w-28 rounded-full border-4 border-white/20 object-cover shadow-2xl" 
                alt="Profile"
              />
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-extrabold">{userData?.name || "User Name"}</h2>
                <div className="mt-2 space-y-1">
                  <p className="opacity-90 flex items-center justify-center md:justify-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    {userData?.email}
                  </p>
                  <p className="opacity-90 flex items-center justify-center md:justify-start gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                     {userData?.upazilaName}, {userData?.districtName}
                  </p>
                </div>
              </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-6 md:p-10">
            <div className="flex items-center gap-4 mb-6 text-slate-800">
              <div className="p-3 bg-red-50 rounded-2xl text-[#d32f2f]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Save a Life</h3>
                <p className="text-slate-500 text-sm">Join the community of heroes</p>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed mb-8 text-[15px]">
              By clicking the button below, your profile will be added to our voluntary donor list. This allows people in need to contact you during emergencies based on your blood group and location.
            </p>

            <button 
              onClick={handleContribute}
              disabled={isSubmitting || !userData}
              className={`w-full py-5 rounded-2xl flex items-center justify-center space-x-3 text-white text-lg font-bold shadow-2xl transition-all active:scale-[0.98] 
              ${isSubmitting || !userData ? 'bg-red-300 cursor-not-allowed' : 'bg-[#d32f2f] hover:bg-red-800 shadow-red-200'}`}
            >
              {isSubmitting ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                  <span>Register Now</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-8 h-fit border-t-8 border-[#d32f2f] text-center">
            <h4 className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">Blood Group</h4>
            <div className="relative inline-block text-[#d32f2f]">
              <svg viewBox="0 0 100 100" className="w-36 h-36 text-red-50 drop-shadow-sm">
                <path fill="currentColor" d="M50 0C50 0 20 40 20 65C20 82 34 95 50 95C66 95 80 82 80 65C80 40 50 0 50 0Z" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-5xl font-black pt-4">
                {userData?.bloodGroup || "--"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelflessContribution;