import { Link, useNavigate } from "react-router";
import { useState, useContext } from "react";
import Lottie from "lottie-react";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
import loginAnimation from "../../assets/Lotties/Login.json";
import { AuthContext } from "../../Provider/AuthContext";

const Login = () => {
  const { signIn, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Email + Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const result = await signIn(email, password);
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome back, ${result.user?.email || "User"}!`,
      });
      navigate("/");
      e.target.reset();
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Google Login
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await googleSignIn();
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Logged in with Google",
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-6xl secondary shadow-xl rounded-lg flex flex-col md:flex-row overflow-hidden">

        {/* Left: Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-4xl font-bold text-center mb-6">Login now!</h1>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-center mb-3 text-sm">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                className="input bg input-bordered w-full"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                className="input bg input-bordered w-full"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="text-sm text-right">
              <a href="#" className="link link-hover">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn bg-[#407bff] text-white w-full"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="grow border-t"></div>
            <span className="mx-3 text-sm">OR</span>
            <div className="grow border-t"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 border py-2 w-full rounded-lg hover:bg-base-200 transition"
          >
            <FcGoogle size={22} />
            <span>Continue with Google</span>
          </button>

          <p className="mt-4 text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-[#669295] underline">
              Register here
            </Link>
          </p>
        </div>

        {/* Right: Lottie Animation */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-4">
          <Lottie
            animationData={loginAnimation}
            loop={true}
            className="w-full max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
