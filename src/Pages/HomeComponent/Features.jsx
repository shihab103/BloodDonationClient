import { FaHandHoldingHeart, FaUsers, FaHeartbeat } from "react-icons/fa";

const Featured = () => {
  return (
    <section className="bg-[#ffcdd2c6] py-12">
      <div className="w-11/12 mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-stone-700 mb-4">
          Why <span className="text-red-500">Blood Donate</span> Matters
        </h2>
        <p className="text-stone-600 max-w-2xl mx-auto mb-10">
          Every drop counts. Join our growing community of lifesavers who believe in humanity,
          compassion, and making a real difference—one donation at a time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-all">
            <FaHandHoldingHeart className="text-red-500 text-4xl mb-4 mx-auto" />
            <h4 className="text-xl font-semibold text-stone-700 mb-2">Save Lives Instantly</h4>
            <p className="text-sm text-stone-600">
              Connect with donors and recipients within minutes. Emergency blood needs met faster than ever.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-all">
            <FaUsers className="text-red-500 text-4xl mb-4 mx-auto" />
            <h4 className="text-xl font-semibold text-stone-700 mb-2">Trusted Community</h4>
            <p className="text-sm text-stone-600">
              Verified users and active volunteers build a safe and reliable donation environment.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-all">
            <FaHeartbeat className="text-red-500 text-4xl mb-4 mx-auto" />
            <h4 className="text-xl font-semibold text-stone-700 mb-2">Track Your Impact</h4>
            <p className="text-sm text-stone-600">
              Donors can view their history, monitor their eligibility, and feel proud of the lives they've saved.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Featured;
