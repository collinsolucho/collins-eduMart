import { Link } from "react-router";

export default function CTAButtons() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <Link to="/contactus">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
          Reach Us
        </button>
      </Link>
      <Link to="/products">
        <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition">
          Shop Now
        </button>
      </Link>
    </div>
  );
}
