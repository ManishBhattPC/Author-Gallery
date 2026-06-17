import React, { useState } from "react";

const CreateWork = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // API CALL: Connects to backend endpoint (POST /api/works)
      // await createWork({ title, content });
      setMessage("Draft saved successfully.");
    } catch (error) {
      setMessage("Unable to save draft. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-5 rounded-3xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Create New Work</h2>
        <p className="mt-1 text-sm text-slate-500">Draft your next book, story, or article here.</p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your title"
          className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700">Content</label>
        <textarea
          rows="8"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
        />
      </div>

      {message && <p className="text-sm text-slate-700">{message}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Saving…" : "Save Draft"}
        </button>
        <button
          type="button"
          className="rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-800"
        >
          Publish
        </button>
      </div>
    </form>
  );
};

export default CreateWork;