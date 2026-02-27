 import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Provider/AuthContext";

const DonationRequest=()=> {
  const { user } = useContext(AuthContext);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Load district & upazila data from json
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
        const upazilaData =
          data.find((item) => item.name === "upazilas")?.data || [];
        setUpazilas(upazilaData);
      });
  }, []);

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrictId(districtId);
    const matchedUpazilas = upazilas.filter(
      (u) => u.district_id === districtId
    );
    setFilteredUpazilas(matchedUpazilas);
  };

  const onSubmit = async (data) => {

    const selectedDistrict = districts.find((d) => d.id === data.recipientDistrict);
    const selectedUpazila = upazilas.find((u) => u.id === data.recipientUpazila);

    const requestData = {
      requesterName: user?.displayName,
      requesterEmail: user?.email,
      ...data,
      recipientDistrict: selectedDistrict?.name || "",
      recipientUpazila: selectedUpazila?.name || "",
      donationStatus: "pending",
    };
    console.log("requestData====",requestData);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">🩸 Create Donation Request</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Your Name</label>
            <input
              type="text"
              value={user?.displayName || ""}
              readOnly
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Your Email</label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Recipient Name</label>
            <input
              {...register("recipientName", { required: true })}
              placeholder="Recipient Name"
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Recipient District</label>
            <select
              {...register("recipientDistrict", { required: true })}
              className="select select-bordered w-full"
              onChange={handleDistrictChange}
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Recipient Upazila</label>
            <select {...register("recipientUpazila", { required: true })} className="select select-bordered w-full">
              <option value="">Select Upazila</option>
              {filteredUpazilas.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Hospital Name</label>
            <input
              {...register("hospitalName", { required: true })}
              placeholder="Hospital Name"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Full Address</label>
            <input
              {...register("fullAddress", { required: true })}
              placeholder="Full Address"
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Blood Group</label>
            <select {...register("bloodGroup", { required: true })} className="select select-bordered w-full">
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Donation Date</label>
            <input
              {...register("donationDate", { required: true })}
              type="date"
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Donation Time</label>
            <input
              {...register("donationTime", { required: true })}
              type="time"
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Request Message</label>
            <textarea
              {...register("requestMessage", { required: true })}
              placeholder="Write a message..."
              className="textarea textarea-bordered w-full h-32"
            ></textarea>
          </div>
          <div>
            <button type="submit" className="btn btn-primary w-full mt-2">
              Submit Request
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DonationRequest;