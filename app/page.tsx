import HeroSection from "@/components/sections/Hero";
import PainPointsSection from "@/components/sections/PainPoints";
import ToolkitSection from "@/components/sections/Toolkit";
import { Conversion } from "@/components/sections/Conversion";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PainPointsSection />
      <ToolkitSection />
      <Conversion />
    </>
  );
} 