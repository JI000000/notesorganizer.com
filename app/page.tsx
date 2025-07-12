import HeroSection from "@/components/sections/Hero";
import DemoPreview from "@/components/sections/DemoPreview";
import PainPointsSection from "@/components/sections/PainPoints";
import ToolkitSection from "@/components/sections/Toolkit";
import VisualCollaboration from "@/components/sections/VisualCollaboration";
import { Conversion } from "@/components/sections/Conversion";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PainPointsSection />
      <DemoPreview />
      <ToolkitSection />
      <VisualCollaboration />
      <Conversion />
    </>
  );
} 