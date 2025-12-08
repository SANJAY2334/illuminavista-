import React, { useState } from "react";
import { motion } from "framer-motion";

export default function AdminRegister() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      alert("Admin account created successfully!");
      window.location.href = "/admin/login";
    } catch (err) {
      alert("Registration error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass p-10 rounded-2xl w-full max-w-md relative z-10"
      >
        <h2 className="text-3xl font-bold mb-8 text-center tracking-wider">
          New Administrator
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block mb-2 text-gray-300 font-medium tracking-wide">Username</label>
            <input
              type="text"
              className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-all duration-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin Username"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300 font-medium tracking-wide">Email</label>
            <input
              type="email"
              className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-all duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@illuminavista.com"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300 font-medium tracking-wide">Password</label>
            <input
              type="password"
              className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-all duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300 font-medium tracking-wide">Confirm Password</label>
            <input
              type="password"
              className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-all duration-300"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full btn mt-6"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register Access"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Already have access?{" "}
            <a href="/admin/login" className="text-[var(--color-gold)] hover:text-[var(--color-gold-glow)] transition-colors font-semibold">
              Login here
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
