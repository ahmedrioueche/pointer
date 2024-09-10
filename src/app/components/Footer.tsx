"use client";

import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-light-background dark:bg-dark-background py-6 mt-0">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold font-stix text-light-text dark:text-dark-text mb-2">Pointer</h3>
          <p className="text-sm text-light-text font-stix dark:text-dark-text">
            &copy; {new Date().getFullYear()} Pointer. All rights reserved.
          </p>
        </div>
        <ul className="flex space-x-6 my-4 md:my-0">
          <li>
            <Link
              href="https://facebook.com"
              target="_blank"
              className="text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors duration-300"
            >
              <FaFacebook size={20} />
            </Link>
          </li>
          <li>
            <Link
              href="https://twitter.com"
              target="_blank"
              className="text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors duration-300"
            >
              <FaTwitter size={20} />
            </Link>
          </li>
          <li>
            <Link
              href="https://instagram.com"
              target="_blank"
              className="text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors duration-300"
            >
              <FaInstagram size={20} />
            </Link>
          </li>
          <li>
            <Link
              href="https://linkedin.com"
              target="_blank"
              className="text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors duration-300"
            >
              <FaLinkedin size={20} />
            </Link>
          </li>
        </ul>
      </div>
      <div className="mt-4 text-center md:text-left">
        <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm">
          {["Home", "Credits"].map((item, index) => (
            <li key={index}>
              <Link
                href={item === "Home" ? '/' : `/home/${item.toLowerCase()}`}
                className="text-light-text font-stix dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors duration-300"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </footer>

  );
};

export default Footer;
