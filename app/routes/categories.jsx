import { Link } from "react-router";

const categories = [
  { id: "textbooks", name: "Textbooks" },
  { id: "revision", name: "Revision Materials" },
  { id: "storybooks", name: "Storybooks" },
  { id: "teaching-aids", name: "Teaching Aids" },
  { id: "digital", name: "Digital Products" },
];

export default function () {
  return (
    <main>
      {/* <div className="grid grid-cols-5">
        <h2>Textbooks 📚</h2>
        <h2>Revision Materials 📖</h2>
        <h2>Story books 📕</h2>
        <h2>Teaching Aids 🧠</h2>
        <h2>Digital Products 💻</h2>
      </div> */}
      <div>
        <h1>Categories</h1>
        <ul>
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link to={`/categories/${cat.id}`}>{cat.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
