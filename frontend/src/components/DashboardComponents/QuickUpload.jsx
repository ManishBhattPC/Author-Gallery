import React, { useState } from "react";
import apiClient from "../../services/apiClient.js";
import { UploadCloud, FileImage, FileText, CheckCircle2, AlertCircle } from "lucide-react";

const QuickUpload = ({ draftContent, onPublished }) => {
  const [formData, setFormData] = useState({
    title: draftContent?.title || "",
    description: draftContent?.content || "",
    genres: "",
    price: "",
    publishDate: "",
  });

  const [files, setFiles] = useState({
    coverImage: null,
    pdfFile: null,
  });

  const [fileNames, setFileNames] = useState({
    cover: "",
    pdf: "",
  });

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  // Sync draftContent updates with the upload form data
  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      title: draftContent?.title || prev.title,
      description: draftContent?.content || prev.description,
    }));
  }, [draftContent]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files?.[0];

    if (file) {
      setFiles({ ...files, [name]: file });
      setFileNames({
        ...fileNames,
        [name === "coverImage" ? "cover" : "pdf"]: file.name,
      });
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage(null);

    try {
      if (!formData.title || !formData.genres || !formData.price || !formData.publishDate) {
        setMessage({ text: "Please fill all required fields", type: "error" });
        setUploading(false);
        return;
      }

      if (!formData.description) {
        setMessage({ text: "Please write the book description/content in the editor on the left", type: "error" });
        setUploading(false);
        return;
      }

      if (!files.coverImage || !files.pdfFile) {
        setMessage({ text: "Please upload both cover image and PDF file", type: "error" });
        setUploading(false);
        return;
      }

      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("genres", formData.genres);
      form.append("price", formData.price);
      form.append("publishDate", formData.publishDate);
      form.append("coverImage", files.coverImage);
      form.append("pdfFile", files.pdfFile);

      await apiClient.post("/api/books", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ text: "Book published successfully! 🎉", type: "success" });
      
      // Clear form
      setFormData({ title: "", description: "", genres: "", price: "", publishDate: "" });
      setFiles({ coverImage: null, pdfFile: null });
      setFileNames({ cover: "", pdf: "" });
      localStorage.removeItem("draft");

      if (onPublished) {
        onPublished();
      }

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to publish book",
        type: "error"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-8 shadow-sm">
      <h3 className="text-xl font-bold text-slate-800 mb-1">Quick Publish</h3>
      <p className="text-slate-500 text-xs mb-6">Fill in details and upload files to publish instantly.</p>

      <form onSubmit={handlePublish} className="space-y-4">
        
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Book Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Whispers of the Wind"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-50/50 focus:border-amber-600 rounded-xl text-slate-800 outline-none text-sm transition-all placeholder-slate-400"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Genre */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Genre *</label>
            <select
              name="genres"
              value={formData.genres}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-50/50 focus:border-amber-600 rounded-xl text-slate-800 outline-none text-sm transition-all"
              required
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
            <label className="block text-xs font-semibold text-slate-600 mb-1">Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-50/50 focus:border-amber-600 rounded-xl text-slate-800 outline-none text-sm transition-all placeholder-slate-400"
              required
            />
          </div>
        </div>

        {/* Publish Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Publish Date *</label>
          <input
            type="date"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-50/50 focus:border-amber-600 rounded-xl text-slate-800 outline-none text-sm transition-all text-slate-500 focus:text-slate-800"
            required
          />
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Cover Image *</label>
          <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-200 hover:border-amber-600/50 bg-slate-50/50 hover:bg-amber-50/10 rounded-xl cursor-pointer transition-all duration-300">
            <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
            <span className="text-xs text-slate-600 font-semibold">Upload cover photo</span>
            <input
              type="file"
              name="coverImage"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              required
            />
          </label>
          {fileNames.cover && (
            <p className="text-[11px] text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
              <FileImage className="w-3.5 h-3.5" />
              {fileNames.cover}
            </p>
          )}
        </div>

        {/* PDF Upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">PDF Document *</label>
          <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-200 hover:border-amber-600/50 bg-slate-50/50 hover:bg-amber-50/10 rounded-xl cursor-pointer transition-all duration-300">
            <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
            <span className="text-xs text-slate-600 font-semibold">Upload PDF ebook</span>
            <input
              type="file"
              name="pdfFile"
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
              required
            />
          </label>
          {fileNames.pdf && (
            <p className="text-[11px] text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {fileNames.pdf}
            </p>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" : "bg-red-50 text-red-800 border border-red-100"
          }`}>
            {message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Publish Button */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold text-sm transition-all focus:ring-4 focus:ring-amber-100 disabled:opacity-50 flex items-center justify-center gap-2 mt-4 cursor-pointer"
        >
          {uploading ? "Publishing…" : "Publish Now"}
        </button>
      </form>
    </div>
  );
};

export default QuickUpload;





// import React, { useState } from "react";
// import { createBook } from "../../services/bookService";

// const QuickUpload = () => {
//   const [fileName, setFileName] = useState("");

//   const handleFileChange = (event) => {
//     setFileName(event.target.files?.[0]?.name || "");
//   };

//   const handleUpload = async () => {
//     // API CALL: Connects to backend endpoint (POST /api/uploads)
//     // send file payload with multipart/form-data to the backend
//     createBook()
//   };

//   return (
//     <div className="rounded-3xl bg-white p-6 shadow-sm">
//       <div>
//         <h2 className="text-xl font-semibold text-slate-900">Quick Upload</h2>
//         <p className="mt-2 text-sm text-slate-500">Upload cover images, drafts, or author assets instantly.</p>
//       </div>

//       <div className="mt-6 space-y-4">
//         <label className="block rounded-3xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
//           <span className="block text-sm font-medium">Select file</span>
//           <input type="file" onChange={handleFileChange} className="mt-3 w-full text-sm text-slate-700" />
//         </label>

//         {fileName && <p className="text-sm text-slate-600">Selected file: {fileName}</p>}

//         <button
//           type="button"
//           onClick={handleUpload}
//           className="w-full rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-800"
//         >
//           Upload Files
//         </button>
//       </div>
//     </div>
//   );
// };

// export default QuickUpload;