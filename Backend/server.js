import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

import adminRoutes from "./routes/adminRoutes.js";
import Contact from "./models/Contact.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/admin", adminRoutes);

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, countryCode, message } = req.body;

    // Validation
    if (!name || !email || !phone || !countryCode || !message) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // Save to DB
    await Contact.create({ name, email, phone, countryCode, message });

    // Mail Transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const whatsapp = `https://wa.me/${countryCode.replace("+", "")}${phone}`;

    // Admin Email
    await transporter.sendMail({
      from: `"IlluminaVista" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `📩 New Message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> <a href="${whatsapp}">${countryCode} ${phone}</a></p>
        <p><strong>Message:</strong></p>
        <blockquote>${message}</blockquote>
      `,
    });

    // User Auto-Reply
    await transporter.sendMail({
      from: `"IlluminaVista" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We received your message",
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for contacting IlluminaVista.</p>
        <p>Your message has been received and we will reply shortly.</p>
        <blockquote>${message}</blockquote>
        <p>- Team IlluminaVista</p>
      `,
    });

    return res.json({
      success: true,
      message: "Message sent successfully",
    });

  } catch (err) {
    console.error("❌ Error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
