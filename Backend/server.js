import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { Resend } from "resend";

import adminRoutes from "./routes/adminRoutes.js";
import Contact from "./models/Contact.js";

dotenv.config();

const app = express();

/* -------------------- CORS -------------------- */
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* -------------------- DATABASE -------------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    // Do NOT exit process on Render free tier
  });

/* -------------------- KEEP-ALIVE -------------------- */
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "VJ Events Backend Running",
  });
});

/* -------------------- ROUTES -------------------- */
app.use("/api/admin", adminRoutes);

/* -------------------- CONTACT FORM -------------------- */
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, countryCode, message } = req.body;

    if (!name || !email || !phone || !countryCode || !message) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    // Save immediately
    await Contact.create({
      name,
      email,
      phone,
      countryCode,
      message,
    });

    // Respond fast — do NOT wait for emails
    res.json({
      success: true,
      message: "Message received successfully",
    });

    // Background email task (fire-and-forget)
    (async () => {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const whatsapp = `https://wa.me/${countryCode.replace(
          "+",
          ""
        )}${phone}`;

        // Email to admin
        await resend.emails.send({
          from: "VJ Events <onboarding@resend.dev>",
          to: process.env.ADMIN_EMAIL,
          replyTo: email,
          subject: `📩 Message from ${name}`,
          html: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> <a href="${whatsapp}">
              ${countryCode} ${phone}
            </a></p>
            <blockquote>${message}</blockquote>
          `,
        });

        // Auto-reply to user
        await resend.emails.send({
          from: "VJ Events <onboarding@resend.dev>",
          to: email,
          subject: "We received your message",
          html: `
            <h2>Hello ${name},</h2>
            <p>Thank you for contacting VJ Events.</p>
            <p>We’ll get back to you shortly.</p>
            <p>- Team VJ Events</p>
          `,
        });
      } catch (err) {
        console.error("❌ Email sending failed:", err.message);
      }
    })();
  } catch (err) {
    console.error("❌ Contact API Error:", err.message);
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
