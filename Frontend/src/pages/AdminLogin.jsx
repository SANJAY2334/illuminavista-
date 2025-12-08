import React, { useState } from "react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("ADMIN_TOKEN", data.token);
      window.location.href = "/admin/dashboard";

    } catch (err) {
      alert("Login error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass p-10 rounded-2xl w-full max-w-md relative z-10"
      >
        <h2 className="text-4xl font-bold mb-8 text-center tracking-wider">
          Admin Portal
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-300 font-medium tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-all duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@illuminavista.com"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300 font-medium tracking-wide">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-all duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full btn mt-4"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Enter Dashboard"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            New Administrator?{" "}
            <a
              href="/admin/register"
              className="text-[var(--color-gold)] hover:text-[var(--color-gold-glow)] transition-colors font-semibold"
            >
              Register Access
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
