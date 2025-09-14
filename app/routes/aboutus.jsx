import CoreBeliefs from "../components/corebeliefs";
import CTAButtons from "../components/CTAButtons";
import HowWeOperate from "../components/howweoperate";
import MissionVision from "../components/mission";
import OurStory from "../components/ourstory";
import ProvenResults from "../components/provenResult";
import WhatWeOffer from "../components/whatweoffer";
import WhyChooseUs from "../components/whychooseus";

export default function AboutUs() {
  return (
    <main className="bg-gray-900 text-gray-200">
      {/* Hero Banner */}
      <div
        className="h-64 sm:h-96 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/home/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400 text-center px-4">
            About Us
          </h1>
        </div>
      </div>
      {/* Sections */}
      <MissionVision />
      <OurStory />
      <WhatWeOffer />
      <WhyChooseUs />
      <CoreBeliefs />
      <HowWeOperate />
      <ProvenResults />
      <CTAButtons />
    </main>
  );
}
