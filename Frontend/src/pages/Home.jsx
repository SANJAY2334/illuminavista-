import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Video */}
        <motion.video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          initial={{ opacity: 0 }}
          animate={{ opacity: videoLoaded ? 1 : 0 }}
          transition={{ duration: 1.5 }}
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </motion.video>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative text-center px-4"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-heading text-champagne drop-shadow-lg">
            IlluminaVista
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-pearl/90 max-w-xl mx-auto">
            Where Vision meets Precision
          </p>
          
        </motion.div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="relative bg-midnight/95 text-pearl py-20 sm:py-24"
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-heading text-center mb-12 text-champagne"
          >
            About IlluminaVista
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-start"
          >
            <div className="space-y-6 text-lg leading-relaxed text-pearl/90">
              <p>
                At IlluminaVista, we believe every event is more than just a
                gathering—it’s a story waiting to be told. We specialize in
                crafting immersive experiences that blend the art of lighting
                and sound with the science of precision planning.
              </p>
              <p>
                Our name reflects our core philosophy: to illuminate visions. We
                don’t just light up venues—we bring ideas to life, working
                closely with our clients to understand their goals and audience.
              </p>
              <p>
                What sets us apart is our commitment to harmony. Lighting and
                sound weave together into a symphony of sensation, elevating the
                ordinary into the extraordinary.
              </p>
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-pearl/90">
              <p>
                Our portfolio spans corporate galas, private celebrations,
                product launches, weddings, and more. We invest in cutting-edge
                technology and continuously refine our processes to stay ahead
                of trends.
              </p>
              <p>
                Sustainability and responsibility are also central to our ethos.
                We minimize our environmental footprint while delivering
                breathtaking results.
              </p>
              <p>
                At IlluminaVista, every event is an opportunity to inspire. We
                don’t settle for good—we aim for unforgettable.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
