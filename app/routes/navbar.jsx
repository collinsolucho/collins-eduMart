import { useState, useRef, useEffect } from "react";
import { Form, Link, useLocation } from "react-router";
import { User, UserPen, ShoppingCart } from "lucide-react";

export default function Navbar({ userId, userRole, cartItems }) {
  let location = useLocation();
  let [isOpen, setIsOpen] = useState(false); // mobile menu
  let [showCategories, setShowCategories] = useState(false);
  let [showPopover, setShowPopover] = useState(false);

  // Separate refs
  let categoriesRef = useRef(null);
  let userPopoverRef = useRef(null);

  // Close popovers when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setShowCategories(false);
      }
      if (
        userPopoverRef.current &&
        !userPopoverRef.current.contains(e.target)
      ) {
        setShowPopover(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-md px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/nav/logo.png"
            alt="Collins EduMart Logo"
            className="h-10 w-10 rounded-full"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Collins EduMart
          </span>
        </Link>

        {/* Search Input (not for admin) */}
        {userRole !== "admin" && (
          <Form
            key={location.pathname}
            action="/products"
            method="get"
            className="flex items-center mr-3 border rounded-full lg:px-3 py-1 bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
          >
            <input
              type="search"
              placeholder="Search products..."
              className="bg-transparent outline-none lg:px-2 text-sm w-40 text-gray-800 dark:text-gray-200"
              name="q"
            />
            <button
              type="submit"
              className="text-gray-500 dark:text-gray-400 hidden lg:block"
            >
              🔎
            </button>
          </Form>
        )}

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center space-x-2 lg:space-x-6 text-sm font-medium text-gray-800 dark:text-gray-200">
          <li>
            <Link
              to="/"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Home
            </Link>
          </li>
          {userRole !== "admin" && (
            <>
              <li>
                <Link
                  to="/aboutus"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/contactus"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Contact
                </Link>
              </li>

              {/* Cart Icon */}
              <li className="relative">
                <Link to="/cart" className="flex items-center">
                  <ShoppingCart />
                  {cartItems.length > 0 && (
                    <span className="bg-orange-500 w-6 h-6 rounded-full grid place-items-center absolute -top-2 -right-3 text-xs text-white font-bold">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              </li>

              {/* Categories Dropdown */}
              <li>
                <div className="hidden md:flex relative" ref={categoriesRef}>
                  <button
                    onClick={() => setShowCategories(!showCategories)}
                    aria-haspopup="true"
                    aria-expanded={showCategories}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Categories
                  </button>

                  {showCategories && (
                    <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50">
                      <Link
                        to="/textbooks"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Textbooks
                      </Link>
                      <Link
                        to="/devices"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Digital Devices
                      </Link>
                      <Link
                        to="/stationery"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Stationery
                      </Link>
                      <Link
                        to="/books"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Exercise Books
                      </Link>
                      <Link
                        to="/other"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Others
                      </Link>
                    </div>
                  )}
                </div>
              </li>
            </>
          )}
        </ul>

        {/* User Popover */}
        <div className="hidden md:flex relative" ref={userPopoverRef}>
          <button
            onClick={() => setShowPopover(!showPopover)}
            aria-haspopup="true"
            aria-expanded={showPopover}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <User className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>

          {showPopover && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50">
              {!userId && (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              {userId && userRole !== "admin" && (
                <>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <Form method="post" action="/logout">
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                      Logout
                    </button>
                  </Form>
                </>
              )}
              {userId && userRole === "admin" && (
                <>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Home
                  </Link>
                  <Form method="post" action="/logout">
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                      Logout
                    </button>
                  </Form>
                </>
              )}
            </div>
          )}
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          <img
            src="/nav/menu.svg"
            alt="Menu"
            className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"
          />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-3 space-y-2 text-gray-800 dark:text-gray-200 text-sm font-medium">
          <Link
            to="/"
            className="block hover:text-blue-600 dark:hover:text-blue-400"
          >
            Home
          </Link>
          {userRole !== "admin" && (
            <>
              <Link
                to="/aboutus"
                className="block hover:text-blue-600 dark:hover:text-blue-400"
              >
                About
              </Link>
              <Link
                to="/products"
                className="block hover:text-blue-600 dark:hover:text-blue-400"
              >
                Products
              </Link>
              <Link
                to="/contactus"
                className="block hover:text-blue-600 dark:hover:text-blue-400"
              >
                Contact
              </Link>

              {/* Mobile Categories */}
              <div className="pl-2">
                <p className="font-semibold mt-2">Categories</p>
                <Link
                  to="/textbooks"
                  className="block px-2 py-1 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Textbooks
                </Link>
                <Link
                  to="/devices"
                  className="block px-2 py-1 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Digital Devices
                </Link>
                <Link
                  to="/stationery"
                  className="block px-2 py-1 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Stationery
                </Link>
                <Link
                  to="/books"
                  className="block px-2 py-1 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Exercise Books
                </Link>
                <Link
                  to="/others"
                  className="block px-2 py-1 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Others
                </Link>
              </div>

              {/* Cart inside mobile menu */}
              <div className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400">
                <ShoppingCart />
                <span className="ml-1 text-xs bg-red-500 text-white px-1 rounded-full">
                  {cartItems.length}
                </span>
              </div>
            </>
          )}

          <hr className="my-2 border-gray-300 dark:border-gray-700" />

          {!userId && (
            <>
              <Link
                to="/signup"
                className="block hover:text-blue-600 dark:hover:text-blue-400"
              >
                Signup
              </Link>
            </>
          )}
          {!userId ? (
            <Link to="/login">
              <button className="text-sm text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition">
                Login
              </button>
            </Link>
          ) : userRole !== "admin" ? (
            <>
              <Form method="post" action="/logout">
                <button className="text-sm text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition">
                  Logout
                </button>
              </Form>
              <Link to="/profile" className="flex items-center space-x-1">
                <UserPen />
                <span>Profile</span>
              </Link>
            </>
          ) : (
            <Form method="post" action="/logout">
              <button className="text-sm text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition">
                Logout
              </button>
            </Form>
          )}
        </div>
      )}
    </nav>
  );
}
