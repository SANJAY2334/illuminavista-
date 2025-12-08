import express from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

const router = express.Router();

// Middleware to check JWT
export const adminAuth = (req,res,next)=>{
  const token = req.headers["authorization"]?.split(" ")[1];
  if(!token) return res.status(401).json({ error:"Unauthorized" });
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error:"Invalid token" });
  }
}

// Admin registration
router.post("/register", async (req,res)=>{
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error:"Email & password required" });
  
  const exists = await Admin.findOne({ email });
  if(exists) return res.status(400).json({ error:"Admin already exists" });

  const admin = new Admin({ email, password });
  await admin.save();
  res.json({ success:true, message:"Admin account created" });
});

// Admin login
router.post("/login", async (req,res)=>{
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if(!admin) return res.status(401).json({ error:"Invalid credentials" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if(!isMatch) return res.status(401).json({ error:"Invalid credentials" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn:"2h" });
  res.json({ token });
});

// Get all contacts
router.get("/contacts", adminAuth, async (req,res)=>{
  const contacts = await Contact.find().sort({ createdAt:-1 });
  res.json({ contacts });
});

// Reply to contact
router.post("/reply/:id", adminAuth, async (req,res)=>{
  const { replyMessage } = req.body;
  const contact = await Contact.findById(req.params.id);
  if(!contact) return res.status(404).json({ error:"Contact not found" });

  try {
    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // use app password if 2FA is enabled
      }
    });

    // Send reply to client
    await transporter.sendMail({
      from: `"Admin — IlluminaVista" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: `Reply from IlluminaVista`,
      html: `<p>Hello ${contact.name},</p>
             <p>${replyMessage}</p>
             <hr>
             <p>— IlluminaVista Team</p>`
    });

    res.json({ success:true, message:"Reply email sent successfully" });
  } catch(err) {
    console.error("Failed to send reply:", err);
    res.status(500).json({ error:"Failed to send reply email" });
  }
});

// Delete contact
router.delete("/contact/:id", adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: "Contact not found" });

    // Send email to client
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use app password if 2FA enabled
      },
    });

    const mailOptions = {
      from: `"Admin — IlluminaVista" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: "Notice Regarding Our Services-IlluminaVista",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;border:1px solid #ddd;border-radius:8px;">
          <h2 style="color:#D32F2F;">Hello ${contact.name},</h2>
          <p>We regret to inform you that currently, we are not able to provide our services.</p>
          <p>Thank you for reaching out, and we apologize for any inconvenience caused.</p>
          <hr>
          <p style="font-size:12px;color:#777;">This is an automated notification from <b>IlluminaVista</b>.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Delete from database
    await Contact.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Contact deleted & notification sent" });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ error: "Failed to delete contact or send email" });
  }
});

export default router;
