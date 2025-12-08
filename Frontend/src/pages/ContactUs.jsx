import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  // API Base URL from .env
  const API = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("✅ Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          countryCode: "+91",
          phone: "",
          message: "",
        });
      } else {
        setStatus("❌ Failed to send message. Try again.");
      }
    } catch (error) {
      setStatus("⚠️ Server error. Please try later.");
    }
  };

  return (
    <div className="min-h-screen bg-midnight text-pearl pt-28 px-4 sm:px-6 pb-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-heading text-champagne mb-6 drop-shadow-lg">
          Get in Touch
        </h1>
        <p className="text-pearl/80 text-lg max-w-2xl mx-auto">
          Ready to illuminate your vision? Let's create something extraordinary together.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Info & Map */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="space-y-8"
        >
          <div className="bg-charcoal/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
            <h3 className="text-2xl font-heading text-white mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center text-champagne shrink-0">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h4 className="text-gold font-semibold mb-1">Visit Us</h4>
                  <p className="text-pearl/70">
                    C7 Nigde Nagar, B.T.Kawde Road,<br />Ghorpadi, Pune-411001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center text-champagne shrink-0">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4 className="text-gold font-semibold mb-1">Email Us</h4>
                  <p className="text-pearl/70">contact@illuminavista.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center text-champagne shrink-0">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div>
                  <h4 className="text-gold font-semibold mb-1">Call Us</h4>
                  <p className="text-pearl/70">+91 7378619692</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-64 rounded-2xl overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-500">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.566373327663!2d73.91166631489248!3d18.50329998741915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c18f343510e9%3A0x664062080477804a!2sB.T.%20Kawade%20Rd%2C%20Ghorpadi%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1625123456789!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Google Maps"
            ></iframe>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-charcoal rounded-2xl p-8 md:p-10 border border-champagne/20 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-champagne uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full bg-midnight/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all placeholder:text-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-champagne uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="w-full bg-midnight/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 space-y-2">
                <label className="text-sm font-semibold text-champagne uppercase tracking-wider">Code</label>
                <input
                  type="text"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-full bg-midnight/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-center"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-semibold text-champagne uppercase tracking-wider">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  required
                  className="w-full bg-midnight/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-champagne uppercase tracking-wider">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about your event..."
                required
                className="w-full bg-midnight/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all placeholder:text-white/20 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold to-gold-glow text-obsidian font-bold py-4 rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 transform hover:-translate-y-1"
            >
              Send Message
            </button>

            {status && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center text-sm ${status.includes("✅") ? "text-green-400" : "text-red-400"}`}
              >
                {status}
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
