import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

const routes = [
  { path: "/", label: "Home" },
  { path: "/apod", label: "APOD" },
  { path: "/launches", label: "Launches" },
  { path: "/iss", label: "ISS" },
  { path: "/starchart", label: "Star Chart" },
  { path: "/timeline", label: "Timeline" },
  { path: "/telescopes", label: "Telescopes" },
  { path: "/news", label: "News" },
  { path: "/neo", label: "NEO" },
  { path: "/mars", label: "Mars" },
  { path: "/solarsystem", label: "Solar System" },
  { path: "/ai-demo", label: "AI Analysis" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollTop(scrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: showNavbar ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 w-full z-50 bg-black/60 backdrop-blur-sm border-b border-gray-800 px-4 py-3 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.h1
          className="text-2xl font-extrabold tracking-widest text-white"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          COSMICVIEW
        </motion.h1>

        {/* Desktop Links */}
        <nav className="hidden md:flex space-x-4 text-sm">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="text-white hover:text-cyan-300 transition relative group"
            >
              {route.label}
              <span className="block h-0.5 bg-cyan-300 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <div
          className="md:hidden text-white text-2xl cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden mt-2 px-4"
          >
            <ul className="flex flex-col gap-3 pb-2">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  onClick={() => setOpen(false)}
                  className="text-white hover:text-cyan-400 border-b border-gray-700 pb-2"
                >
                  {route.label}
                </Link>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
