import { motion } from "framer-motion";

export default function Products() {
  // Product list with generated images
  const products = [
    {
      id: 1,
      name: "EnBon B Pro Series",
      image: "/images/generated/led-wall.png",
      description: "High-resolution LED video wall panels delivering vibrant visuals with pitch-perfect clarity for any scale.",
      category: "Visuals",
      specs: ["4K Support", "High Refresh Rate", "Modular Design"],
    },
    {
      id: 2,
      name: "Shure Axient Digital",
      image: "/images/generated/wireless-mic.png",
      description: "Industry-standard wireless microphone system ensuring crystal-clear audio transmission in complex RF environments.",
      category: "Audio",
      specs: ["Wide Tuning", "Low Latency", "Encryption"],
    },
    {
      id: 3,
      name: "Meyer Sound LINA",
      image: "/images/generated/line-array.png",
      description: "Compact linear line array loudspeaker offering exceptional power and linearity for concerts and events.",
      category: "Audio",
      specs: ["Native Mode", "Compact Footprint", "Precise Coverage"],
    },
    {
      id: 4,
      name: "Clay Paky Sharpy",
      image: "/images/generated/dj-night.png", // Using DJ night as context for lighting
      description: "The legendary beam light that redefined stage lighting with its perfectly parallel, laser-like beam.",
      category: "Lighting",
      specs: ["189W Lamp", "Zero Halo", "Rapid Movement"],
    },
  ];

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
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="group relative bg-charcoal rounded-2xl overflow-hidden border border-white/5 hover:border-champagne/30 transition-colors duration-500"
          >
            {/* Image Section */}
            <div className="relative h-80 overflow-hidden bg-black/50">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80" />
            </div>

            {/* Content Section */}
            <div className="p-8 relative">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-midnight border border-champagne/20 px-4 py-1 rounded-full text-xs font-bold text-champagne uppercase tracking-widest shadow-lg">
                {product.category}
              </div>

              <h2 className="text-2xl font-heading text-white mb-3 group-hover:text-gold transition-colors">
                {product.name}
              </h2>
              <p className="text-pearl/70 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Specs */}
              <div className="flex flex-wrap gap-2">
                {product.specs.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white/5 rounded-md text-xs text-pearl/60 border border-white/5"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Hover Glow Line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
