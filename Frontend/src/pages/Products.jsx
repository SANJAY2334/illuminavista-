import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function Products() {
  const reduceMotion = useReducedMotion();

  // Product list with generated images
  const products = [
    {
      id: 1,
      name: "EnBon B Pro Series",
      image: "/images/generated/led-wall.png",
      description:
        "High-resolution LED video wall panels delivering vibrant visuals with pitch-perfect clarity for any scale.",
      category: "Visuals",
      specs: ["4K Support", "High Refresh Rate", "Modular Design"],
    },
    {
      id: 2,
      name: "Shure Axient Digital",
      image: "/images/generated/wireless-mic.png",
      description:
        "Industry-standard wireless microphone system ensuring crystal-clear audio transmission in complex RF environments.",
      category: "Audio",
      specs: ["Wide Tuning", "Low Latency", "Encryption"],
    },
    {
      id: 3,
      name: "Meyer Sound LINA",
      image: "/images/generated/line-array.png",
      description:
        "Compact linear line array loudspeaker offering exceptional power and linearity for concerts and events.",
      category: "Audio",
      specs: ["Native Mode", "Compact Footprint", "Precise Coverage"],
    },
    {
      id: 4,
      name: "Clay Paky Sharpy",
      image: "/images/generated/dj-night.png",
      description:
        "The legendary beam light that redefined stage lighting with its perfectly parallel, laser-like beam.",
      category: "Lighting",
      specs: ["189W Lamp", "Zero Halo", "Rapid Movement"],
    },
  ];

  // hold load state for images and error fallback
  const [imgLoaded, setImgLoaded] = useState({});
  const [imgError, setImgError] = useState({});

  const fallbackImage =
    "https://placehold.co/800x600/0d0f17/ffffff?text=No+Image";

  const handleImgLoad = (id) =>
    setImgLoaded((s) => ({ ...s, [id]: true }));

  const handleImgError = (id) =>
    setImgError((s) => ({ ...s, [id]: true }));

  // Motion variants guarded by reduced-motion preference
  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-midnight text-pearl min-h-screen pt-28 px-4 sm:px-6 pb-20">
      {/* Hero */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 30 }}
        animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center mb-20"
      >
        <h1 className="text-4xl md:text-6xl font-heading text-champagne mb-6 drop-shadow-lg">
          Tech Inventory
        </h1>
        <p className="text-pearl/80 text-lg max-w-2xl mx-auto">
          We invest in the world's finest audio-visual technology to ensure your
          event looks and sounds flawless.
        </p>
      </motion.div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((product, i) => (
          <motion.article
            key={product.id}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={cardVariants}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            className="group relative bg-charcoal rounded-2xl overflow-hidden border border-white/5 hover:border-champagne/30 transition-colors duration-300 focus-within:ring-2 focus-within:ring-champagne/20"
            tabIndex={0}
            aria-labelledby={`product-title-${product.id}`}
          >
            {/* Image Section */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
              {/* skeleton */}
              {!imgLoaded[product.id] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-gray-800 animate-pulse" />
                </div>
              )}

              <img
                src={imgError[product.id] ? fallbackImage : product.image}
                alt={product.name}
                loading="lazy"
                className={`w-full h-full object-contain p-6 transition-transform duration-700 ${
                  imgLoaded[product.id] ? "opacity-100 group-hover:scale-105" : "opacity-0"
                }`}
                onLoad={() => handleImgLoad(product.id)}
                onError={() => handleImgError(product.id)}
                // Defensive: keep layout stable
                style={{ willChange: "transform, opacity" }}
              />

              {/* Overlay Gradient — lighter by default */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Content Section */}
            <div className="p-6 relative">
              <div className="absolute top-4 right-6 -translate-y-1/2 bg-midnight border border-champagne/20 px-4 py-1 rounded-full text-xs font-bold text-champagne uppercase tracking-widest shadow">
                {product.category}
              </div>

              <h2
                id={`product-title-${product.id}`}
                className="text-2xl font-heading text-white mb-3 group-hover:text-gold transition-colors"
              >
                {product.name}
              </h2>

              <p className="text-pearl/70 mb-6 leading-relaxed min-h-[3.2rem]">
                {product.description}
              </p>

              {/* Specs */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.specs.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white/5 rounded-md text-xs text-pearl/60 border border-white/5"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-champagne text-midnight rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 transition"
                  onClick={() => {
                    // placeholder — replace with real action (view, add to cart, details route)
                    // keep minimal behavior so page remains testable without router
                    window.alert(`${product.name} — details coming soon.`);
                  }}
                >
                  View details
                </button>

                <div className="text-xs text-pearl/60">ID: {product.id}</div>
              </div>

              {/* Hover Glow Line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
