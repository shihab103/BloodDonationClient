import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import { useAxiosSecure } from "../../utils/axiosSecure";
import { AuthContext } from "../../Provider/AuthContext";

const DonorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [donationRequests, setDonationRequests] = useState([]);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`${import.meta.env.VITE_API_URL}/my-donation-requests?email=${user.email}`)
        .then((res) => {
          const recent = res.data?.slice(0, 3);
          setDonationRequests(recent);
        })
        .catch((error) => console.error(error));
    }
  }, [user?.email, axiosSecure]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/donation-requests/${id}`, {
        status: newStatus,
      });
      setDonationRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: newStatus } : req
        )
      );
      Swal.fire({
        icon: "success",
        title: `Status updated to "${newStatus}"`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Status update failed", error);
      Swal.fire("Error!", "Status update failed!", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(
          `${import.meta.env.VITE_API_URL}/donation-requests/${id}`
        );
        setDonationRequests((prev) =>
          prev.filter((req) => req._id !== id)
        );
        Swal.fire(
          "Deleted!",
          "Your donation request has been deleted.",
          "success"
        );
      } catch (error) {
        console.error("Delete failed", error);
        Swal.fire("Error!", "Failed to delete the request.", "error");
      }
    }
  };

  return (
    <div className="p-5 md:p-10">
      <h2 className="text-3xl font-bold mb-6">
        Welcome, {user?.displayName || "Donor"} 🩸
      </h2>

      {donationRequests.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Recent 3 Donation Requests
          </h3>
          <div className="overflow-x-auto">
            <table className="table w-full border">
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Blood Group</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donationRequests.map((req) => (
                  <tr key={req._id}>
                    <td>{req.recipientName}</td>
                    <td>
                      {req.recipientDistrict}, {req.recipientUpazila}
                    </td>
                    <td>{req.donationDate}</td>
                    <td>{req.donationTime}</td>
                    <td>{req.bloodGroup}</td>
                    <td>{req.status}</td>
                    <td className="flex gap-2 flex-wrap">
                      {req.status === "inprogress" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(req._id, "done")
                            }
                            className="btn btn-sm btn-success"
                          >
                            Done
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(req._id, "canceled")
                            }
                            className="btn btn-sm btn-warning"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/edit-donation-request/${req._id}`
                          )
                        }
                        className="btn btn-sm btn-info"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(req._id)}
                        className="btn btn-sm btn-error"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/dashboard/my-donation-request/${req._id}`)
                        }
                        className="btn btn-sm btn-neutral"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={() => navigate("/dashboard/my-donation-requests")}
              className="btn btn-outline btn-primary"
            >
              View My All Requests
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
