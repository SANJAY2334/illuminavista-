import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";


export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Services", to: "/services" },
    { name: "Products", to: "/products" },
    { name: "Portfolio", to: "/portfolio" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-midnight text-pearl font-body">
      {/* Header with animation */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 w-full bg-midnight/80 backdrop-blur-md border-b border-champagne/20 z-50 shadow-lg"
      >
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="z-50"
          >
            <Link
              to="/"
              className="flex items-center gap-3 group"
            >
              <span className="text-champagne font-heading text-2xl md:text-3xl tracking-wide group-hover:text-pearl transition duration-300 drop-shadow-md">
                IlluminaVista
              </span>
            </Link>
          </motion.div>



          {/* Desktop Navigation */}
          <motion.div
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative group text-sm uppercase tracking-widest transition duration-300 ${location.pathname === link.to ? "text-gold" : "text-pearl hover:text-champagne"
                  }`}
              >
                {link.name}
                {/* Underline on hover & active */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-champagne transition-all duration-300 ${location.pathname === link.to ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                ></span>
              </Link>
            ))}
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden z-50">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-champagne focus:outline-none p-2"
            >
              <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                <motion.span
                  animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 8 : 0 }}
                  className="w-full h-0.5 bg-champagne block origin-center"
                />
                <motion.span
                  animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                  className="w-full h-0.5 bg-champagne block"
                />
                <motion.span
                  animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -8 : 0 }}
                  className="w-full h-0.5 bg-champagne block origin-center"
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "100vh" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed inset-0 bg-midnight/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center md:hidden"
            >
              <div className="flex flex-col items-center space-y-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                  >
                    <Link
                      to={link.to}
                      className={`text-2xl font-heading uppercase tracking-widest transition duration-300 ${location.pathname === link.to ? "text-gold" : "text-pearl hover:text-champagne"
                        }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow pt-24 min-h-screen relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-midnight relative border-t border-champagne/20 mt-20 z-10">
        {/* Top Gradient Glow */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-champagne to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="mb-8">
            <h2 className="text-2xl font-heading text-champagne mb-2">IlluminaVista</h2>
            <p className="text-pearl/60 text-sm max-w-md mx-auto">
              Crafting unforgettable experiences through light, sound, and precision planning.
            </p>
          </div>

          {/* Socials */}
          <div className="flex justify-center space-x-8 mb-8">
            {['facebook', 'instagram', 'twitter', 'linkedin'].map((social) => (
              <a
                key={social}
                href={`#${social}`}
                className="text-pearl/60 hover:text-gold transition-colors duration-300 transform hover:scale-110"
              >
                <span className="sr-only">{social}</span>
                <div className="w-6 h-6 border border-pearl/30 rounded-full flex items-center justify-center hover:border-gold">
                  <i className={`fab fa-${social} text-xs`}></i>
                </div>
              </a>
            ))}
          </div>

          <p className="text-xs text-pearl/40 tracking-wider uppercase">
            &copy; {new Date().getFullYear()} IlluminaVista. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
