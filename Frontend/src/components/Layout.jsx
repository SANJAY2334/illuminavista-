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
    { name: "Home", to: "/", icon: HomeIcon },
    { name: "Services", to: "/services", icon: ServicesIcon },
    { name: "Products", to: "/products", icon: ProductsIcon },
    { name: "Portfolio", to: "/portfolio", icon: PortfolioIcon },
    { name: "Contact", to: "/contact", icon: ContactIcon },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-midnight text-pearl font-body">
      {/* Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="fixed top-0 w-full bg-midnight/85 backdrop-blur-sm border-b border-champagne/20 z-50"
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Mobile Toggle (Option C: Square button) */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-champagne/20 bg-midnight/90 hover:bg-midnight/95 text-champagne focus:outline-none focus:ring-2 focus:ring-champagne/40 transition"
            >
              {/* Square icon — subtle 3-line glyph */}
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect x="0" y="1" width="18" height="2" rx="1" fill="currentColor" />
                <rect x="0" y="6" width="18" height="2" rx="1" fill="currentColor" />
                <rect x="0" y="11" width="18" height="2" rx="1" fill="currentColor" />
              </svg>
            </button>
            {/* Logo */}
            <Link to="/" className="flex items-center ml-3 md:ml-0">
              <span className="text-champagne font-heading text-lg sm:text-2xl tracking-wide">VJ Events</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative group text-sm uppercase tracking-widest transition duration-200 ${location.pathname === link.to ? "text-gold" : "text-pearl hover:text-champagne"
                  }`}
              >
                {link.name}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-champagne transition-all duration-200 ${location.pathname === link.to ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                />
              </Link>
            ))}
          </div>
        </nav>
      </motion.header>

      {/* Mobile sidebar + overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              className="fixed left-0 top-0 h-full w-72 z-50 md:hidden shadow-2xl"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              aria-label="Mobile menu"
            >
              <div
                className="h-full bg-gradient-to-b from-[#0d0f17] to-[#08090b] text-pearl p-6 flex flex-col"
                role="menu"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-champagne text-xl font-heading">Menu</span>
                    <div className="text-pearl/60 text-xs mt-1">VJ Events</div>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-champagne/20 bg-midnight/90 text-pearl hover:text-gold transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                {/* Divider */}
                <div className="h-px bg-champagne/10 mb-4" />

                {/* Nav items (scrollable) */}
                <nav className="flex-1 overflow-y-auto pb-6">
                  <ul className="space-y-3">
                    {navLinks.map((link, i) => (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-2 py-2 rounded-md transition ${location.pathname === link.to ? "bg-midnight/60 text-gold" : "hover:bg-midnight/50 text-pearl"
                            }`}
                        >
                          {/* Icon */}
                          <span className="w-5 h-5 flex-shrink-0 text-pearl/80">
                            <link.icon />
                          </span>

                          {/* Label */}
                          <span className="uppercase tracking-wider text-sm">{link.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Footer area inside drawer */}
                <div className="pt-4 mt-auto">
                  <div className="h-px bg-champagne/10 mb-4" />
                  <div className="text-xs text-pearl/60">
                    © {new Date().getFullYear()} VJ Events
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-grow pt-16 min-h-screen relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-midnight relative border-t border-champagne/20 mt-20 z-10">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-champagne to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-heading text-champagne mb-2">VJ Events</h2>
          <p className="text-pearl/60 text-sm max-w-md mx-auto">
            Crafting unforgettable experiences through light, sound, and precision planning.
          </p>

          <div className="flex justify-center space-x-8 mb-8 mt-8">
            {["facebook", "instagram", "twitter", "linkedin"].map((s) => (
              <a key={s} href={`#${s}`} className="text-pearl/60 hover:text-gold transition-colors duration-200">
                <div className="w-6 h-6 border border-pearl/30 rounded-full flex items-center justify-center">
                  <i className={`fab fa-${s} text-xs`} />
                </div>
              </a>
            ))}
          </div>

          <p className="text-xs text-pearl/40 tracking-wider uppercase">
            &copy; {new Date().getFullYear()} VJ Events. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* --------------------------
   Simple inline SVG icons
   (Replace these with your icon system if you prefer)
   -------------------------- */

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 11.5L12 4l9 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 12v7a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ServicesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 7h14l-1 10H6L5 7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 22h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="7" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PortfolioIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="7" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 15h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
