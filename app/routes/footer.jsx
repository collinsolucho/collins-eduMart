import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 ">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & About */}
        <div>
          <Link to="/" className="flex items-center space-x-3 mb-3">
            <img
              src="/nav/logo.png"
              alt="Collins EduMart Logo"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-extrabold text-blue-700">Collins</p>
              <p className="text-sm text-gray-400 font-bold">EduMart</p>
            </div>
          </Link>
          <p className="text-sm leading-relaxed mt-3">
            Collins EduMart is your trusted online marketplace dedicated to
            providing high-quality educational resources, tools, and supplies
            for learners, teachers, and institutions. We believe that access to
            the right materials can transform learning experiences and open new
            doors of opportunity. Whether you’re looking for textbooks, digital
            learning tools, classroom essentials, or exclusive deals, our
            mission is to make every purchase simple, affordable, and reliable —
            helping you focus on what truly matters: education and growth.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-white transition">
                Products
              </Link>
            </li>

            <li>
              <Link to="/aboutus" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contactus" className="hover:text-white transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <p className="text-sm">📍 Nairobi, Kenya</p>
          <p className="text-sm">
            <a href="tel:+254743709582">📞 +254 743 709 582</a>
          </p>
          <p className="text-sm">📧 info@collinsedumart.com</p>

          <div className="flex space-x-4 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/media/facebook.svg"
                alt="Facebook"
                className="h-6 w-6"
              />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/media/x.svg" alt="Twitter" className="h-6 w-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/media/instagram.svg"
                alt="Instagram"
                className="h-6 w-6"
              />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/media/linkedin.svg"
                alt="LinkedIn"
                className="h-6 w-6"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Collins EduMart. All rights reserved.
      </div>
    </footer>
  );
}
