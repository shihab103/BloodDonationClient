import { useNavigate } from "react-router";
import Lottie from "lottie-react";
import { TypeAnimation } from "react-type-animation";
import animationData from "../../assets/Lotties/bannerAnimation_1.json";

const Banner = () => {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate("/registration");
  };

  const handleSearch = () => {
    navigate("/search-page");
  };

  return (
    <div className="bg-[#ffcdd2] py-12 px-4 md:px-10 lg:px-20 min-h-[calc(100vh-68px)] flex flex-col-reverse md:flex-row items-center justify-between gap-10">
      {/* Left Content */}
      <div className="text-center md:text-left max-w-xl">
        <h1 style={{ fontSize: "3em", fontWeight: "bold" }}>
          Be a Hero,&nbsp;
          <span style={{ color: "#d32f2f" }}>
            <TypeAnimation
              sequence={[
                "Save a Life!",
                1000,
                "Give Hope!",
                1000,
                "Act Now!",
                1000,
                "Be a Donor",
                1000,
              ]}
              speed={50}
              repeat={Infinity}
            />
          </span>
        </h1>
        <p className="text-gray-700 mb-8">
          Join our Blood Donation community and make a difference today. Whether
          you're donating or searching, we're here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <button
            onClick={handleJoin}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md transition"
          >
            Join as a Donor
          </button>
          <button
            onClick={handleSearch}
            className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-100 font-semibold py-3 px-6 rounded-md transition"
          >
            Search Donors
          </button>
        </div>
      </div>

      {/* Right Lottie Animation */}
      <div className="w-full md:w-1/2 max-w-md">
        <Lottie animationData={animationData} loop={true} />
      </div>
    </div>
  );
};

export default Banner;
