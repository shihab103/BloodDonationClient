import Lottie from "lottie-react";
import { useEffect, useState } from "react";

const Loading = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/bloodLoading.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load animation:", err));
  }, []);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-[200px] mb-6">
        <Lottie animationData={animationData} loop={true} />
      </div>
    </div>
  );
};

export default Loading;
