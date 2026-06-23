import React, { useState, useEffect } from "react";
import { PenTool, Trash2, Save, FileText, CheckCircle, RefreshCw } from "lucide-react";

const CreateWork = ({ onContentUpdate }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);

  // Count words
  useEffect(() => {
    const words = content.trim().split(/\s+/).length;
    setWordCount(content.trim() === "" ? 0 : words);
  }, [content]);

  // Auto-save draft to localStorage
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

  // Notify parent component of content
  useEffect(() => {
    if (onContentUpdate) {
      onContentUpdate({ title, content });
    }
  }, [title, content, onContentUpdate]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("draft");
    if (draft) {
      const { title: draftTitle, content: draftContent } = JSON.parse(draft);
      setTitle(draftTitle);
      setContent(draftContent);
    }
  }, []);

  const handleClearDraft = () => {
    if (window.confirm("Delete draft permanently?")) {
      localStorage.removeItem("draft");
      setTitle("");
      setContent("");
      setLastSaved(null);
    }
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-amber-700" />
            Create New Work
          </h2>
          <p className="text-slate-500 text-xs mt-1">Draft your next book, story, or article here.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          {saving ? (
            <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Saving...
            </span>
          ) : lastSaved ? (
            <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckCircle className="w-3.5 h-3.5" />
              Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          ) : (
            <span className="bg-slate-50 px-2.5 py-1 rounded-full">Auto-saves to browser</span>
          )}
        </div>
      </div>

      {/* Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled Masterpiece..."
        className="w-full text-xl font-bold text-slate-800 bg-transparent border-b border-slate-100 focus:border-amber-600 pb-3 mb-4 outline-none placeholder-slate-300 transition-colors"
      />

      {/* Rich Text Toolbar */}
      <div className="flex flex-wrap items-center gap-1 mb-4 pb-3 border-b border-slate-100 text-slate-400 text-sm">
        <button type="button" className="p-1.5 hover:bg-slate-50 hover:text-slate-800 rounded font-bold transition-colors w-8 h-8 flex items-center justify-center">B</button>
        <button type="button" className="p-1.5 hover:bg-slate-50 hover:text-slate-800 rounded italic transition-colors w-8 h-8 flex items-center justify-center">I</button>
        <button type="button" className="p-1.5 hover:bg-slate-50 hover:text-slate-800 rounded underline transition-colors w-8 h-8 flex items-center justify-center">U</button>
        <div className="w-px h-6 bg-slate-200 mx-2"></div>
        <button type="button" className="p-1.5 hover:bg-slate-50 hover:text-slate-800 rounded transition-colors w-8 h-8 flex items-center justify-center">≡</button>
        <button type="button" className="p-1.5 hover:bg-slate-50 hover:text-slate-800 rounded transition-colors w-8 h-8 flex items-center justify-center">⊙</button>
      </div>

      {/* Content Editor */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your story, poem, or article content here. Your changes will automatically save locally..."
        className="w-full min-h-[300px] flex-grow p-4 bg-slate-50/50 border border-slate-200/50 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-50/50 focus:bg-white transition-all resize-none text-sm leading-relaxed"
      />

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4 text-xs font-semibold text-slate-500">
        <span className="flex items-center gap-1">
          <FileText className="w-4 h-4 text-slate-400" />
          Word Count: <span className="text-slate-800">{wordCount}</span>
        </span>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleClearDraft}
            className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            <Save className="w-4 h-4" />
            Keep Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWork;



// import React, { useState } from "react";

// import apiClient from "../../services/apiClient.js";

// const CreateWork = () => {
//   // Form state
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [genres, setGenres] = useState("");
//   const [price, setPrice] = useState("");
//   const [publishDate, setPublishDate] = useState("");

//   // File state
//   const [fileName, setFileName] = useState("");
//   const [files, setFiles] = useState({
//     coverImage: null,
//     pdfFile: null,
//   });
//   const [fileNames, setFileNames] = useState({
//     cover: "",
//     pdf: "",
//   });

//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState(null);

//   // Handle form input change
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "title") setTitle(value);
//     else if (name === "content") setContent(value);
//     else if (name === "genres") setGenres(value);
//     else if (name === "price") setPrice(value);
//     else if (name === "publishDate") setPublishDate(value);
//   };

//   // Handle QuickUpload file change
//   const handleQuickFileChange = (event) => {
//     setFileName(event.target.files?.[0]?.name || "");
//   };

//   // Handle detailed file uploads
//   const handleDetailedFileChange = (e) => {
//     const { name } = e.target;
//     const file = e.target.files?.[0];

//     if (file) {
//       setFiles({ ...files, [name]: file });
//       setFileNames({
//         ...fileNames,
//         [name === "coverImage" ? "cover" : "pdf"]: file.name,
//       });
//     }
//   };

//   // Handle publish
//   const handlePublish = async (event) => {
//     event.preventDefault();
//     setSaving(true);
//     setMessage(null);

//     try {
//       // Validation
//       if (!title || !content || !genres || !price || !publishDate) {
//         setMessage("Please fill all required fields");
//         setSaving(false);
//         return;
//       }

//       if (!files.coverImage || !files.pdfFile) {
//         setMessage("Please upload both cover image and PDF file");
//         setSaving(false);
//         return;
//       }

//       // Create FormData
//       const form = new FormData();
//       form.append("title", title);
//       form.append("description", content);
//       form.append("genres", genres);
//       form.append("price", price);
//       form.append("publishDate", publishDate);
//       form.append("coverImage", files.coverImage);
//       form.append("pdfFile", files.pdfFile);

//       // Send to backend
//       await apiClient.post("/api/books", form, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setMessage("Book published successfully! 🎉");

//       // Clear form
//       setTitle("");
//       setContent("");
//       setGenres("");
//       setPrice("");
//       setPublishDate("");
//       setFileName("");
//       setFiles({ coverImage: null, pdfFile: null });
//       setFileNames({ cover: "", pdf: "" });
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Unable to publish. Please try again.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <form className="space-y-5 rounded-3xl bg-white p-6 shadow-sm" onSubmit={handlePublish}>
      
//       {/* CREATE WORK SECTION */}
//       <div>
//         <h2 className="text-xl font-semibold text-slate-900">Create New Work</h2>
//         <p className="mt-1 text-sm text-slate-500">Draft your next book, story, or article here.</p>
//       </div>

//       <div className="space-y-3">
//         <label className="block text-sm font-medium text-slate-700">Title</label>
//         <input
//           type="text"
//           name="title"
//           value={title}
//           onChange={handleInputChange}
//           placeholder="Enter your title"
//           className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
//           required
//         />
//       </div>

//       <div className="space-y-3">
//         <label className="block text-sm font-medium text-slate-700">Content</label>
//         <textarea
//           rows="8"
//           name="content"
//           value={content}
//           onChange={handleInputChange}
//           placeholder="Start writing..."
//           className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
//           required
//         />
//       </div>

//       {/* NEW FIELDS FOR BOOK CREATION */}
//       <div className="space-y-3">
//         <label className="block text-sm font-medium text-slate-700">Genre</label>
//         <select
//           name="genres"
//           value={genres}
//           onChange={handleInputChange}
//           className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
//           required
//         >
//           <option value="">Select a genre</option>
//           <option value="Education">Education</option>
//           <option value="Fiction">Fiction</option>
//           <option value="Non-Fiction">Non-Fiction</option>
//           <option value="Romance">Romance</option>
//           <option value="Thriller">Thriller</option>
//           <option value="Mystery">Mystery</option>
//           <option value="Fantasy">Fantasy</option>
//           <option value="Science Fiction">Science Fiction</option>
//           <option value="Biography">Biography</option>
//           <option value="History">History</option>
//           <option value="Poetry">Poetry</option>
//           <option value="Self-Help">Self-Help</option>
//         </select>
//       </div>

//       <div className="space-y-3">
//         <label className="block text-sm font-medium text-slate-700">Price</label>
//         <input
//           type="number"
//           name="price"
//           value={price}
//           onChange={handleInputChange}
//           placeholder="Enter price"
//           min="0"
//           step="0.01"
//           className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
//           required
//         />
//       </div>

//       <div className="space-y-3">
//         <label className="block text-sm font-medium text-slate-700">Publish Date</label>
//         <input
//           type="date"
//           name="publishDate"
//           value={publishDate}
//           onChange={handleInputChange}
//           className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
//           required
//         />
//       </div>

//       {/* QUICK UPLOAD SECTION */}
//       <div className="border-t pt-6">
//         <div>
//           <h2 className="text-xl font-semibold text-slate-900">Quick Upload</h2>
//           <p className="mt-2 text-sm text-slate-500">Upload cover images and PDF files instantly.</p>
//         </div>

//         <div className="mt-6 space-y-4">
//           {/* Cover Image Upload */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image</label>
//             <label className="block rounded-3xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-700 cursor-pointer hover:bg-slate-100 transition">
//               <span className="block text-sm font-medium">Select file</span>
//               <input
//                 type="file"
//                 name="coverImage"
//                 onChange={handleDetailedFileChange}
//                 accept="image/*"
//                 className="mt-3 w-full text-sm text-slate-700"
//                 required
//               />
//             </label>
//             {fileNames.cover && <p className="text-xs text-green-600 mt-2">✓ {fileNames.cover}</p>}
//           </div>

//           {/* PDF Upload */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">PDF File</label>
//             <label className="block rounded-3xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-700 cursor-pointer hover:bg-slate-100 transition">
//               <span className="block text-sm font-medium">Select file</span>
//               <input
//                 type="file"
//                 name="pdfFile"
//                 onChange={handleDetailedFileChange}
//                 accept=".pdf"
//                 className="mt-3 w-full text-sm text-slate-700"
//                 required
//               />
//             </label>
//             {fileNames.pdf && <p className="text-xs text-green-600 mt-2">✓ {fileNames.pdf}</p>}
//           </div>
//         </div>
//       </div>

//       {/* MESSAGE */}
//       {message && (
//         <div className={`rounded-lg px-4 py-3 text-sm ${message.includes("successfully") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
//           {message}
//         </div>
//       )}

//       {/* BUTTONS */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
//         <button
//           type="reset"
//           className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
//         >
//           Save Draft
//         </button>
//         <button
//           type="submit"
//           disabled={saving}
//           className="rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-800 disabled:opacity-70"
//         >
//           {saving ? "Publishing…" : "Publish"}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default CreateWork;