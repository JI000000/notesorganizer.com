import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/Hero";
import PainPointsSection from "@/components/sections/PainPoints";
import ToolkitSection from "@/components/sections/Toolkit";
import ConversionSection from "@/components/sections/Conversion";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center">
        <HeroSection />
        <PainPointsSection />
        <ToolkitSection />
        <ConversionSection />
      </main>
      <Footer />
    </>
  );
} 