import React, { useState } from "react";
import { sendContactMessage } from "../services/contactService.js";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendContactMessage(form);
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.message || "Unable to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Get in Touch</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">Contact Author Gallery</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
            Have a question, feedback, or feature request? Send us a message and our team will get back to you soon.
          </p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Message</span>
            <textarea
              name="message"
              rows="6"
              value={form.message}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </label>

          {error && <p className="text-sm text-rose-600">{error}</p>}
          {submitted && <p className="text-sm text-emerald-700">Thank you! Your message has been sent successfully.</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-amber-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;