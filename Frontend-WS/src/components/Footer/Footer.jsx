import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-primary text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        {/* Copyright */}
        <p className="text-sm text-center sm:text-left mb-4 sm:mb-0">
          &copy; {new Date().getFullYear()} Wedding Sparks. All Rights Reserved.
        </p>

        {/* Social Icons */}
        <div className="flex space-x-6 justify-center sm:justify-start">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl hover:text-blue-500 transition-all duration-300"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl hover:text-pink-500 transition-all duration-300"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl hover:text-blue-400 transition-all duration-300"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
