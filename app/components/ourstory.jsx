export default function OurStory() {
  return (
    <section className="py-8 px-4 bg-gray-900 text-gray-200 max-w-5xl mx-auto space-y-6">
      <img
        src="/story/brand.jpg"
        alt="Collins EduMart Brand"
        className="w-full rounded-md mb-4"
      />

      <h2 className="text-3xl font-bold">👥 Our Founders' Story</h2>
      <p>
        "As a teacher in rural Eldoret, I spent half my salary photocopying
        materials because students couldn't afford books. When CBC launched, the
        problem worsened. That's why we built{" "}
        <span className="font-bold text-yellow-400">Collins EduMart</span> — to
        make quality learning accessible to every Kenyan child."
      </p>
      <p className="italic">— Maurice Shisya, Former Teacher & CEO</p>

      <img
        src="/home/oldman.jpg"
        alt="Maurice Shisya Founder"
        className="w-48 sm:w-64 rounded-md mx-auto mt-4"
      />

      <h3 className="text-2xl font-semibold">The Team Making It Happen</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          👩🏫 Education Experts – KICD consultants, top KCSE examiners,
          Montessori specialists
        </li>
        <li>
          💻 Tech Innovators – Engineers & app developers building CBC-aligned
          content
        </li>
        <li>📦 Logistics Heroes – Delivering to all 47 counties reliably</li>
      </ul>
    </section>
  );
}
