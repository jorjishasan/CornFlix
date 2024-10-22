import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { useSelector } from "react-redux";

const Footer = () => {
  const user = useSelector((store) => store.user);
  return (
    user && (
      <footer className="bg-gray-900 px-4 py-8 text-gray-300">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-4 text-2xl font-bold text-white">MovieDock</h3>
              <p className="mb-4">
                Discover your next favorite movie with AI-powered
                recommendations.
              </p>
              <div className="flex space-x-4">
                <button className="text-gray-400 transition-colors hover:text-white">
                  <FaFacebookF />
                </button>
                <button className="text-gray-400 transition-colors hover:text-white">
                  <FaTwitter />
                </button>
                <button className="text-gray-400 transition-colors hover:text-white">
                  <FaInstagram />
                </button>
                <button className="text-gray-400 transition-colors hover:text-white">
                  <FaYoutube />
                </button>
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">
                Quick Links
              </h4>
              <ul className="space-y-2 text-gray-500">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Browse
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Genres
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    My Watchlist
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">
                Help & Support
              </h4>
              <ul className="space-y-2 text-gray-500">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">
                Newsletter
              </h4>
              <p className="mb-4">
                Stay updated with the latest movies and features.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-l-md bg-gray-800 px-4 py-2 text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-r-md bg-red-700 px-4 py-2 text-white transition-colors hover:bg-red-800"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center">
            <p>&copy; 2024 MovieDock. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  );
};

export default Footer;
