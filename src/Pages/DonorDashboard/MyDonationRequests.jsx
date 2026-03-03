import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../providers/AuthProvider";
import Pagination from "./Pagination";

const MyDonationRequests = () => {
 // const { user } = useContext(AuthContext);
   
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
   
  
    <div className="p-6 md:p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-600 flex items-center justify-center gap-2">
        🩸 My Donation Requests
      </h2>

      {/* Filter */}
      <div className="flex justify-end mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="text-xs uppercase bg-red-100 text-red-700">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Recipient</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Blood Group</th>
              <th className="px-4 py-3">Date & Time</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((req, idx) => (
              <tr key={req._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium">{indexOfFirst + idx + 1}</td>
                <td className="px-4 py-3">{req.recipientName}</td>
                <td className="px-4 py-3">
                  {req.recipientDistrict}, {req.recipientUpazila}
                </td>
                <td className="px-4 py-3 font-semibold">{req.bloodGroup}</td>
                <td className="px-4 py-3">
                  {req.donationDate} at {req.donationTime}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full 
                      ${
                        req.donationStatus === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : req.donationStatus === "inprogress"
                          ? "bg-blue-100 text-blue-700"
                          : req.donationStatus === "done"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {req.donationStatus}
                  </span>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center px-4 py-8 text-gray-500">
                  No donation requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default MyDonationRequests;