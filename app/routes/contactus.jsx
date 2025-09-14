import { Form, redirect, useActionData } from "react-router";
import FAQ from "../components/FAQ";
import { addMessage } from "../model/database";
import {
  commitSession,
  getSession,
  setSuccessMessage,
  setErrorMessage,
} from "../.server/session";

function validateEmail(email) {
  if (!email || !email.includes("@")) return "Please enter a valid email";
  return null;
}

export async function action({ request }) {
  let session = await getSession(request.headers.get("cookie"));
  let formData = await request.formData();

  let item = {
    name: formData.get("name"),
    tel: formData.get("tel"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  // Validation
  let fieldErrors = {
    email: validateEmail(item.email?.trim()),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors, values: item };
  }

  let result = await addMessage(item);

  if (result.acknowledged) {
    setSuccessMessage(session, "Message sent successfully!");
  } else {
    setErrorMessage(session, "Failed to send message. Please try again.");
  }

  return redirect("/", {
    headers: {
      "set-cookie": await commitSession(session),
    },
  });
}

export default function Contact() {
  let actionData = useActionData();

  return (
    <main className="container mx-auto px-4 py-12 text-gray-100">
      <div className="grid md:grid-cols-2 gap-12">
        {/* LEFT SIDE */}
        <div className="space-y-10 bg-gray-800/90 p-8 rounded-2xl shadow-lg backdrop-blur">
          {/* Contact Info Section */}
          <section className="space-y-4 border-b border-gray-700 pb-6">
            <h2 className="text-3xl font-bold text-white leading-snug">
              📚 Collins Edumart Support
              <span className="block text-lg text-indigo-400 font-medium">
                Books, Tests & Gadgets, Sorted!
              </span>
            </h2>
            <p className="text-gray-300 leading-relaxed">
              🎓 Stuck somewhere? Don’t worry – we’re here to help you 😊
              <br />
              <span className="text-indigo-300">Contact us anytime!</span>
            </p>

            <div className="space-y-3 text-sm">
              <p className="font-semibold text-indigo-400">📍 Visit Us:</p>
              <p className="text-gray-300">Nairobi, Kenya</p>

              <p className="font-semibold text-indigo-400 pt-2">📞 Call Us:</p>
              <a
                href="tel:+254743709582"
                className="text-blue-400 underline hover:text-blue-300"
              >
                +254 743 709 582
              </a>
              <p className="text-gray-400">Mon–Sat, 9AM–6PM</p>

              <h3 className="font-semibold text-indigo-400 pt-2">
                ✉️ Email Us:
              </h3>
              <p>
                <a
                  href="mailto:support@collinsedumart.com"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  support@collinsedumart.com
                </a>
                – general inquiries
              </p>
              <p>
                <a
                  href="mailto:orders@collinsedumart.com"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  orders@collinsedumart.com
                </a>{" "}
                – orders & tracking
              </p>

              <h3 className="font-semibold text-indigo-400 pt-2">
                💬 Live Chat:
              </h3>
              <p className="text-gray-300">
                WhatsApp:{" "}
                <span className="font-medium text-white">+254 743 709 582</span>
              </p>
            </div>

            {/* Socials */}
            <div className="pt-4">
              <h3 className="font-semibold text-indigo-400">
                🌐 Find us on Social Media:
              </h3>
              <div className="flex space-x-5 mt-3">
                <img
                  src="/media/facebook.svg"
                  alt="Facebook"
                  className="h-7 w-7 hover:scale-110 transition"
                />
                <img
                  src="/media/x.svg"
                  alt="X"
                  className="h-7 w-7 hover:scale-110 transition"
                />
                <img
                  src="/media/instagram.svg"
                  alt="Instagram"
                  className="h-7 w-7 hover:scale-110 transition"
                />
                <img
                  src="/media/linkedin.svg"
                  alt="LinkedIn"
                  className="h-7 w-7 hover:scale-110 transition"
                />
              </div>
            </div>
          </section>

          {/* Form Section */}
          <section className="space-y-5">
            <h3 className="text-2xl font-semibold text-white">
              ✍️ Send Us a Message
            </h3>
            <p className="text-gray-400">We would love to hear from you 😊</p>
            <p className="text-sm text-green-400 font-medium">
              Quick response guaranteed!
            </p>

            <Form
              className="space-y-5"
              method="post"
              encType="multipart/form-data"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block font-medium text-indigo-300"
                >
                  Full Name 📛
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Your Name"
                  className="w-full border border-gray-600 bg-gray-900 rounded-lg p-3 mt-1 text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  defaultValue={actionData?.values?.name}
                />
              </div>

              <div>
                <label
                  htmlFor="tel"
                  className="block font-medium text-indigo-300"
                >
                  📞 Phone Number
                </label>
                <input
                  type="tel"
                  name="tel"
                  id="tel"
                  placeholder="+254..."
                  className="w-full border border-gray-600 bg-gray-900 rounded-lg p-3 mt-1 text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  defaultValue={actionData?.values?.tel}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-medium text-indigo-300"
                >
                  ✉️ Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="example@gmail.com"
                  className="w-full border border-gray-600 bg-gray-900 rounded-lg p-3 mt-1 text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  defaultValue={actionData?.values?.email}
                />
                {actionData?.fieldErrors?.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {actionData.fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-medium text-indigo-300"
                >
                  Your Message 📝
                </label>
                <textarea
                  name="message"
                  id="message"
                  required
                  placeholder="Your message..."
                  className="w-full border border-gray-600 bg-gray-900 rounded-lg p-3 mt-1 text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none h-32"
                  defaultValue={actionData?.values?.message}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-blue-600 transition"
              >
                🚀 Submit Message
              </button>
            </Form>
          </section>

          <FAQ />
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="hidden md:block relative">
          <img
            src="/home/hero.jpg"
            alt="Support illustration"
            className="w-full h-full object-cover rounded-2xl shadow-lg"
          />
          <div className="absolute inset-0 bg-indigo-700/40 rounded-2xl"></div>
        </div>
      </div>
    </main>
  );
}
