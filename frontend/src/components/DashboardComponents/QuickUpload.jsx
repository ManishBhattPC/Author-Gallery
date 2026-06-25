import React, { useState } from "react";
import apiClient from "../../services/apiClient.js";
import { UploadCloud, FileImage, FileText, CheckCircle2, AlertCircle } from "lucide-react";

const QuickUpload = ({ onPublished }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genres: "",
    price: "",
    publishDate: new Date().toISOString().split("T")[0],
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
      if (!formData.title || !formData.genres || !formData.price || !formData.publishDate || !formData.description) {
        setMessage({ text: "Please fill all required fields", type: "error" });
        setUploading(false);
        return;
      }

      if (!files.coverImage || !files.pdfFile) {
        setMessage({ text: "Please upload both cover image and PDF file", type: "error" });
        setUploading(false);
        return;
      }

      const form = new FormData();
      form.append("title", formData.title.trim());
      form.append("description", formData.description.trim());
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
      setFormData({ title: "", description: "", genres: "", price: "", publishDate: new Date().toISOString().split("T")[0] });
      setFiles({ coverImage: null, pdfFile: null });
      setFileNames({ cover: "", pdf: "" });

      if (onPublished) {
        onPublished();
      }

      setTimeout(() => setMessage(null), 4000);
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
    <div className="bg-[#FDFCF7] border border-[#EADCC9] rounded-2xl p-6 sm:p-8 shadow-sm text-left">
      <h3 className="text-xl font-bold font-serif text-[#2C1E11] mb-1">Quick Publish</h3>
      <p className="text-[#8C7B6C] text-xs mb-6 font-medium">Fill in details and upload files to publish instantly.</p>

      <form onSubmit={handlePublish} className="space-y-4">
        
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-[#5C4E40] mb-1">Book Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Whispers of the Wind"
            className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#EADCC9] focus:bg-[#FCFBF7] focus:ring-4 focus:ring-amber-100/30 focus:border-amber-750 rounded-xl text-[#2C1E11] outline-none text-sm transition-all placeholder-slate-350 font-normal"
            required
          />
        </div>

        {/* Synopsis / Description */}
        <div>
          <label className="block text-xs font-bold text-[#5C4E40] mb-1">Synopsis / Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide a brief synopsis of your book..."
            rows={3}
            className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#EADCC9] focus:bg-[#FCFBF7] focus:ring-4 focus:ring-amber-100/30 focus:border-amber-750 rounded-xl text-[#2C1E11] outline-none text-sm transition-all placeholder-slate-350 font-normal resize-none leading-relaxed"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Genre */}
          <div>
            <label className="block text-xs font-bold text-[#5C4E40] mb-1">Genre *</label>
            <select
              name="genres"
              value={formData.genres}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#EADCC9] focus:bg-[#FCFBF7] focus:ring-4 focus:ring-amber-100/30 focus:border-amber-750 rounded-xl text-[#2C1E11] outline-none text-sm transition-all font-normal text-xs"
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
            <label className="block text-xs font-bold text-[#5C4E40] mb-1">Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#EADCC9] focus:bg-[#FCFBF7] focus:ring-4 focus:ring-amber-100/30 focus:border-amber-750 rounded-xl text-[#2C1E11] outline-none text-sm transition-all placeholder-slate-350 font-normal"
              required
            />
          </div>
        </div>

        {/* Publish Date */}
        <div>
          <label className="block text-xs font-bold text-[#5C4E40] mb-1">Publish Date *</label>
          <input
            type="date"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#EADCC9] focus:bg-[#FCFBF7] focus:ring-4 focus:ring-amber-100/30 focus:border-amber-750 rounded-xl text-slate-500 focus:text-[#2C1E11] outline-none text-sm transition-all font-normal"
            required
          />
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block text-xs font-bold text-[#5C4E40] mb-2">Cover Image *</label>
          <label className="flex flex-col items-center justify-center p-4 border border-dashed border-[#EADCC9] hover:border-amber-700/50 bg-[#FAF6F0] hover:bg-[#F3EAD8]/30 rounded-xl cursor-pointer transition-all duration-300">
            <UploadCloud className="w-6 h-6 text-amber-700 mb-1" />
            <span className="text-xs text-[#5C4E40] font-bold">Upload cover photo</span>
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
            <p className="text-[11px] text-emerald-700 font-bold mt-1.5 flex items-center gap-1">
              <FileImage className="w-3.5 h-3.5" />
              {fileNames.cover}
            </p>
          )}
        </div>

        {/* PDF Upload */}
        <div>
          <label className="block text-xs font-bold text-[#5C4E40] mb-2">PDF Document *</label>
          <label className="flex flex-col items-center justify-center p-4 border border-dashed border-[#EADCC9] hover:border-amber-700/50 bg-[#FAF6F0] hover:bg-[#F3EAD8]/30 rounded-xl cursor-pointer transition-all duration-300">
            <UploadCloud className="w-6 h-6 text-amber-700 mb-1" />
            <span className="text-xs text-[#5C4E40] font-bold">Upload PDF ebook</span>
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
            <p className="text-[11px] text-emerald-700 font-bold mt-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {fileNames.pdf}
            </p>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
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
          className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-md"
        >
          {uploading ? "Publishing…" : "Publish Now"}
        </button>
      </form>
    </div>
  );
};

export default QuickUpload;