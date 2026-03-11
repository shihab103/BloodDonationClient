import { useContext, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Provider/AuthContext";
import { useAxiosSecure } from "../../utils/axiosSecure";
import Loading from "../Loading/Loading";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [isEditing, setIsEditing] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [userData, setUserData] = useState(null);

  const resetDone = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm();

  // Load user data from backend
  useEffect(() => {
    axiosSecure.get(`/users/${user.email}`).then((res) => {
      setUserData(res.data);
    });
  }, [user, axiosSecure]);

  // Reset form only once after userData is loaded
  useEffect(() => {
    if (userData && !resetDone.current) {
      reset({
        name: userData.name,
        photoURL: userData.photoURL,
        bloodGroup: userData.bloodGroup,
        district: userData.district,
        upazila: userData.upazila,
      });
      resetDone.current = true;
    }
  }, [userData, reset]);

  // Load districts and upazilas
  useEffect(() => {
    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => {
        const districtsData =
          data.find((item) => item.name === "districts")?.data || [];
        setDistricts(districtsData);
      });

    fetch("/upazilas.json")
      .then((res) => res.json())
      .then((data) => {
        const upazilasData =
          data.find((item) => item.name === "upazilas")?.data || [];
        setUpazilas(upazilasData);
      });
  }, []);

  const onSubmit = async (data) => {
    try {
      const selectedDistrict = districts.find(
        (d) => d.id.toString() === data.district
      );
      const selectedUpazila = upazilas.find(
        (u) => u.id.toString() === data.upazila
      );

      const updateData = {
        ...data,
        districtName: selectedDistrict?.name || "",
        upazilaName: selectedUpazila?.name || "",
      };

      const res = await axiosSecure.put(`/users/${user.email}`, updateData);
      if (res.data.modifiedCount > 0) {
        Swal.fire("Success", "Profile updated", "success");
        setIsEditing(false);
        setUserData((prev) => ({ ...prev, ...updateData }));
        resetDone.current = false; // allow future reset
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  if (!userData) return <Loading/>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-red-500">My Profile</h2>
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            if (!isEditing && userData) {
              reset({
                name: userData.name,
                photoURL: userData.photoURL,
                bloodGroup: userData.bloodGroup,
                district: userData.district,
                upazila: userData.upazila,
              });
              resetDone.current = true;
            }
          }}
          className="btn btn-sm btn-outline btn-error"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Name */}
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            {...register("name")}
            disabled={!isEditing}
            className="input input-bordered w-full"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        {/* Avatar */}
        <div>
          <label className="block font-medium">Avatar URL</label>
          <input
            type="url"
            {...register("photoURL")}
            disabled={!isEditing}
            className="input input-bordered w-full"
          />
        </div>

        {/* Blood Group */}
        <div>
          <label className="block font-medium">Blood Group</label>
          <select
            {...register("bloodGroup")}
            disabled={!isEditing}
            className="select select-bordered w-full"
          >
            <option value="">Select Group</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block font-medium">District</label>
          <select
            {...register("district")}
            disabled={!isEditing}
            className="select select-bordered w-full"
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Upazila */}
        <div>
          <label className="block font-medium">Upazila</label>
          <select
            {...register("upazila")}
            disabled={!isEditing}
            className="select select-bordered w-full"
          >
            <option value="">Select Upazila</option>
            {upazilas
              .filter(
                (u) =>
                  u.district_id.toString() === watch("district")?.toString()
              )
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
          </select>
        </div>

        {/* Submit Button */}
        {isEditing && (
          <div className="md:col-span-2">
            <button type="submit" className="btn btn-error w-full text-white">
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
