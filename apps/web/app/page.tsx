import Navbar from "../components/Navbar";
import HeroSection from "../components/landing_page/HeroSection";
import HowItWorks from "../components/landing_page/HowItWorks";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Navbar/>
      <HeroSection/>
      <HowItWorks/>
    </div>
  );
}
