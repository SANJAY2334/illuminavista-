import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");

  const token = localStorage.getItem("ADMIN_TOKEN");

  useEffect(() => {
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }
    fetchContacts();
    // eslint-disable-next-line
  }, []);

  async function fetchContacts() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contacts", {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) throw new Error("Failed to fetch contacts");
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function sendReply(id) {
    if (!replyText.trim()) return alert("Type a reply");

    try {
      const res = await fetch(`/api/admin/reply/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ replyMessage: replyText }),
      });
      if (!res.ok) throw new Error("Failed to send reply");
      alert("Reply sent successfully");
      setSelected(null);
      setReplyText("");
    } catch (err) {
      alert(err.message);
    }
  }

  async function deleteContact(id) {
    if (!confirm("Delete this contact?")) return;
    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) throw new Error("Failed to delete contact");
      setContacts((c) => c.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  function logout() {
    localStorage.removeItem("ADMIN_TOKEN");
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen p-6 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold tracking-widest text-[var(--color-gold)]">
            IlluminaVista <span className="text-white text-lg font-light opacity-80 block md:inline md:ml-2">Admin Dashboard</span>
          </h1>
          <button
            onClick={logout}
            className="btn-outline border-red-500/50 text-red-400 hover:text-red-300 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-gold)]"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-black/40 text-[var(--color-gold)] uppercase text-sm tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Client</th>
                    <th className="px-6 py-4 font-semibold">Contact</th>
                    <th className="px-6 py-4 font-semibold">Message</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {contacts.map((c) => (
                    <tr key={c._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{c.name}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        <div className="mb-1">{c.email}</div>
                        <div className="text-xs opacity-70">{c.countryCode} {c.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 max-w-xs truncate">
                        {c.message}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString()} <br />
                        <span className="text-xs opacity-60">{new Date(c.createdAt).toLocaleTimeString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button
                          onClick={() => setSelected(c)}
                          className="text-[var(--color-gold)] hover:text-[var(--color-gold-glow)] font-medium transition-colors text-sm"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => deleteContact(c._id)}
                          className="text-red-400 hover:text-red-300 font-medium transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {contacts.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                        No messages found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass p-8 rounded-xl w-full max-w-lg relative"
              >
                <h3 className="text-2xl font-bold mb-6 text-[var(--color-gold)]">
                  Reply to {selected.name}
                </h3>

                <div className="mb-4 p-4 bg-black/20 rounded-lg border border-gray-700/50">
                  <p className="text-sm text-gray-400 mb-1">Original Message:</p>
                  <p className="text-gray-200 italic">"{selected.message}"</p>
                </div>

                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={6}
                  placeholder="Type your response here..."
                  className="w-full p-4 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-all duration-300 mb-6"
                />

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setSelected(null);
                      setReplyText("");
                    }}
                    className="px-6 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => sendReply(selected._id)}
                    className="btn"
                  >
                    Send Reply
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
