import { useForm } from "react-hook-form";
import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../../Provider/AuthContext";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { createUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  // load districts
  useEffect(() => {
    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => {
        const districtsData =
          data.find((item) => item.name === "districts")?.data || [];
        setDistricts(districtsData);
      });
  }, []);

  // load upazilas
  useEffect(() => {
    fetch("/upazilas.json")
      .then((res) => res.json())
      .then((data) => {
        const upazilasData =
          data.find((item) => item.name === "upazilas")?.data || [];
        setUpazilas(upazilasData);
      });
  }, []);

  const onSubmit = async (formData) => {
    const { confirmPassword, avatar, ...userData } = formData;

    try {
      // Firebase user create
      await createUser(userData.email, userData.password);

      const selectedDistrict = districts.find(
        (d) => d.id.toString() === userData.district,
      );

      const selectedUpazila = upazilas.find(
        (u) => u.id.toString() === userData.upazila,
      );

      const backendData = {
        name: userData.name,
        email: userData.email,
        photoURL: avatar,
        bloodGroup: userData.bloodGroup,
        district: userData.district,
        upazila: userData.upazila,
        districtName: selectedDistrict?.name || "",
        upazilaName: selectedUpazila?.name || "",
        role: "donor",
        status: "active",
      };

      // send data to backend
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/add-user`,
        backendData,
      );

      if (res.data.insertedId) {
        Swal.fire("Success", "Registration successful", "success").then(() => {
          navigate("/dashboard");
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", error.message || "Registration failed", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-3xl font-bold mb-6 text-center text-red-600">
        Blood Donor Registration
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Name */}
        <div>
          <label className="block mb-1 font-semibold">Full Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="input input-bordered w-full"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="input input-bordered w-full"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-semibold">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            className="input input-bordered w-full"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-1 font-semibold">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            className="input input-bordered w-full"
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Avatar */}
        <div>
          <label className="block mb-1 font-semibold">Avatar Image URL</label>
          <input
            type="url"
            {...register("avatar", { required: "Avatar is required" })}
            className="input input-bordered w-full"
          />
          {errors.avatar && (
            <p className="text-red-500">{errors.avatar.message}</p>
          )}
        </div>

        {/* Blood Group */}
        <div>
          <label className="block mb-1 font-semibold">Blood Group</label>
          <select
            {...register("bloodGroup", {
              required: "Blood Group is required",
            })}
            className="select select-bordered w-full"
          >
            <option value="">Select Blood Group</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
          {errors.bloodGroup && (
            <p className="text-red-500">{errors.bloodGroup.message}</p>
          )}
        </div>

        {/* District */}
        <div>
          <label className="block mb-1 font-semibold">District</label>
          <select
            {...register("district", { required: "District is required" })}
            onChange={(e) => setSelectedDistrictId(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-red-500">{errors.district.message}</p>
          )}
        </div>

        {/* Upazila */}
        <div>
          <label className="block mb-1 font-semibold">Upazila</label>
          <select
            {...register("upazila", { required: "Upazila is required" })}
            className="select select-bordered w-full"
            disabled={!selectedDistrictId}
          >
            <option value="">Select Upazila</option>
            {upazilas
              .filter(
                (u) =>
                  u.district_id.toString() === selectedDistrictId.toString(),
              )
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
          </select>
          {errors.upazila && (
            <p className="text-red-500">{errors.upazila.message}</p>
          )}
        </div>

        {/* Submit */}
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            className="btn btn-error w-full mt-4 text-white"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
