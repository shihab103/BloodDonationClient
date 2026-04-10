import { useNavigate } from "react-router";
import Lottie from "lottie-react";
import { TypeAnimation } from "react-type-animation";
import animationData from "../../assets/Lotties/bannerAnimation_1.json";

const Banner = () => {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate("/find-donor");
  };
  const handleContribute = () => {
    navigate("/selfless-contribution");
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
            className="group relative bg-[#d32f2f] text-white font-bold py-4 px-10 rounded-full transition-all duration-300 ease-in-out shadow-[0_10px_20px_-10px_rgba(211,47,47,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(211,47,47,0.6)] hover:-translate-y-0.5 overflow-hidden active:scale-95"
          >
            {/* বাটন শাইন ইফেক্ট */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            
            <span className="relative z-10 flex items-center gap-2">
              Find the Donor
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
            </span>
          </button>
          <button
            onClick={handleContribute}
            className="group relative bg-[#d32f2f] text-white font-bold py-4 px-10 rounded-full transition-all duration-300 ease-in-out shadow-[0_10px_20px_-10px_rgba(211,47,47,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(211,47,47,0.6)] hover:-translate-y-0.5 overflow-hidden active:scale-95"
          >
            {/* বাটন শাইন ইফেক্ট */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            
            <span className="relative z-10 flex items-center gap-2">
              Selfless Contribution
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
            </span>
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
