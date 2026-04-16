import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { FaEllipsisV } from "react-icons/fa";
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
        Swal.fire("Success", "Role updated successfully", "success");
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
        Swal.fire("Success", "Status updated", "success");
        fetchUsers();
      }
    } catch (err) {
      Swal.fire("Error", "Status update failed", "error");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      <div className="mb-4 flex items-center gap-3">
        <label className="font-medium">Status Filter:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full text-sm border">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <img
                    src={u.photoURL || "https://i.ibb.co.com/XrdhGKc5/20211008-130744.jpg"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
                <td>
                  <div className="dropdown dropdown-left">
                    <label tabIndex={0} className="btn btn-sm btn-ghost">
                      <FaEllipsisV />
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded w-48"
                    >
                      {u.status === "active" ? (
                        <li>
                          <button onClick={() => updateStatus(u.email, "blocked")}>
                            Block User
                          </button>
                        </li>
                      ) : (
                        <li>
                          <button onClick={() => updateStatus(u.email, "active")}>
                            Unblock User
                          </button>
                        </li>
                      )}
                      {u.role !== "volunteer" && (
                        <li>
                          <button onClick={() => updateRole(u.email, "volunteer")}>
                            Make Volunteer
                          </button>
                        </li>
                      )}
                      {u.role !== "admin" && (
                        <li>
                          <button onClick={() => updateRole(u.email, "admin")}>
                            Make Admin
                          </button>
                        </li>
                      )}
                      {u.role !== "donor" && (
                        <li>
                          <button onClick={() => updateRole(u.email, "donor")}>
                            Make Donor
                          </button>
                        </li>
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
  );
};

export default AllUsers;
