export function meta() {
  return [
    { title: "Collins EduMart" },
    {
      name: "description",
      content: "Welcome to the leading book store in Kenya!",
    },
  ];
}
import { data, Form, Link, redirect, useLoaderData } from "react-router";
import { Card } from "../components/featured";
import {
  commitSession,
  getSession,
  setSuccessMessage,
  setErrorMessage,
} from "../.server/session";
import { addSubscriber, getItem } from "../model/database";
import { validateText } from "../.server/validation";

export async function loader() {
  const items = await getItem();
  const featuredItems = items
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return data({ featuredItems });
}

export async function action({ request }) {
  let session = await getSession(request.headers.get("cookie"));
  let formData = await request.formData();
  let email = formData.get("email");
  let id = formData.get("id");

  if (id) {
    // Handle add to cart
    let cartItem = { id, quantity: 1 };
    let cartItems = session.get("cartItems") || [];
    let matchedItem = cartItems.find((item) => item.id === id);
    if (matchedItem) {
      return data({ ok: false, message: "item already in cart" });
    } else {
      cartItems.push(cartItem);
    }
    session.set("cartItems", cartItems);
    return data(
      { ok: true },
      {
        headers: {
          "set-cookie": await commitSession(session),
        },
      }
    );
  }

  // Handle newsletter
  let fieldErrors = {
    email: validateText(email.trim()),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors };
  }

  let result = await addSubscriber(email);
  if (result.acknowledged) {
    setSuccessMessage(session, "Email added successfully!");
  } else {
    setErrorMessage(session, "Failed to add email. Please try again.");
  }

  return redirect("/", {
    headers: {
      "set-cookie": await commitSession(session),
    },
  });
}

export default function Home() {
  const { featuredItems } = useLoaderData();

  return (
    <main className="px-4 sm:px-8 md:px-16 lg:px-24 max-w-7xl mx-auto space-y-16">
      {/* Hero Section */}
      <section className="text-center pt-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 mb-4">
          Welcome to <span className="text-indigo-900">Collins</span>{" "}
          <span className="text-indigo-500">EduMart</span>
        </h1>
        <h2 className="text-2xl font-semibold mb-2 text-gray-400">
          Our Mission
        </h2>
        <p className="max-w-3xl mx-auto text-gray-500 mb-6 leading-relaxed">
          To be Kenya’s premier digital marketplace for educational books and
          learning technology – where students and teachers discover the tools
          to unlock their potential.
        </p>
        <h2 className="text-2xl font-semibold mb-2 text-gray-400">Vision</h2>
        <p className="max-w-3xl mx-auto text-gray-500 mb-8 leading-relaxed">
          Kenya's Ultimate Digital Marketplace - Where Quality Books and
          Learning Tools Meet Every Student's Needs
        </p>
        <img
          src="/home/hero.jpg"
          alt="Kenyan students learning"
          className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
          loading="lazy"
        />
        <Link to="/products">
          <button className="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition">
            Shop Now
          </button>
        </Link>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-indigo-700">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredItems.map((product) => (
            <Card
              id={product._id}
              key={product._id}
              title={product.name}
              description=""
              price={product.price}
              image={product.imageurl || "/home/default.jpg"}
              reviews={0}
            />
          ))}
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-indigo-50 rounded-lg p-8 shadow-lg max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center">
          Why Us?
        </h2>
        <ul className="list-disc list-inside space-y-4 text-gray-700">
          <li>
            All our textbooks and learning devices are rigorously vetted by top
            Kenyan educators to guarantee 100% CBC curriculum alignment for
            every grade.
          </li>
          <li>
            Enjoy the most affordable prices in Kenya, with free delivery
            nationwide and a no-hassle return policy – because quality education
            should be accessible to all.
          </li>
          <li>
            Get full customer care support (8AM-5PM daily) plus expert guidance
            from our network of leading CBC educators – from material selection
            to usage tips.
          </li>
          <li>
            Recommended by award-winning teachers and schools across all 47
            counties, with 5-star reviews for our quality, reliability, and CBC
            relevance.
          </li>
        </ul>
      </section>

      {/* Testimonials */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-indigo-700 text-center">
          Testimonials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              img: "/home/oldman.jpg",
              name: "Dr. Wanjiku Nelson",
              title: "CBC Trainer, Ministry of Education",
              text: "This platform saved our school countless hours! Their pre-vetted CBC materials eliminated guesswork, and their educator support team resolved all our JSS transition challenges. A true partner for 21st-century learning",
            },
            {
              img: "/home/man.jpg",
              name: "Mr. Otieno Baraka",
              title: "Headteacher, Nairobi Progressive Academy",
              text: "Compared to other vendors, their prices are 20% lower for the same quality. The free delivery and easy returns made stocking our library stress-free. We’ve redirected the savings to buy more tablets for our learners.",
            },
            {
              img: "/home/woman.jpg",
              name: "Mrs. Aisha Khalifa",
              title: "Parent & PTA Chair, Mombasa",
              text: "As a busy working mom, I rely on their 8AM-5PM customer care. They helped me choose the right Grade 3 books and even arranged a same-day delivery when I forgot an order deadline. Lifesavers!",
            },
            {
              img: "/home/child.jpg",
              name: "Brian Omondi",
              title: "Grade 6 Student, Sunshine Academy, Kisumu",
              text: "I used to struggle with maths until my teacher ordered the CBC practice books from here! The diagrams are so clear, and I love the QR codes that link to video lessons. Now I’m topping my class – plus they delivered super fast right before exams. Asante sana!",
            },
          ].map(({ img, name, title, text }) => (
            <div
              key={name}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center"
            >
              <img
                src={img}
                alt={`Photo of ${name}`}
                className="w-24 h-24 rounded-full mb-4 object-cover"
                loading="lazy"
              />
              <h3 className="font-semibold text-lg text-indigo-700">{name}</h3>
              <p className="text-sm text-gray-600 mb-3 italic">{title}</p>
              <p className="text-gray-700">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-indigo-50 p-8 rounded-lg max-w-4xl mx-auto text-center shadow-lg">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">
          Stay Ahead in Education! 📚✨
        </h2>
        <p className="mb-6 text-gray-700 max-w-xl mx-auto">
          Get exclusive CBC resources, expert tips, and member-only discounts
          delivered to your inbox.
        </p>
        <ul className="list-disc list-inside mb-6 text-gray-700 max-w-xl mx-auto space-y-2">
          <li>✓ Weekly CBC-aligned study/parenting tips</li>
          <li>✓ New book & device arrivals (with subscriber-only prices)</li>
          <li>✓ Free downloadable revision guides</li>
          <li>✓ Early access to sales & education webinars</li>
        </ul>
        <p className="mb-6 font-semibold text-indigo-700">
          First 100 subscribers get a free CBC revision timetable!
        </p>
        <p className="mb-6 text-gray-600">
          Join 15,000+ Kenyan educators & parents!
        </p>

        <Form
          className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-4 "
          method="post"
        >
          <input
            type="email"
            name="email"
            id="email"
            placeholder="example@gmail.com"
            aria-label="input email"
            required
            className="px-4 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 flex-grow"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition"
          >
            Subscribe Now
          </button>
        </Form>
        <p className="mt-4 text-gray-600">
          WhatsApp us on{" "}
          <a
            href="http://whatsapp.com"
            className="text-indigo-600 underline hover:text-indigo-800"
          >
            +254743 709 582
          </a>
        </p>
        <span className="block mt-2 text-xs text-gray-400">
          🔒 We respect your privacy. Unsubscribe anytime.
        </span>
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">Links</h2>
          <ul className="space-y-2">
            <li>
              <Link to="/textbooks" className="text-indigo-600 hover:underline">
                Resources by Grade
              </Link>
            </li>
            <li>
              <Link to="/devices" className="text-indigo-600 hover:underline">
                Digital Learning Devices
              </Link>
            </li>

            <li>
              <Link to="/return" className="text-indigo-600 hover:underline">
                Return Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">
            Support
          </h2>
          <p className="text-gray-500 mb-2">Payment Methods</p>
          <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
            M-Pesa
          </span>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">
            About Us
          </h2>
          <h3 className="font-semibold text-indigo-600 mb-2">
            Our Founding Moment
          </h3>
          <p className="text-gray-500 mb-4">
            Armed with just a laptop and partnerships with 3 local publishers,
            we launched in 2009 with:
          </p>
          <ul className="list-disc list-inside text-gray-500 space-y-2">
            <li>✓ 200 CBC-approved textbooks</li>
            <li>✓ Free delivery within Nairobi</li>
            <li>✓ Educator vetting for all content</li>
          </ul>
          <h3 className="font-semibold text-indigo-600 mt-6 mb-2">
            How We’ve Grown
          </h3>
          <ul className="list-disc list-inside text-gray-500 space-y-2">
            <li>Serve 5000+ students & 200+ schools across all 47 counties</li>
            <li>
              Offer Kenya’s largest curated collection of CBC books & digital
              tools
            </li>
            <li>Maintain 4.9/5 ratings from educators nationwide</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
