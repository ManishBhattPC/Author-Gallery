import React, { useState, useEffect } from "react";
import { PenTool, Trash2, FileText, CheckCircle, RefreshCw, Upload, Image, AlertCircle, Sparkles } from "lucide-react";
import apiClient from "../../services/apiClient.js";

const CreateWork = ({ onPublished }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [price, setPrice] = useState("0");
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split("T")[0]);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImageName, setCoverImageName] = useState("");

  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState(null);

  // Count words in editor content
  useEffect(() => {
    const words = content.trim().split(/\s+/).length;
    setWordCount(content.trim() === "" ? 0 : words);
  }, [content]);

  // Auto-save draft content locally
  useEffect(() => {
    if (title || content) {
      setSaving(true);
    }
    const saveTimer = setTimeout(() => {
      if (title || content) {
        localStorage.setItem(
          "draft",
          JSON.stringify({ title, content, timestamp: new Date() })
        );
        setSaving(false);
        setLastSaved(new Date());
      }
    }, 1200);

    return () => clearTimeout(saveTimer);
  }, [title, content]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("draft");
    if (draft) {
      try {
        const { title: draftTitle, content: draftContent } = JSON.parse(draft);
        setTitle(draftTitle || "");
        setContent(draftContent || "");
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, []);

  const handleClearDraft = () => {
    if (window.confirm("Delete draft permanently?")) {
      localStorage.removeItem("draft");
      setTitle("");
      setContent("");
      setDescription("");
      setCoverImageFile(null);
      setCoverImageName("");
      setLastSaved(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImageName(file.name);
    }
  };

  // Generate a beautiful canvas cover if no image is uploaded
  const generateCanvasCover = (bookTitle) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 850;
      const ctx = canvas.getContext("2d");

      // Paint warm elegant copper-gold gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 850);
      grad.addColorStop(0, "#8C4E35");  // Copper Accent
      grad.addColorStop(0.6, "#703b25");
      grad.addColorStop(1, "#361b10");    // Dark Espresso
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 850);

      // Decorative borders
      ctx.strokeStyle = "rgba(250, 246, 240, 0.2)";
      ctx.lineWidth = 15;
      ctx.strokeRect(20, 20, 560, 810);
      
      ctx.strokeStyle = "rgba(250, 246, 240, 0.4)";
      ctx.lineWidth = 3;
      ctx.strokeRect(35, 35, 530, 780);

      // Book title typography
      ctx.fillStyle = "#FAF6F0"; // warm parchment text
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Handle title wrapping
      ctx.font = "bold 38px Georgia, serif";
      const words = bookTitle.split(" ");
      let line = "";
      const lines = [];
      const maxWidth = 460;
      const lineHeight = 55;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      let startY = 300 - ((lines.length - 1) * lineHeight) / 2;
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i].trim(), 300, startY + i * lineHeight);
      }

      // Author label at the bottom
      ctx.font = "italic 22px Georgia, serif";
      ctx.fillStyle = "rgba(250, 246, 240, 0.85)";
      ctx.fillText("Published at Author Gallery", 300, 700);

      // Convert canvas to base64 data URL
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      resolve(dataUrl);
    });
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!title.trim()) {
      setMessage({ type: "error", text: "Please enter a book title." });
      return;
    }
    if (!content.trim()) {
      setMessage({ type: "error", text: "Please write some content in the editor." });
      return;
    }
    if (!genre) {
      setMessage({ type: "error", text: "Please select a genre." });
      return;
    }

    setPublishing(true);

    try {
      const form = new FormData();
      form.append("title", title.trim());
      form.append("description", description.trim() || `A text work titled "${title.trim()}"`);
      form.append("genres", genre);
      form.append("price", price || "0");
      form.append("publishDate", publishDate);
      form.append("content", content); // Send directly as text to generate PDF backend

      if (coverImageFile) {
        form.append("coverImage", coverImageFile);
      } else {
        const base64Cover = await generateCanvasCover(title.trim());
        form.append("coverImage", base64Cover);
      }

      await apiClient.post("/api/books", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ type: "success", text: "Your work has been published successfully! 🎉" });
      
      // Clear forms & localStorage draft
      setTitle("");
      setContent("");
      setDescription("");
      setCoverImageFile(null);
      setCoverImageName("");
      localStorage.removeItem("draft");
      setLastSaved(null);

      if (onPublished) {
        onPublished();
      }

      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || err.message || "Failed to publish notepad book.",
      });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl flex flex-col h-full">
      {/* Header Info */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-amber-700" />
            Write & Publish
          </h2>
          <p className="text-slate-500 text-xs mt-1">Draft and publish directly as an eBook. We will generate the PDF for you.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          {saving ? (
            <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Saving...
            </span>
          ) : lastSaved ? (
            <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckCircle className="w-3.5 h-3.5" />
              Draft Saved
            </span>
          ) : (
            <span className="bg-slate-50 px-2.5 py-1 rounded-full">Auto-saves to browser</span>
          )}
        </div>
      </div>

      <form onSubmit={handlePublish} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left notepad editor (2/3 width) */}
        <div className="lg:col-span-2 space-y-4 flex flex-col">
          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Masterpiece..."
            className="w-full text-xl font-bold text-slate-800 bg-transparent border-b border-slate-100 focus:border-amber-600 pb-3 outline-none placeholder-slate-350 transition-colors"
            required
          />

          {/* Editor area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing your story, poem, or article here. Your changes will automatically save locally..."
            className="w-full min-h-[350px] flex-grow p-4 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-50/30 focus:border-amber-600 rounded-xl text-slate-700 placeholder-slate-400 outline-none transition-all resize-none text-sm leading-relaxed"
            required
          />

          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4 text-slate-400" />
              Word Count: <span className="text-slate-800">{wordCount}</span>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClearDraft}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Notepad
              </button>
            </div>
          </div>
        </div>

        {/* Right publishing settings panel (1/3 width) */}
        <div className="bg-slate-50 border border-slate-150 rounded-xl p-5 space-y-4 text-xs font-semibold">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200/60 pb-2 mb-2">Publish Settings</h3>
          
          {/* Synopsis / Description */}
          <div>
            <label className="block text-slate-600 mb-1">Synopsis / Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief synopsis of your work..."
              rows={3}
              required
              className="w-full px-3 py-2 bg-white border border-slate-200 focus:ring-4 focus:ring-amber-50/30 focus:border-amber-600 rounded-lg text-slate-700 outline-none transition-all placeholder-slate-400 font-normal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Genre */}
            <div>
              <label className="block text-slate-600 mb-1">Genre *</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
                className="w-full px-2 py-2 bg-white border border-slate-200 focus:ring-4 focus:ring-amber-50/30 focus:border-amber-600 rounded-lg text-slate-700 outline-none transition-all font-normal text-xs"
              >
                <option value="">Genre</option>
                <option value="Novel">Novel</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Romance">Romance</option>
                <option value="Thriller">Thriller</option>
                <option value="Mystery">Mystery</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Biography">Biography</option>
                <option value="History">History</option>
                <option value="Poetry">Poetry</option>
                <option value="Spiritual">Spiritual</option>
                <option value="Self-Help">Self-Help</option>
                <option value="Education">Education</option>
                <option value="Business">Business</option>
                <option value="Technology">Technology</option>
                <option value="Children">Children</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-slate-600 mb-1">Price (₹) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 bg-white border border-slate-200 focus:ring-4 focus:ring-amber-50/30 focus:border-amber-600 rounded-lg text-slate-700 outline-none transition-all placeholder-slate-400 font-normal"
              />
            </div>
          </div>

          {/* Publish Date */}
          <div>
            <label className="block text-slate-600 mb-1">Publish Date *</label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-200 focus:ring-4 focus:ring-amber-50/30 focus:border-amber-600 rounded-lg text-slate-500 focus:text-slate-800 outline-none transition-all font-normal"
            />
          </div>

          {/* Optional Book Cover Upload */}
          <div>
            <label className="block text-slate-600 mb-1.5 flex justify-between items-center">
              <span>Book Cover</span>
              <span className="text-[10px] text-amber-700 font-normal">(Optional)</span>
            </label>
            <label className="flex flex-col items-center justify-center p-3 border border-dashed border-slate-300 hover:border-amber-600/50 bg-white hover:bg-amber-50/5 rounded-lg cursor-pointer transition-all duration-300">
              <Upload className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-[10px] text-slate-500 font-normal">Click to upload cover photo</span>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </label>
            {coverImageName ? (
              <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1 font-medium truncate max-w-full">
                <Image className="w-3 h-3 shrink-0" />
                {coverImageName}
              </p>
            ) : (
              <p className="text-[9px] text-slate-400 mt-1 font-normal italic">
                Leaves empty to generate elegant text-based cover automatically.
              </p>
            )}
          </div>

          {/* Messages */}
          {message && (
            <div className={`p-3 rounded-lg text-[11px] font-semibold flex items-center gap-2 border ${
              message.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-100" : "bg-red-50 text-red-800 border-red-100"
            }`}>
              {message.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span className="leading-relaxed">{message.text}</span>
            </div>
          )}

          {/* Action buttons */}
          <button
            type="submit"
            disabled={publishing}
            className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-[#FAF6F0] rounded-lg font-bold text-sm transition-all focus:ring-4 focus:ring-amber-100 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer mt-4"
          >
            <Sparkles size={14} />
            {publishing ? "Publishing..." : "Publish Work"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateWork;