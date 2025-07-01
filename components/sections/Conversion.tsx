import { Rocket } from "lucide-react";
import { WaitlistForm } from "./WaitlistForm";

export const Conversion = () => {
  return (
    <section id="waitlist" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-blue-600 p-3 rounded-full mb-6">
            <Rocket className="text-white" size={32} />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Get Ready for the Next Leap
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            We are building <span className="font-bold text-white">KortexAI.app</span>, the ultimate SaaS platform to turn your knowledge base into an intelligent, queryable asset. Be the first to know when we launch.
          </p>
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}; 