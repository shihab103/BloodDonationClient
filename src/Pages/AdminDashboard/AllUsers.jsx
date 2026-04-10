import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { FaEllipsisV, FaUserShield, FaUserEdit, FaUserSlash, FaUserCheck } from "react-icons/fa";
import { useAxiosSecure } from "../../utils/axiosSecure";
import { AuthContext } from "../../Provider/AuthContext";

const AllUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const axiosSecure = useAxiosSecure();

  const fetchUsers = async () => {
    try {
      const res = await axiosSecure.get("/get-all-users");
      const fetchedUsers = res.data;
      if (statusFilter === "all") {
        setUsers(fetchedUsers);
      } else {
        setUsers(fetchedUsers.filter((u) => u.status === statusFilter));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchUsers();
    }
  }, [user, statusFilter]);

  const updateRole = async (email, role) => {
    try {
      const res = await axiosSecure.patch("/update-role", { email, role });
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: 'success',
          title: 'Role Updated',
          text: `The user is now a ${role}`,
          timer: 1500,
          showConfirmButton: false
        });
        fetchUsers();
      }
    } catch (err) {
      Swal.fire("Error", "Role update failed", "error");
    }
  };

  const updateStatus = async (email, status) => {
    try {
      const res = await axiosSecure.patch("/update-status", { email, status });
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: 'success',
          title: status === 'active' ? 'User Unblocked' : 'User Blocked',
          timer: 1500,
          showConfirmButton: false
        });
        fetchUsers();
      }
    } catch (err) {
      Swal.fire("Error", "Status update failed", "error");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-base-200">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <h2 className="text-3xl font-extrabold text-primary">All Users</h2>
            <p className="text-gray-500 text-sm mt-1">Manage user roles and permissions</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-600">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select select-bordered select-sm w-full max-w-xs focus:outline-none border-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* Table/Card Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              {/* head */}
              <thead className="bg-primary text-white">
                <tr className="border-none">
                  <th className="py-4 px-6 rounded-tl-2xl">User Info</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-center rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-blue-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={u.photoURL || "https://i.ibb.co/XrdhGKc5/20211008-130744.jpg"} alt="Avatar" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">{u.name}</div>
                          <div className="text-xs opacity-60 font-medium">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-ghost font-semibold uppercase text-[10px] p-2 ${
                        u.role === 'admin' ? 'text-error border-error' : 
                        u.role === 'volunteer' ? 'text-info border-info' : 'text-success border-success'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <div className={`badge gap-1 ${u.status === 'active' ? 'badge-success' : 'badge-error'} text-white text-xs`}>
                        {u.status === 'active' ? <FaUserCheck size={10}/> : <FaUserSlash size={10}/>}
                        {u.status}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="dropdown dropdown-left dropdown-end">
                        <label tabIndex={0} className="btn btn-circle btn-ghost btn-sm bg-gray-100 hover:bg-primary hover:text-white transition-all">
                          <FaEllipsisV />
                        </label>
                        <ul tabIndex={0} className="dropdown-content z-[20] menu p-2 shadow-2xl bg-base-100 rounded-xl w-52 border border-gray-100">
                          <li className="menu-title text-gray-400 text-[10px] uppercase">Update Status</li>
                          <li>
                            {u.status === "active" ? (
                              <button className="text-error" onClick={() => updateStatus(u.email, "blocked")}>
                                <FaUserSlash /> Block User
                              </button>
                            ) : (
                              <button className="text-success" onClick={() => updateStatus(u.email, "active")}>
                                <FaUserCheck /> Unblock User
                              </button>
                            )}
                          </li>
                          <div className="divider my-0"></div>
                          <li className="menu-title text-gray-400 text-[10px] uppercase">Promote/Demote</li>
                          {u.role !== "admin" && (
                            <li><button onClick={() => updateRole(u.email, "admin")}><FaUserShield className="text-error" /> Make Admin</button></li>
                          )}
                          {u.role !== "donor" && (
                            <li><button onClick={() => updateRole(u.email, "donor")}><FaUserEdit className="text-success" /> Make Donor</button></li>
                          )}
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="text-center py-20 bg-white mt-4 rounded-2xl shadow-inner">
            <p className="text-gray-400 italic font-medium">No users found with "{statusFilter}" status.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;