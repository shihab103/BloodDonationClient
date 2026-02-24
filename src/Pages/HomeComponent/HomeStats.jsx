import image from "../../assets/About (2).jpg";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import {
  FaHeartbeat,
  FaHandsHelping,
  FaUserPlus,
  FaCheckCircle,
} from "react-icons/fa";

const stats = [
  {
    id: 1,
    icon: <FaUserPlus className="text-red-600 w-12 h-12" />,
    title: "Total Donors",
    count: 1250,
  },
  {
    id: 2,
    icon: <FaHeartbeat className="text-red-600 w-12 h-12" />,
    title: "Active Requests",
    count: 87,
  },
  {
    id: 3,
    icon: <FaCheckCircle className="text-red-600 w-12 h-12" />,
    title: "Successful Donations",
    count: 1023,
  },
  {
    id: 4,
    icon: <FaHandsHelping className="text-red-600 w-12 h-12" />,
    title: "Volunteers",
    count: 540,
  },
];

const HomeStats = () => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  return (
    <section ref={ref} className="bg-red-50 py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-col lg:flex-col items-center gap-10">
        {/* Image + Text */}
        <div className="flex flex-col lg:flex-row items-center w-full gap-10">
          {/* Image */}
          <div className="w-full lg:w-1/2">
            <img
              src={image}
              alt="Blood Donation Awareness"
              className="rounded-lg shadow-lg object-cover w-full h-[300px] md:h-[400px] lg:h-[450px]"
            />
          </div>

          {/* Text */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-red-600 leading-tight">
              Donate Blood, Save Lives ❤️
            </h2>
            <p className="text-gray-700 text-md md:text-lg lg:text-xl">
              Blood donation is not just about giving; it’s about giving hope,
              life, and health. Join our growing community of donors and
              volunteers making a real difference in people’s lives.
            </p>
            <p className="text-gray-600 text-sm md:text-md lg:text-lg">
              Every drop counts! Whether it’s your first donation or your
              hundredth, your contribution can save lives. Together, we can
              create a world where blood shortage is a thing of the past.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8 w-full max-w-5xl">
          {stats.map(({ id, icon, title, count }) => (
            <div
              key={id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 cursor-default"
            >
              <div>{icon}</div>
              <h3 className="mt-3 text-3xl font-bold text-red-600">
                {inView ? (
                  <CountUp
                    key={id + "-" + inView}
                    end={count}
                    duration={2.5}
                    separator=","
                  />
                ) : (
                  0
                )}
              </h3>
              <p className="mt-1 text-md font-semibold text-gray-700">
                {title}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <button
          onClick={() => (window.location.href = "/search-page")}
          className="mt-10 bg-red-600 hover:bg-red-700 transition text-white px-8 py-3 rounded-lg font-semibold shadow-lg"
        >
          Become a Donor
        </button>
      </div>
    </section>
  );
};

export default HomeStats;
