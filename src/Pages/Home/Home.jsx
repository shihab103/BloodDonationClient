import Banner from "../HomeComponent/Banner";
import Features from "../HomeComponent/Features";
import HomeStats from "../HomeComponent/HomeStats";
import ContactUs from "../HomeComponent/ContactUs";

export default function Home() {
  return (
    <div>
      <Banner/>
      <Features/>
      <HomeStats/>
      <ContactUs/>
    </div>
  );
}
