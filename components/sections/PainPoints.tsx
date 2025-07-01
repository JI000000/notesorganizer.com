import { CheckCircle } from 'lucide-react'; // A popular icon library

const painPoints = [
  { text: "Your notes are scattered across five different apps." },
  { text: "Brilliant ideas are lost in a sea of unstructured text." },
  { text: "Your 'Second Brain' feels more like a 'Second Junk Drawer'." },
  { text: "You wrote it down, but can't find it when it matters most." },
];

const PainPointsSection = () => {
  return (
    <section id="pain-points" className="w-full py-20 bg-gray-900">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white">Does This Sound Familiar?</h2>
        <div className="mt-10 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {painPoints.map((point, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-lg text-gray-300">{point.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-2xl font-semibold text-white max-w-3xl mx-auto">
          You're not disorganized. You just lack a system.
          <br />
          <span className="text-brand-blue">We're here to give you that system, for free.</span>
        </p>
      </div>
    </section>
  );
};

export default PainPointsSection; 