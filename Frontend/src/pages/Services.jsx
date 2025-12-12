import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import ServiceCard from "../components/ServiceCard";
import { categories } from "../data/servicesData"; // keep as-is

// Swiper css
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/**
 * Production-ready Services page (classic slider, optimized)
 */
export default function Services() {
  const [activeProject, setActiveProject] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalImageLoaded, setModalImageLoaded] = useState(false);
  const [navLock, setNavLock] = useState(false); // throttle nav clicks
  const [autoplayEnabled, setAutoplayEnabled] = useState(false);
  const modalImgRef = useRef(null);

  // Decide autoplay only for large screens (reduces load on phones)
  useEffect(() => {
    const calculateAutoplay = () => {
      setAutoplayEnabled(window.innerWidth >= 1024); // desktop/tablet only
    };
    calculateAutoplay();
    window.addEventListener("resize", calculateAutoplay);
    return () => window.removeEventListener("resize", calculateAutoplay);
  }, []);

  // When modal opens, lock document scroll and reset modal load state
  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = "hidden";
      setModalImageLoaded(false);
    } else {
      document.body.style.overflow = "";
      setModalImageLoaded(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeProject]);

  // Keyboard handling for modal: ESC closes, arrows navigate
  useEffect(() => {
    if (!activeProject) return;

    const handleKey = (e) => {
      if (e.key === "Escape") {
        setActiveProject(null);
      } else if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "ArrowLeft") {
        prevImage();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject, activeIndex]); // re-register when modal changes

  const nextImage = () => {
    if (!activeProject?.images?.length || navLock) return;
    setNavLock(true);
    setActiveIndex((prev) => (prev + 1) % activeProject.images.length);
    setTimeout(() => setNavLock(false), 180); // small throttle to avoid race
  };

  const prevImage = () => {
    if (!activeProject?.images?.length || navLock) return;
    setNavLock(true);
    setActiveIndex((prev) =>
      (prev - 1 + activeProject.images.length) % activeProject.images.length
    );
    setTimeout(() => setNavLock(false), 180);
  };

  // Safe accessor for modal image src
  const modalImageSrc = () =>
    activeProject?.images?.[activeIndex] ||
    "https://placehold.co/1200x800/0d0f17/ffffff?text=No+Image";

  // Preload modal image (ensures skeleton until loaded)
  useEffect(() => {
    if (!activeProject) return;
    const src = modalImageSrc();
    setModalImageLoaded(false);
    const img = new Image();
    img.src = src;
    img.onload = () => setModalImageLoaded(true);
    img.onerror = () => setModalImageLoaded(true); // stop skeleton even if error (fallback shown)
    // keep a ref to avoid GC? fine here
  }, [activeProject, activeIndex]);

  // Guard: if categories is empty, show fallback UI
  const hasCategories = categories && Object.keys(categories).length > 0;

  return (
    <div className="bg-midnight text-pearl min-h-screen pt-28 px-4 sm:px-6 pb-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto text-center mb-20"
      >
        <h1 className="text-4xl md:text-6xl font-heading text-champagne mb-6 drop-shadow-lg">
          Our Services
        </h1>
        <p className="text-pearl/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Explore our curated categories of event management — crafted with lights,
          sound, and unforgettable experiences.
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-8" />
      </motion.div>

      {!hasCategories ? (
        <div className="max-w-3xl mx-auto text-center py-24">
          <p className="text-pearl/60 mb-4">No services available at the moment.</p>
          <p className="text-pearl/40 text-sm">
            Please check back later or contact the team for custom projects.
          </p>
        </div>
      ) : (
        <div className="max-w-[1400px] mx-auto space-y-24">
          {Object.entries(categories).map(([category, projects], catIndex) => (
            <motion.section
              key={category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="flex items-center gap-4 mb-8 px-4">
                <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-champagne/30" />
                <h2 className="text-2xl md:text-4xl font-heading text-champagne text-center whitespace-nowrap">
                  {category}
                </h2>
                <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-champagne/30" />
              </div>

              {/* Classic Swiper Slider (balanced performance) */}
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                slidesPerView={"auto"}
                spaceBetween={30}
                centeredSlides={false}
                navigation={true}
                pagination={{ clickable: true }}
                className="w-full py-8 px-4"
                breakpoints={{
                  320: { slidesPerView: 1.05, spaceBetween: 16 },
                  640: { slidesPerView: 1.6, spaceBetween: 20 },
                  1024: { slidesPerView: 2.2, spaceBetween: 30 },
                  1280: { slidesPerView: 3, spaceBetween: 36 },
                }}
                // Enable autoplay only on larger viewports to reduce load on phones
                autoplay={
                  autoplayEnabled
                    ? { delay: 3500 + catIndex * 200, disableOnInteraction: true }
                    : false
                }
                grabCursor={true}
                watchOverflow={true}
              >
                {projects && projects.length > 0 ? (
                  projects.map((project, index) => (
                    <SwiperSlide key={project.id ?? index} className="max-w-[380px] sm:max-w-[420px]">
                      <ServiceCard
                        project={project}
                        category={category}
                        onClick={() => {
                          // Defensive: ensure project is valid and has images
                          setActiveProject(project || null);
                          setActiveIndex(0);
                        }}
                      />
                    </SwiperSlide>
                  ))
                ) : (
                  <div className="p-8 text-center text-pearl/60">
                    No projects in this category.
                  </div>
                )}
              </Swiper>
            </motion.section>
          ))}
        </div>
      )}

      {/* Lightbox Popup */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="fixed inset-0 bg-black/95 flex justify-center items-center z-[100] p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProject(null)}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full flex justify-center items-center">
                {/* Skeleton while modal image loads */}
                {!modalImageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-3xl h-[60vh] bg-gray-800 animate-pulse rounded-lg" />
                  </div>
                )}

                {/* Image (safe access + fallback) */}
                <img
                  ref={modalImgRef}
                  src={modalImageSrc()}
                  alt={activeProject?.title || "Project image"}
                  className={`max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-champagne/20 transition-opacity duration-300 ${
                    modalImageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Prev / Next */}
                <button
                  aria-label="Previous image"
                  className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-gold transition-colors p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 sm:w-10 sm:h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  aria-label="Next image"
                  className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-gold transition-colors p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 sm:w-10 sm:h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 text-center">
                <h3 className="text-2xl sm:text-3xl font-heading text-gold mb-2">
                  {activeProject?.title || "Untitled Project"}
                </h3>
                <p className="text-pearl/60 text-sm tracking-widest">
                  IMAGE {Math.min(activeIndex + 1, activeProject?.images?.length || 1)} OF{" "}
                  {activeProject?.images?.length || 1}
                </p>
              </div>

              {/* Close Button */}
              <button
                aria-label="Close gallery"
                className="absolute -top-12 right-0 sm:-right-12 text-pearl/70 hover:text-red-400 transition-colors p-2"
                onClick={() => setActiveProject(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
