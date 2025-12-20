// src/pages/ContactUs.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf"; // npm install jspdf

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const API = import.meta.env.VITE_API_URL || "";

  // Validation helpers
  const emailValid = (v) =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,63})+$/.test(v || "");
  const phoneValid = (v) =>
    // Accepts 10 digit indian numbers (optionally with country code); adjust to your needs
    /^\d{10}$/.test(v || "");

  useEffect(() => {
    // Clear status when user edits
    if (status) {
      const t = setTimeout(() => setStatus(""), 8000);
      return () => clearTimeout(t);
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    setErrors((s) => ({ ...s, [name]: null }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name || formData.name.trim().length < 2) e.name = "Please enter your name";
    if (!emailValid(formData.email)) e.email = "Please enter a valid email";
    if (!phoneValid(formData.phone)) e.phone = "Enter a 10-digit phone number";
    if (!formData.message || formData.message.trim().length < 10)
      e.message = "Tell us a bit more (at least 10 characters)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const createChecklistPDF = (data) => {
    // Use jsPDF to construct a small checklist PDF and auto-download.
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 40;
      let y = 60;

      doc.setFontSize(18);
      doc.setTextColor("#D4AF37"); // gold
      doc.text("VJ Events — Event Planning Checklist", margin, y);
      y += 28;

      doc.setFontSize(11);
      doc.setTextColor("#ffffff");
      doc.setFillColor(13, 15, 23); // midnight-like
      // header box (subtle)
      doc.rect(margin - 8, y - 20, doc.internal.pageSize.width - margin * 2 + 16, 26, "F");
      doc.setTextColor("#D4AF37");
      doc.text("Thank you — we received your request", margin + 6, y - 2);
      y += 36;

      doc.setTextColor("#ffffff");
      doc.setFontSize(10);
      doc.text(`Name: ${data.name || "-"}`, margin, y);
      y += 16;
      doc.text(`Email: ${data.email || "-"}`, margin, y);
      y += 16;
      doc.text(`Phone: ${data.countryCode || ""} ${data.phone || "-"}`, margin, y);
      y += 22;

      doc.setFontSize(12);
      doc.setTextColor("#D4AF37");
      doc.text("Quick Event Checklist", margin, y);
      y += 18;

      doc.setFontSize(10);
      doc.setTextColor("#ffffff");
      const checklist = [
        "Event date & time confirmed",
        "Venue & guest count known",
        "Primary contact on-site",
        "Budget range discussed",
        "Theme / color palette specified",
        "Any AV preferences or references",
      ];
      checklist.forEach((item) => {
        doc.circle(margin + 4, y - 4, 3, "F");
        doc.text(item, margin + 18, y);
        y += 16;
      });

      y += 10;
      doc.setFontSize(9);
      doc.setTextColor("#bdbdbd");
      doc.text(
        "We will contact you within 6 hours to schedule a consultation. This checklist helps us prepare.",
        margin,
        y,
        { maxWidth: doc.internal.pageSize.width - margin * 2 }
      );

      // Auto-download
      const filename = `VJ Events-Checklist-${(data.name || "lead").replace(/\s+/g, "_")}.pdf`;
      doc.save(filename);
      return true;
    } catch (err) {
      console.error("PDF generation failed:", err);
      return false;
    }
  };

  const fallbackTextDownload = (data) => {
    // Browser fallback — create a small text file and download
    try {
      const content = [
        "VJ Events — Event Planning Checklist",
        `Name: ${data.name || "-"}`,
        `Email: ${data.email || "-"}`,
        `Phone: ${data.countryCode || ""} ${data.phone || "-"}`,
        "",
        "Checklist:",
        "- Event date & time confirmed",
        "- Venue & guest count known",
        "- Primary contact on-site",
        "- Budget range discussed",
        "- Theme / color palette specified",
        "- Any AV preferences or references",
        "",
        "We will contact you within 6 hours to schedule a consultation.",
      ].join("\n");
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `VJ Events-Checklist-${(formData.name || "lead").replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error("Text fallback failed:", err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    if (!validate()) {
      setStatus("❌ Please fix the highlighted fields.");
      return;
    }

    setLoading(true);
    setStatus("Sending...");

    try {
      // Conservative: JSON stringify trimmed values
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        countryCode: formData.countryCode.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
      };

      // Send to API if configured
      let serverSuccess = false;
      if (API) {
        const res = await fetch(`${API}/api/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        serverSuccess = !!data?.success;
      } else {
        // If no API provided, treat as success for local testing
        serverSuccess = true;
      }

      if (serverSuccess) {
        setStatus("✅ Message sent successfully! Preparing your checklist...");
        // Auto-generate PDF using jsPDF. If fails, fallback to text download
        const pdfOk = createChecklistPDF(payload);
        if (!pdfOk) fallbackTextDownload(payload);

        // Clear form after a short delay
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            countryCode: "+91",
            phone: "",
            message: "",
          });
          setLoading(false);
          setStatus("✅ Message sent — we'll contact you within 6 hours.");
        }, 900);
      } else {
        setLoading(false);
        setStatus("❌ Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setStatus("⚠️ Server error. Please try later.");
    }
  };

  // Clickable contact actions
  const phoneNumber = "+917378619692";
  const whatsappLink = `https://wa.me/91${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Hello VJ Events — I want to discuss an event."
  )}`;
  const mailLink = `mailto:contact@VJ Events.com`;

  return (
    <div className="min-h-screen bg-midnight text-pearl pt-28 px-4 sm:px-6 pb-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto text-center mb-12"
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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12, duration: 0.7 }}
          className="space-y-8"
        >
          <div className="bg-charcoal/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
            <h3 className="text-2xl font-heading text-white mb-6">Contact Information</h3>
            <div className="space-y-6">
              <ContactRow
                icon="📍"
                title="Visit Us"
                lines={[
                  "C7 Nigde Nagar, B.T.Kawde Road",
                  "Ghorpadi, Pune - 411001",
                ]}
                action={{
                  label: "Open in Maps",
                  href:
                    "https://www.google.com/maps/search/?api=1&query=BT+Kawade+Rd+Ghorpadi+Pune",
                }}
              />

              <ContactRow
                icon="✉️"
                title="Email Us"
                lines={["contact@VJ Events.com"]}
                action={{ label: "Send Email", href: mailLink }}
              />

              <ContactRow
                icon="📞"
                title="Call / WhatsApp"
                lines={[phoneNumber]}
                action={{ label: "Call", href: `tel:${phoneNumber}` }}
                extra={{ label: "WhatsApp", href: whatsappLink }}
              />
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
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.24, duration: 0.7 }}
          className="bg-charcoal rounded-2xl p-8 md:p-10 border border-champagne/20 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10 no-print" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                error={errors.name}
              />
              <InputField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                type="email"
                error={errors.email}
              />
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
                  className={`w-full bg-midnight/50 border rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all placeholder:text-white/20 ${errors.phone ? "border-red-500" : "border-white/10"}`}
                />
                {errors.phone && <div className="text-xs text-red-400">{errors.phone}</div>}
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
                className={`w-full bg-midnight/50 border rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all placeholder:text-white/20 resize-none ${errors.message ? "border-red-500" : "border-white/10"}`}
              />
              {errors.message && <div className="text-xs text-red-400">{errors.message}</div>}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-gold to-gold-glow text-obsidian font-bold py-4 rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 transform ${loading ? "opacity-80 cursor-wait" : "hover:-translate-y-1"}`}
              >
                {loading ? (
                  <>
                    <Spinner />
                    <span>Sending…</span>
                  </>
                ) : (
                  <span>Send Message</span>
                )}
              </button>

              {/* Secondary quick actions */}
              <div className="flex items-center justify-between gap-3 text-sm">
                <a href={`tel:${phoneNumber}`} className="text-pearl/80 hover:text-gold transition">
                  Call us
                </a>
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="text-pearl/80 hover:text-gold transition">
                  WhatsApp
                </a>
                <a href={mailLink} className="text-pearl/80 hover:text-gold transition">
                  Email
                </a>
              </div>
            </div>

            {/* Status */}
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

          {/* WHAT HAPPENS NEXT */}
          <div className="mt-6 pt-6 border-t border-champagne/10 text-sm text-pearl/70">
            <h4 className="text-champagne font-semibold mb-2">What happens next?</h4>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                We receive your request instantly.
              </li>
              <li>
                Our team reviews your details and reaches out within <strong>6 hours</strong> to schedule a consultation.
              </li>
              <li>
                We prepare a custom quote and next steps after the call.
              </li>
            </ol>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* -----------------------
   Small subcomponents
   ----------------------- */

function ContactRow({ icon, title, lines = [], action, extra }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center text-champagne shrink-0 text-lg">
        <span aria-hidden>{icon}</span>
      </div>

      <div className="flex-1">
        <h4 className="text-gold font-semibold mb-1">{title}</h4>
        <div className="text-pearl/70 text-sm mb-2">
          {lines.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>

        <div className="flex gap-3">
          {action && (
            <a
              href={action.href}
              target={action.href.startsWith("http") ? "_blank" : undefined}
              rel={action.href.startsWith("http") ? "noreferrer" : undefined}
              className="text-sm px-3 py-1 border border-pearl/10 rounded-md text-pearl/80 hover:bg-pearl/5 hover:text-gold transition"
            >
              {action.label}
            </a>
          )}
          {extra && (
            <a
              href={extra.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm px-3 py-1 border border-pearl/10 rounded-md text-pearl/80 hover:bg-pearl/5 hover:text-gold transition"
            >
              {extra.label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, placeholder = "", type = "text", error }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-champagne uppercase tracking-wider">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-midnight/50 border rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all placeholder:text-white/20 ${error ? "border-red-500" : "border-white/10"}`}
      />
      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-5 h-5 text-obsidian" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.1)" strokeWidth="4" />
      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
