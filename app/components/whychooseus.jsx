// src/components/about/WhyChooseUs.jsx
export default function WhyChooseUs() {
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-yellow-400 text-center mb-6">
        Why <span className="text-white">Collins EduMart</span> Wins Top Marks
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* CBC Specialists */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3">📘 CBC Specialists</h3>
          <p>Direct collaboration with KICD curriculum developers</p>
          <p>Grade-specific bundles updated annually (PP1–Grade 12)</p>
          <blockquote className="italic mt-2">
            "The only supplier that truly understands CBC pain points" - KNUT
          </blockquote>
        </div>

        {/* Kenyan-Tough Quality */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3">
            🛡 Kenyan-Tough Quality
          </h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>Exercise books with 400+ page capacity</li>
            <li>Tablets tested in ASAL county conditions</li>
            <li>3-year warranty on all teaching aids</li>
          </ul>
        </div>

        {/* Real Cost Savings */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3">💰 Real Cost Savings</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>Best Price Guarantee + loyalty discounts</li>
            <li>Free delivery for schools (no minimum order)</li>
            <li>Buy-back program for old textbooks</li>
          </ul>
        </div>

        {/* Beyond the Box */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3">🚀 Beyond the Box</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>Teacher training workshops</li>
            <li>Parent financing plans</li>
            <li>Student performance tracking dashboard</li>
          </ul>
        </div>

        {/* Proven Impact */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3">🏆 Proven Impact</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>28% avg score improvement in partner schools</li>
            <li>2023 National Education Supplier of the Year</li>
            <li>4.9/5 from 15,000+ verified reviews</li>
          </ul>
          <blockquote className="italic mt-2">
            "They don't just sell books - they build better learners" - Ministry
            of Education
          </blockquote>
        </div>
      </div>
    </section>
  );
}
