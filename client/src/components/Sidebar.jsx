import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-100 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              PeerReview<span className="text-gray-800">.</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <a
              href="#features"
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              Contact
            </a>

            <div className="flex space-x-4 ml-4">
              <Link
                to="/auth/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium transition"
              >
                Log in
              </Link>
              <Link
                to="/auth/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition shadow-sm"
              >
                Try Demo
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#features"
              className="block px-3 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-md"
            >
              Features
            </a>
            <a
              href="#about"
              className="block px-3 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-md"
            >
              About
            </a>
            <Link
              to="/auth/login"
              className="block px-3 py-2 text-blue-600 font-bold hover:bg-gray-50 rounded-md"
            >
              Try Demo / Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
