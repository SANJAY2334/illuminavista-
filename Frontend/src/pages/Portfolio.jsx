import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Project Data with Generated Images
const projects = [
  {
    id: 1,
    title: "Royal Wedding Transformation",
    category: "Wedding",
    before: "/images/generated/wedding_stage_before.png", // Placeholder until generated
    after: "/images/generated/wedding_stage_after.png",   // Placeholder until generated
    image: "/images/Weddings & Celebrations/wedding/wedding1.jpg", // Main display image
    description: "A complete transformation of a standard banquet hall into a royal palace setting with gold drapery and crystal chandeliers.",
    size: "large", // for bento grid
  },
  {
    id: 2,
    title: "Neon Pulse DJ Night",
    category: "Concert",
    before: "/images/generated/corporate_hall_before.png", // Placeholder
    after: "/images/generated/dj-night.png",
    image: "/images/generated/dj-night.png",
    description: "High-energy nightclub setup with beam lights, lasers, and fog machines creating an immersive atmosphere.",
    size: "medium",
  },
  {
    id: 3,
    title: "Corporate Tech Launch",
    category: "Corporate",
    before: "/images/generated/corporate_hall_before.png",
    after: "/images/generated/corporate-launch.png",
    image: "/images/generated/corporate-launch.png",
    description: "Futuristic stage design for a product launch, featuring a massive curved LED wall and glossy flooring.",
    size: "medium",
  },
  {
    id: 4,
    title: "Cultural Heritage Fest",
    category: "Concert",
    before: "/images/generated/wedding_stage_before.png",
    after: "/images/generated/cultural-fest.png",
    image: "/images/generated/cultural-fest.png",
    description: "Vibrant traditional decor with warm lighting and hanging lanterns for a cultural celebration.",
    size: "small",
  },
  {
    id: 5,
    title: "Gala Dinner Experience",
    category: "Corporate",
    before: "/images/generated/corporate_hall_before.png",
    after: "/images/generated/corporate_hall_after.png", // Placeholder
    image: "/images/Corporate events/Annual Gala Night/gala1.jpg",
    description: "Elegant dining setup with mood lighting and centerpieces for an annual corporate gala.",
    size: "small",
  },
];

const categories = ["All", "Wedding", "Corporate", "Concert"];

export default function Portfolio() {
  const [activeCat, setActiveCat] = useState("All");
  const [selectedId, setSelectedId] = useState(null);

  const filteredProjects =
    activeCat === "All"
      ? projects
      : projects.filter((p) => p.category === activeCat);

  return (
    <div className="min-h-screen bg-midnight text-pearl pt-28 px-4 sm:px-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-heading text-champagne mb-6 drop-shadow-lg">
          Immersive Portfolio
        </h1>
        <p className="text-pearl/80 text-lg max-w-2xl mx-auto">
          Witness the transformation. Click on any project to see the Before & After journey.
        </p>
      </motion.div>

      {/* Filter Bar */}
      <div className="flex justify-center gap-4 mb-16 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 border ${activeCat === cat
                ? "bg-champagne text-obsidian border-champagne shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                : "bg-transparent text-pearl border-pearl/30 hover:border-champagne hover:text-champagne"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <motion.div
              layoutId={`card-${project.id}`}
              key={project.id}
              onClick={() => setSelectedId(project.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group border border-white/10 ${project.size === "large" ? "md:col-span-2 md:row-span-2" : ""
                } ${project.size === "medium" ? "md:col-span-1 md:row-span-2" : ""}`}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

              <div className="absolute bottom-0 left-0 p-6 w-full">
                <p className="text-champagne text-xs font-bold tracking-widest uppercase mb-2">
                  {project.category}
                </p>
                <h3 className="text-2xl font-heading text-white group-hover:text-gold transition-colors">
                  {project.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Expanded View (Modal) */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[60] flex items-center justify-center p-4"
            onClick={() => setSelectedId(null)}
          >
            {projects.map(
              (project) =>
                project.id === selectedId && (
                  <motion.div
                    layoutId={`card-${project.id}`}
                    key={project.id}
                    className="bg-charcoal w-full max-w-5xl rounded-2xl overflow-hidden border border-champagne/20 shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Image Section (Before/After Slider could go here, simple toggle for now) */}
                    <div className="w-full md:w-2/3 h-64 md:h-auto relative bg-black">
                      <BeforeAfterSlider before={project.before} after={project.after} />
                    </div>

                    {/* Content Section */}
                    <div className="w-full md:w-1/3 p-8 flex flex-col justify-center bg-midnight">
                      <p className="text-champagne text-sm font-bold tracking-widest uppercase mb-2">
                        {project.category}
                      </p>
                      <h2 className="text-3xl md:text-4xl font-heading text-white mb-6">
                        {project.title}
                      </h2>
                      <p className="text-pearl/80 leading-relaxed mb-8">
                        {project.description}
                      </p>

                      <button
                        onClick={() => setSelectedId(null)}
                        className="self-start px-6 py-2 border border-pearl/30 rounded-full text-pearl hover:bg-pearl hover:text-midnight transition"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple Before/After Component
function BeforeAfterSlider({ before, after }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (event) => {
    if (!isDragging) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-col-resize select-none"
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={(e) => {
        if (!isDragging) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
        setSliderPosition(percent);
      }}
    >
      <img
        src={after}
        alt="After"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={before}
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          // Note: max-w-none and width of parent ensures image doesn't squash
          style={{ width: "100%" }}
        />
        {/* Label */}
        <div className="absolute bottom-4 left-4 bg-black/60 text-white px-2 py-1 text-xs rounded">Before</div>
      </div>
      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 text-xs rounded">After</div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-black">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
          </svg>
        </div>
      </div>
    </div>
  );
}
