// src/components/about/WhatWeOffer.jsx
export default function WhatWeOffer() {
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">
        What We Offer
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {/* Bestsellers */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-4">
            🏆 Bestsellers & Favorites
          </h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li>
              <strong>🔥 CBC DIGITAL STARTER KIT</strong>
              <br />
              Android Tablets, Shockproof Case
            </li>
            <li>
              <strong>GRADE 6/9 SUPER REVISION PACK</strong>
              <br />
              Ranging from Workbooks, Past Papers, Mnemonic Flashcards
            </li>
          </ul>
        </div>

        {/* Curriculum Materials */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-4">
            📚 Curriculum Materials
          </h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li>Textbooks (PP1–Grade 9) </li>
            <li>Revision Packs </li>
            <li>Teacher's Guides & Lesson Plans </li>
          </ul>
        </div>

        {/* STEM Kits */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-4">🔬 STEM Education Kits</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li>Science & Tech Explorer Box 15+ Experiments, Coding Basics</li>
            <li>
              Mathematics Mastery Kit comprising of Fractions, Geometry, Math
              Games)
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
