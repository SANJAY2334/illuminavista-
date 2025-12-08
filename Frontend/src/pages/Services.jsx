import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow, Autoplay } from "swiper/modules";
import { categories } from "../data/servicesData";
import ServiceCard from "../components/ServiceCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

export default function Services() {
  const [activeProject, setActiveProject] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => {
    if (activeProject) {
      setActiveIndex((prev) => (prev + 1) % activeProject.images.length);
    }
  };

  const prevImage = () => {
    if (activeProject) {
      setActiveIndex(
        (prev) =>
          (prev - 1 + activeProject.images.length) % activeProject.images.length
      );
    }
  };

  return (
    <div className="bg-midnight text-pearl min-h-screen pt-28 px-4 sm:px-6 pb-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center mb-20"
      >
        <h1 className="text-4xl md:text-6xl font-heading text-champagne mb-6 drop-shadow-lg">
          Our Services
        </h1>
        <p className="text-pearl/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Explore our curated categories of event management — crafted with
          lights, sound, and unforgettable experiences.
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-8" />
      </motion.div>

      {/* Category Sections */}
      <div className="max-w-[1400px] mx-auto space-y-24">
        {Object.entries(categories).map(([category, projects], catIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="flex items-center gap-4 mb-8 px-4">
              <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-champagne/30" />
              <h2 className="text-2xl md:text-4xl font-heading text-champagne text-center whitespace-nowrap">
                {category}
              </h2>
              <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-champagne/30" />
            </div>

            {/* Swiper Carousel */}
            <Swiper
              modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={"auto"}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
                slideShadows: false,
              }}
              autoplay={{
                delay: 3000 + catIndex * 1000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{ clickable: true, dynamicBullets: true }}
              navigation={true}
              breakpoints={{
                320: {
                  slidesPerView: 1.2,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 40,
                },
              }}
              className="w-full py-12 px-4 !pb-16"
            >
              {projects.map((project, index) => (
                <SwiperSlide key={index} className="max-w-[350px] sm:max-w-[400px]">
                  <ServiceCard
                    project={project}
                    category={category}
                    onClick={() => {
                      setActiveProject(project);
                      setActiveIndex(0);
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Popup */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-sm flex justify-center items-center z-[100] p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full flex justify-center items-center">
                <img
                  src={activeProject.images[activeIndex]}
                  alt={activeProject.title}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-champagne/20"
                />

                {/* Navigation Buttons */}
                <button
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
                <h3 className="text-2xl sm:text-3xl font-heading text-gold mb-2">{activeProject.title}</h3>
                <p className="text-pearl/60 text-sm tracking-widest">
                  IMAGE {activeIndex + 1} OF {activeProject.images.length}
                </p>
              </div>

              {/* Close Button */}
              <button
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
