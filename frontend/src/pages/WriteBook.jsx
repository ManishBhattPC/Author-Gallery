import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  PenTool, 
  Trash2, 
  FileText, 
  CheckCircle, 
  RefreshCw, 
  Sparkles, 
  Plus, 
  BookOpen, 
  Layout, 
  ChevronRight,
  Info,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "../AuthContext.jsx";
import apiClient from "../services/apiClient.js";

const TEMPLATES = [
  { id: "royal_indigo", name: "Royal Indigo & Gold", desc: "Dark elegant navy with classic gold accents" },
  { id: "crimson_velvet", name: "Crimson Velvet", desc: "Deep rich maroon with delicate cream framing" },
  { id: "forest_sage", name: "Forest Sage", desc: "Rich dark emerald with vintage gold leaf corners" },
  { id: "vintage_parchment", name: "Vintage Parchment", desc: "Classic warm beige with bold charcoal margins" }
];

const TEMPLATE_STYLES = {
  royal_indigo: {
    container: "bg-[#0F172A] border-2 border-amber-500/35 text-amber-100 shadow-xl",
    title: "text-[#E6C687] border-amber-550/45 placeholder-amber-200/40 focus:border-amber-400 font-serif",
    textarea: "bg-[#1E293B] border border-amber-500/20 text-[#FAF6F0] focus:ring-amber-500/20 focus:border-amber-400 placeholder-[#FAF6F0]/40 font-serif",
    footer: "text-amber-300/70",
    footerCount: "text-[#E6C687]"
  },
  crimson_velvet: {
    container: "bg-[#3B0712] border-2 border-red-500/30 text-[#FAF6F0] shadow-xl",
    title: "text-[#FAF6F0] border-red-500/30 placeholder-red-200/45 focus:border-[#FAF6F0] font-serif",
    textarea: "bg-[#450A0A] border border-red-500/20 text-[#FAF6F0] focus:ring-red-500/20 focus:border-[#FAF6F0] placeholder-[#FAF6F0]/40 font-serif",
    footer: "text-red-300/70",
    footerCount: "text-[#FAF6F0]"
  },
  forest_sage: {
    container: "bg-[#022C22] border-2 border-emerald-500/35 text-[#FAF6F0] shadow-xl",
    title: "text-[#C5A880] border-emerald-500/35 placeholder-emerald-200/40 focus:border-[#C5A880] font-serif",
    textarea: "bg-[#064E3B] border border-emerald-500/20 text-[#FAF6F0] focus:ring-emerald-500/20 focus:border-[#C5A880] placeholder-[#FAF6F0]/40 font-serif",
    footer: "text-emerald-300/70",
    footerCount: "text-[#C5A880]"
  },
  vintage_parchment: {
    container: "bg-[#FAF6F0] border-2 border-[#3A3026]/75 text-[#3A3026] shadow-xl",
    title: "text-[#3A3026] border-[#3A3026]/30 placeholder-[#3A3026]/40 focus:border-[#3A3026] font-serif",
    textarea: "bg-[#FAF6F0] border border-[#3A3026]/20 text-[#3A3026] focus:ring-[#3A3026]/25 focus:border-[#3A3026] placeholder-[#3A3026]/40 font-serif",
    footer: "text-[#3A3026]/75",
    footerCount: "text-[#3A3026]"
  }
};

const WriteBook = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Mobile state management: "editor", "templates", "drafts"
  const [mobileTab, setMobileTab] = useState("editor");

  // Load drafts from localStorage
  const [drafts, setDrafts] = useState(() => {
    try {
      const saved = localStorage.getItem("author_gallery_drafts");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load drafts from localStorage", e);
      return [];
    }
  });

  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Initialize or set current draft
  useEffect(() => {
    if (drafts.length === 0) {
      const defaultDraft = {
        id: "draft_" + Date.now(),
        title: "",
        content: "",
        description: "",
        genre: "",
        price: "0",
        publishDate: new Date().toISOString().split("T")[0],
        templateId: "royal_indigo",
        lastSaved: new Date().toISOString()
      };
      setDrafts([defaultDraft]);
      setCurrentDraftId(defaultDraft.id);
      localStorage.setItem("author_gallery_drafts", JSON.stringify([defaultDraft]));
    } else if (!currentDraftId) {
      setCurrentDraftId(drafts[0].id);
    }
  }, [drafts, currentDraftId]);

  // Find active draft
  const activeDraft = drafts.find(d => d.id === currentDraftId) || drafts[0];

  // Canvas drawing helper function
  const drawCover = () => {
    if (!canvasRef.current || !activeDraft) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const templateId = activeDraft.templateId || "royal_indigo";
    const titleText = activeDraft.title || "Untitled Masterpiece";
    const authorText = user?.name || "Unknown Author";

    // 1. Draw Background
    if (templateId === "royal_indigo") {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#1E293B");
      grad.addColorStop(0.5, "#0F172A");
      grad.addColorStop(1, "#030712");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Gold borders
      ctx.strokeStyle = "#C5A880";
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, w - 40, h - 40);
      ctx.strokeStyle = "rgba(197, 168, 128, 0.4)";
      ctx.lineWidth = 2;
      ctx.strokeRect(34, 34, w - 68, h - 68);
    } else if (templateId === "crimson_velvet") {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#7F1D1D");
      grad.addColorStop(0.6, "#450A0A");
      grad.addColorStop(1, "#180202");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Soft borders
      ctx.strokeStyle = "#FAF6F0";
      ctx.lineWidth = 4;
      ctx.strokeRect(25, 25, w - 50, h - 50);
      ctx.strokeStyle = "rgba(250, 246, 240, 0.25)";
      ctx.lineWidth = 1;
      ctx.strokeRect(33, 33, w - 66, h - 66);
    } else if (templateId === "forest_sage") {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#064E3B");
      grad.addColorStop(0.5, "#022C22");
      grad.addColorStop(1, "#011710");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "#C5A880";
      ctx.lineWidth = 6;
      ctx.strokeRect(22, 22, w - 44, h - 44);

      // Add solid corner accents
      ctx.fillStyle = "#C5A880";
      const cornerSize = 20;
      ctx.fillRect(22, 22, cornerSize, cornerSize);
      ctx.fillRect(w - 22 - cornerSize, 22, cornerSize, cornerSize);
      ctx.fillRect(22, h - 22 - cornerSize, cornerSize, cornerSize);
      ctx.fillRect(w - 22 - cornerSize, h - 22 - cornerSize, cornerSize, cornerSize);
    } else {
      // Vintage Parchment
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#FAF6F0");
      grad.addColorStop(1, "#ECE1CE");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Charcoal borders
      ctx.strokeStyle = "#3A3026";
      ctx.lineWidth = 10;
      ctx.strokeRect(20, 20, w - 40, h - 40);
      ctx.strokeStyle = "#3A3026";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(32, 32, w - 64, h - 64);
    }

    // 2. Draw Title Text
    let titleColor = "#FAF6F0";
    if (templateId === "royal_indigo") titleColor = "#E6C687";
    else if (templateId === "vintage_parchment") titleColor = "#3A3026";

    ctx.fillStyle = titleColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 38px Georgia, serif";

    const words = titleText.split(" ");
    const lines = [];
    const maxWidth = w - 120;
    const lineHeight = 55;
    let line = "";

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

    let startY = h / 2 - 120 - ((lines.length - 1) * lineHeight) / 2;
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i].trim(), w / 2, startY + i * lineHeight);
    }

    // 3. Draw Ornament Line
    let ornamentColor = "rgba(250, 246, 240, 0.3)";
    if (templateId === "royal_indigo") ornamentColor = "#C5A880";
    else if (templateId === "forest_sage") ornamentColor = "#C5A880";
    else if (templateId === "vintage_parchment") ornamentColor = "#8C4E35";

    ctx.strokeStyle = ornamentColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 80, h / 2 + 10);
    ctx.lineTo(w / 2 + 80, h / 2 + 10);
    ctx.stroke();

    // Small Diamond shape
    ctx.fillStyle = ornamentColor;
    ctx.beginPath();
    ctx.moveTo(w / 2, h / 2 + 5);
    ctx.lineTo(w / 2 + 5, h / 2 + 10);
    ctx.lineTo(w / 2, h / 2 + 15);
    ctx.lineTo(w / 2 - 5, h / 2 + 10);
    ctx.closePath();
    ctx.fill();

    // 4. Draw Author Name
    let authorColor = "rgba(250, 246, 240, 0.85)";
    if (templateId === "royal_indigo") authorColor = "#FAF6F0";
    else if (templateId === "vintage_parchment") authorColor = "#5C4E40";

    ctx.fillStyle = authorColor;
    ctx.font = "italic 22px Georgia, serif";
    ctx.fillText(`by ${authorText}`, w / 2, h / 2 + 80);

    // 5. Attributions: Published by Author Gallery
    let attributionColor = "rgba(250, 246, 240, 0.6)";
    if (templateId === "royal_indigo") attributionColor = "#C5A880";
    else if (templateId === "forest_sage") attributionColor = "#C5A880";
    else if (templateId === "vintage_parchment") attributionColor = "#8C4E35";

    ctx.fillStyle = attributionColor;
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("Published by Author Gallery", w / 2, h - 90);

    ctx.font = "normal 11px sans-serif";
    ctx.fillStyle = templateId === "vintage_parchment" ? "#8C7B6C" : "rgba(250, 246, 240, 0.35)";
    ctx.fillText("PREMIUM eBOOK EDITION", w / 2, h - 70);
  };

  // Re-draw cover whenever activeDraft details modify
  useEffect(() => {
    if (activeDraft) {
      drawCover();
    }
  }, [activeDraft, user]);

  // Scroll to top on mobile when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [mobileTab]);

  // Sync lastSaved time indicator when switching active draft
  useEffect(() => {
    if (activeDraft?.lastSaved) {
      setLastSaved(new Date(activeDraft.lastSaved));
    } else {
      setLastSaved(null);
    }
  }, [currentDraftId, activeDraft?.id, activeDraft?.lastSaved]);

  // Debounced auto-save status indicator (sets saving to false after pause)
  useEffect(() => {
    if (!saving) return;

    const saveTimer = setTimeout(() => {
      setSaving(false);
      setLastSaved(new Date());
    }, 1500);

    return () => clearTimeout(saveTimer);
  }, [
    saving,
    activeDraft?.title,
    activeDraft?.content,
    activeDraft?.description,
    activeDraft?.genre,
    activeDraft?.price,
    activeDraft?.publishDate,
    activeDraft?.templateId
  ]);

  // Update properties on active draft immediately and save to localStorage
  const handleUpdateActiveDraft = (field, val) => {
    setSaving(true);
    setDrafts(prevDrafts => {
      const updated = prevDrafts.map(d => {
        if (d.id === currentDraftId) {
          return { ...d, [field]: val, lastSaved: new Date().toISOString() };
        }
        return d;
      });
      localStorage.setItem("author_gallery_drafts", JSON.stringify(updated));
      return updated;
    });
  };

  // Append a new chapter header helper
  const handleInsertChapterHeader = () => {
    const content = activeDraft?.content || "";
    const matches = content.match(/(?:^|\n)(?:#\s*Chapter|##\s*Chapter|Chapter|CHAPTER|Ch\.)/gi);
    const nextChapterNum = matches ? matches.length + 1 : 1;
    
    const headerToAdd = content.trim().length > 0 
      ? `\n\nChapter ${nextChapterNum}: Title of Chapter ${nextChapterNum}\nWrite your chapter content here...\n\n`
      : `Chapter ${nextChapterNum}: Title of Chapter ${nextChapterNum}\nWrite your chapter content here...\n\n`;
      
    handleUpdateActiveDraft("content", content + headerToAdd);
  };

  // Add new draft
  const handleCreateNewDraft = () => {
    const newDraft = {
      id: "draft_" + Date.now(),
      title: "",
      content: "",
      description: "",
      genre: "",
      price: "0",
      publishDate: new Date().toISOString().split("T")[0],
      templateId: "royal_indigo",
      lastSaved: new Date().toISOString()
    };
    const updated = [newDraft, ...drafts];
    setDrafts(updated);
    setCurrentDraftId(newDraft.id);
    localStorage.setItem("author_gallery_drafts", JSON.stringify(updated));
    setMobileTab("editor");
    setMessage({ type: "success", text: "New blank draft created!" });
    setTimeout(() => setMessage(null), 3000);
  };

  // Delete draft
  const handleDeleteDraft = (id, e) => {
    e.stopPropagation();
    if (drafts.length <= 1) {
      showToast("You must keep at least one draft.", "error");
      return;
    }
    setConfirmModal({
      title: "Delete Draft permanently?",
      message: "Are you sure you want to delete this draft? This will permanently erase your local copy.",
      onConfirm: () => {
        const remaining = drafts.filter(d => d.id !== id);
        setDrafts(remaining);
        localStorage.setItem("author_gallery_drafts", JSON.stringify(remaining));
        if (currentDraftId === id) {
          setCurrentDraftId(remaining[0].id);
        }
        showToast("Draft deleted.", "success");
      }
    });
  };

  // Publish active draft
  const handlePublish = async (e) => {
    e.preventDefault();
    if (!activeDraft.title.trim()) {
      setMessage({ type: "error", text: "Please enter a title for your book." });
      return;
    }
    if (!activeDraft.content.trim()) {
      setMessage({ type: "error", text: "Please write some content in the editor." });
      return;
    }
    if (!activeDraft.genre) {
      setMessage({ type: "error", text: "Please select a genre." });
      return;
    }
    if (!activeDraft.description.trim()) {
      setMessage({ type: "error", text: "Please enter a synopsis/description." });
      return;
    }

    setPublishing(true);
    setMessage(null);

    try {
      // 1. Get cover image from Canvas
      const canvas = canvasRef.current;
      const base64Cover = canvas.toDataURL("image/jpeg", 0.95);

      // 2. Build Form Data
      const form = new FormData();
      form.append("title", activeDraft.title.trim());
      form.append("description", activeDraft.description.trim());
      form.append("genres", activeDraft.genre);
      form.append("price", activeDraft.price || "0");
      form.append("publishDate", activeDraft.publishDate);
      form.append("content", activeDraft.content);
      form.append("coverImageBase64", base64Cover);

      // 3. Post to API
      await apiClient.post("/api/books", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ type: "success", text: "Your eBook has been published to Author Gallery successfully! 🚀🎉" });

      // Clean up published draft
      const remaining = drafts.filter(d => d.id !== currentDraftId);
      if (remaining.length === 0) {
        const defaultDraft = {
          id: "draft_" + Date.now(),
          title: "",
          content: "",
          description: "",
          genre: "",
          price: "0",
          publishDate: new Date().toISOString().split("T")[0],
          templateId: "royal_indigo",
          lastSaved: new Date().toISOString()
        };
        setDrafts([defaultDraft]);
        setCurrentDraftId(defaultDraft.id);
        localStorage.setItem("author_gallery_drafts", JSON.stringify([defaultDraft]));
      } else {
        setDrafts(remaining);
        setCurrentDraftId(remaining[0].id);
        localStorage.setItem("author_gallery_drafts", JSON.stringify(remaining));
      }

      setTimeout(() => {
        setMessage(null);
        navigate("/author-dashboard");
      }, 3000);

    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || err.message || "Failed to publish book.",
      });
    } finally {
      setPublishing(false);
    }
  };

  const wordCount = activeDraft?.content ? activeDraft.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const lastSavedTime = lastSaved ? lastSaved.toLocaleTimeString() : "";
  const editorStyle = TEMPLATE_STYLES[activeDraft?.templateId || "royal_indigo"] || TEMPLATE_STYLES.royal_indigo;

  return (
    <div className="min-h-screen bg-slate-300 pb-12 transition-all">
      
      {/* Header Panel */}
      <div className="bg-slate-50 border-b border-slate-300 relative z-10 shadow-sm py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link 
              to="/author-dashboard" 
              className="p-2 hover:bg-slate-200 text-slate-700 hover:text-amber-800 rounded-xl border border-slate-300 transition-colors shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="text-left">
              <h1 className="text-lg sm:text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                <PenTool size={18} className="text-amber-800" />
                Book Writing Notepad
              </h1>
              <p className="text-xs text-slate-700 font-semibold">Create your eBook with canvas template covers and download as a formatted PDF.</p>
            </div>
          </div>

          {/* Draft status info */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            {saving ? (
              <span className="flex items-center gap-1.5 text-amber-800 bg-[#FAF1E6] px-3 py-1 rounded-full text-xs font-bold transition-all border border-slate-300/40">
                <RefreshCw size={13} className="animate-spin" />
                Auto-saving...
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1.5 text-emerald-800 bg-[#E8F3EE] px-3 py-1 rounded-full text-xs font-bold transition-all border border-slate-300/40">
                <CheckCircle size={13} />
                Draft saved {lastSavedTime && `at ${lastSavedTime}`}
              </span>
            ) : (
              <span className="text-slate-700 bg-slate-100 border border-slate-300 px-3 py-1 rounded-full text-xs font-bold">
                Saves to browser storage
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Selector on Mobile */}
      <div className="md:hidden bg-slate-50 border-b border-slate-300 px-4 py-2 relative z-20 flex justify-between gap-1 shadow-sm">
        <button
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mobileTab === "editor" ? "bg-amber-800 text-[#FAF6F0]" : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          📝 Notepad
        </button>
        <button
          onClick={() => setMobileTab("templates")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mobileTab === "templates" ? "bg-amber-800 text-[#FAF6F0]" : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          🎨 Cover & Details
        </button>
        <button
          onClick={() => setMobileTab("drafts")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all relative cursor-pointer ${
            mobileTab === "drafts" ? "bg-amber-800 text-[#FAF6F0]" : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          📂 Drafts ({drafts.length})
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        {activeDraft ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Column (col-span-4 on tablet, col-span-3 on desktop): Drafts & Cover Customization */}
            <div className={`md:col-span-4 lg:col-span-3 space-y-6 ${mobileTab === "drafts" || mobileTab === "templates" ? "block" : "hidden md:block"}`}>
              {/* Drafts List Card */}
              <div className={`bg-slate-50 border border-slate-300 rounded-2xl p-4 shadow-sm text-left ${mobileTab === "drafts" ? "block" : "hidden md:block"}`}>
                <div className="flex justify-between items-center border-b border-slate-300 pb-2 mb-3">
                  <h3 className="font-bold font-serif text-slate-900 text-sm flex items-center gap-1.5">
                    <FileText size={16} className="text-amber-800" />
                    Saved Drafts ({drafts.length})
                  </h3>
                  <button 
                    onClick={handleCreateNewDraft}
                    className="p-1 hover:bg-slate-200 text-amber-800 hover:text-amber-900 rounded-lg border border-slate-300 cursor-pointer transition-colors"
                    title="Create New Draft"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {drafts.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        setCurrentDraftId(d.id);
                        setMobileTab("editor");
                      }}
                      className={`group p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                        d.id === currentDraftId 
                          ? "bg-[#FAF1E6] border-amber-300/40 shadow-sm" 
                          : "border-slate-300/60 bg-white hover:bg-slate-100"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className={`text-xs font-bold truncate ${d.id === currentDraftId ? "text-amber-955" : "text-slate-800"}`}>
                          {d.title.trim() || "Untitled Draft"}
                        </p>
                        <p className="text-[10px] text-slate-750 mt-0.5 font-semibold">
                          {new Date(d.lastSaved).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteDraft(d.id, e)}
                        className="p-1 text-slate-500 hover:text-red-650 rounded hover:bg-red-50/50 transition-colors cursor-pointer"
                        title="Delete Draft"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cover Selection Canvas */}
              <div className={`bg-slate-50 border border-slate-300 rounded-2xl p-4 shadow-sm text-left flex flex-col items-center ${mobileTab === "templates" ? "block" : "hidden md:block"}`}>
                <h3 className="font-bold font-serif text-slate-900 text-sm border-b border-slate-300 pb-2 mb-4 w-full flex items-center gap-1.5">
                  <Layout size={16} className="text-amber-800" />
                  Live Cover Preview
                </h3>
                
                {/* Live Canvas Cover */}
                <div className="relative border border-slate-300 bg-white rounded-xl overflow-hidden shadow-md max-w-[210px] w-full aspect-[6/8.5]">
                  <canvas 
                    ref={canvasRef} 
                    width={420} 
                    height={595} 
                    className="w-full h-full block object-contain"
                  />
                </div>
                <p className="text-[10px] text-slate-700 mt-2.5 text-center leading-relaxed font-semibold">
                  Interactive template rendering. Features branding stamp "Published by Author Gallery" on the cover page.
                </p>
              </div>

              {/* Cover Templates Selector */}
              <div className={`bg-slate-50 border border-slate-300 rounded-2xl p-4 shadow-sm text-left ${mobileTab === "templates" ? "block" : "hidden md:block"}`}>
                <h3 className="font-bold font-serif text-slate-900 text-sm border-b border-slate-300 pb-2 mb-3">
                  Cover Templates
                </h3>
                <div className="space-y-2">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleUpdateActiveDraft("templateId", t.id)}
                      className={`w-full p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col ${
                        activeDraft.templateId === t.id 
                          ? "bg-amber-800 border-amber-800 text-white shadow-md shadow-amber-850/15" 
                          : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-xs font-bold">{t.name}</span>
                      <span className={`text-[10px] mt-0.5 leading-normal ${activeDraft.templateId === t.id ? "text-amber-100/85" : "text-slate-700"}`}>
                        {t.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column (col-span-8 on tablet, col-span-6 on desktop): Notepad Editor */}
            <div className={`md:col-span-8 lg:col-span-6 space-y-4 flex flex-col ${mobileTab === "editor" ? "block" : "hidden md:block"}`}>
              <div className={`rounded-2xl p-5 sm:p-6 text-left flex flex-col space-y-4 transition-all ${editorStyle.container}`}>
                
                {/* Title */}
                <input
                  type="text"
                  value={activeDraft.title}
                  onChange={(e) => handleUpdateActiveDraft("title", e.target.value)}
                  placeholder="Draft Book Title..."
                  className={`w-full text-lg sm:text-2xl font-bold bg-transparent border-b pb-2.5 outline-none transition-colors ${editorStyle.title}`}
                  required
                />

                {/* Editor Utilities / Toolbar */}
                <div className="flex items-center justify-between pb-1 border-b border-dashed border-slate-200/40">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-60">Notepad Desk</span>
                  <button
                    type="button"
                    onClick={handleInsertChapterHeader}
                    className="px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98]"
                    title="Insert a new Chapter header at the end of the text"
                  >
                    <span>📖 Add Chapter Header</span>
                  </button>
                </div>

                {/* Content Editor */}
                <textarea
                  value={activeDraft.content}
                  onChange={(e) => handleUpdateActiveDraft("content", e.target.value)}
                  placeholder="Begin drafting your work directly here. Use the 'Chapter X: Title' format to split your book into chapters for the reader..."
                  className={`w-full min-h-[460px] p-4 rounded-xl outline-none text-sm sm:text-base leading-relaxed transition-all resize-none ${editorStyle.textarea}`}
                  required
                />

                {/* Counts and stats footer */}
                <div className={`flex justify-between items-center text-xs font-bold pt-2 ${editorStyle.footer}`}>
                  <span className="flex items-center gap-1">
                    <FileText size={15} />
                    Words: <span className={editorStyle.footerCount}>{wordCount}</span>
                  </span>
                  <span>
                    Characters: <span className={editorStyle.footerCount}>{activeDraft.content ? activeDraft.content.length : 0}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column (col-span-12 on tablet, col-span-3 on desktop): Publishing Details */}
            <div className={`md:col-span-12 lg:col-span-3 space-y-6 ${mobileTab === "templates" ? "block" : "hidden md:block"}`}>
              {/* Publishing Panel */}
              <div className="bg-slate-50 border border-slate-300 rounded-2xl p-5 shadow-sm text-left space-y-4">
                <h3 className="font-bold font-serif text-slate-900 text-sm border-b border-slate-300 pb-2 flex items-center gap-1">
                  <Sparkles size={15} className="text-amber-800" />
                  Publish Details
                </h3>

                <form onSubmit={handlePublish} className="space-y-4 text-xs font-semibold">
                  
                  {/* Genre */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Genre *</label>
                    <select
                      value={activeDraft.genre}
                      onChange={(e) => handleUpdateActiveDraft("genre", e.target.value)}
                      required
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 focus:bg-white focus:ring-4 focus:ring-amber-250/30 focus:border-amber-700 rounded-lg text-slate-900 outline-none transition-all text-xs font-normal"
                    >
                      <option value="">Select Genre</option>
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
                    <label className="block text-xs font-bold text-slate-800 mb-1">eBook Price (₹) *</label>
                    <input
                      type="number"
                      value={activeDraft.price}
                      onChange={(e) => handleUpdateActiveDraft("price", e.target.value)}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      required
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 focus:bg-white focus:ring-4 focus:ring-amber-255/30 focus:border-amber-700 rounded-lg text-slate-900 outline-none transition-all font-normal"
                    />
                  </div>

                  {/* Publish Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Publish Date *</label>
                    <input
                      type="date"
                      value={activeDraft.publishDate}
                      onChange={(e) => handleUpdateActiveDraft("publishDate", e.target.value)}
                      required
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 focus:bg-white focus:ring-4 focus:ring-amber-255/30 focus:border-amber-700 rounded-lg text-slate-500 focus:text-slate-900 outline-none transition-all font-normal"
                    />
                  </div>

                  {/* Synopsis */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Book Synopsis *</label>
                    <textarea
                      value={activeDraft.description}
                      onChange={(e) => handleUpdateActiveDraft("description", e.target.value)}
                      placeholder="Describe your book structure, plot, or key takeaways..."
                      rows={3}
                      required
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 focus:bg-white focus:ring-4 focus:ring-amber-255/30 focus:border-amber-700 rounded-lg text-slate-900 outline-none transition-all font-normal resize-none leading-relaxed"
                    />
                  </div>

                  {/* Alert messages */}
                  {message && (
                    <div className={`p-3 rounded-lg text-[11px] font-bold flex items-start gap-2 border leading-relaxed ${
                      message.type === "success" 
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                        : "bg-red-50 text-red-800 border border-red-100"
                    }`}>
                      <Info size={14} className="shrink-0 mt-0.5 text-amber-900" />
                      <span>{message.text}</span>
                    </div>
                  )}

                  {/* Action Publish Buttons */}
                  <button
                    type="submit"
                    disabled={publishing}
                    className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-sm shadow-md hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                  >
                    {publishing ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        Publish eBook
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-300 rounded-2xl shadow-sm text-center max-w-lg mx-auto">
            <RefreshCw size={40} className="animate-spin text-amber-800 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Loading your draft notepad...</h3>
          </div>
        )}
      </div>

      {/* Toast notifications */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[200000] max-w-sm animate-fade-in">
          <div className={`p-4 rounded-2xl shadow-xl flex items-start gap-3 border ${
            toast.type === "success" 
              ? "bg-emerald-50 text-emerald-900 border-emerald-200" 
              : "bg-red-50 text-red-950 border-red-200"
          }`}>
            <Info size={18} className={`shrink-0 mt-0.5 ${toast.type === "success" ? "text-emerald-700" : "text-red-750"}`} />
            <div>
              <p className="text-xs font-bold leading-normal">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[200000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200/50 rounded-3xl w-full max-w-sm p-6 relative shadow-2xl text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <AlertTriangle size={18} className="text-red-650" />
                <h4 className="font-bold text-sm text-slate-900">{confirmModal.title}</h4>
              </div>
              <p className="text-xs text-slate-750 leading-relaxed font-sans font-medium">
                {confirmModal.message}
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmModal.onConfirm();
                    setConfirmModal(null);
                  }}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default WriteBook;
