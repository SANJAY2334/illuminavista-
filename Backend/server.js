import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { Resend } from "resend";

import adminRoutes from "./routes/adminRoutes.js";
import Contact from "./models/Contact.js";

dotenv.config();

const app = express();

// --- CORS ---
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// --- Database ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// --- Health Check ---
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "IlluminaVista Backend Running" });
});

// --- Admin Routes ---
app.use("/api/admin", adminRoutes);

// --- Contact Form ---
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, countryCode, message } = req.body;

    if (!name || !email || !phone || !countryCode || !message) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    await Contact.create({ name, email, phone, countryCode, message });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const whatsapp = `https://wa.me/${countryCode.replace("+", "")}${phone}`;

    // --- Send to Admin ---
    await resend.emails.send({
      from: "IlluminaVista <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `📩 Message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> <a href="${whatsapp}">${countryCode} ${phone}</a></p>
        <blockquote>${message}</blockquote>
      `,
    });

    // --- Auto reply to user ---
    await resend.emails.send({
      from: "IlluminaVista <onboarding@resend.dev>",
      to: email,
      subject: "We received your message",
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for contacting IlluminaVista.</p>
        <blockquote>${message}</blockquote>
        <p>- Team IlluminaVista</p>
      `,
    });

    return res.json({ success: true, message: "Message sent successfully" });

  } catch (err) {
    console.error("❌ Contact Form Error:", err.message);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// --- Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
