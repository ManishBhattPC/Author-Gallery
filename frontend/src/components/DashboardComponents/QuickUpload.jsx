import React, { useState, useRef } from "react";
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
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files?.[0];

    if (file) {
      if (name === "coverImage") {
        const reader = new FileReader();
        reader.onload = () => {
          setImageSrc(reader.result);
          setCropModalOpen(true);
        };
        reader.readAsDataURL(file);
      } else {
        setFiles({ ...files, [name]: file });
        setFileNames({
          ...fileNames,
          pdf: file.name,
        });
      }
      e.target.value = "";
    }
  };

  const handleCropComplete = (croppedFile) => {
    setFiles((prev) => ({ ...prev, coverImage: croppedFile }));
    setFileNames((prev) => ({ ...prev, cover: croppedFile.name || "cropped-cover.jpg" }));
    setCropModalOpen(false);
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
  };  return (
    <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-sm text-left">
      <h3 className="text-xl font-bold font-serif text-slate-900 mb-1">Quick Publish</h3>
      <p className="text-slate-700 text-xs mb-6 font-medium">Fill in details and upload files to publish instantly.</p>

      <form onSubmit={handlePublish} className="space-y-4">
        
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">Book Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Whispers of the Wind"
            className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:bg-white focus:ring-4 focus:ring-amber-100/30 focus:border-amber-700 rounded-xl text-slate-900 outline-none text-sm transition-all placeholder-slate-400 font-normal"
            required
          />
        </div>

        {/* Synopsis / Description */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">Synopsis / Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide a brief synopsis of your book..."
            rows={3}
            className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:bg-white focus:ring-4 focus:ring-amber-100/30 focus:border-amber-700 rounded-xl text-slate-900 outline-none text-sm transition-all placeholder-slate-400 font-normal resize-none leading-relaxed"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Genre */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Genre *</label>
            <select
              name="genres"
              value={formData.genres}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 focus:bg-white focus:ring-4 focus:ring-amber-100/30 focus:border-amber-700 rounded-xl text-slate-900 outline-none text-sm transition-all font-normal text-xs"
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
            <label className="block text-xs font-bold text-slate-800 mb-1">Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:bg-white focus:ring-4 focus:ring-amber-100/30 focus:border-amber-700 rounded-xl text-slate-900 outline-none text-sm transition-all placeholder-slate-400 font-normal"
              required
            />
          </div>
        </div>

        {/* Publish Date */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">Publish Date *</label>
          <input
            type="date"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:bg-white focus:ring-4 focus:ring-amber-100/30 focus:border-amber-700 rounded-xl text-slate-500 focus:text-slate-900 outline-none text-sm transition-all font-normal"
            required
          />
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">Cover Image *</label>
          <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-300 hover:border-amber-700/50 bg-white hover:bg-slate-100/20 rounded-xl cursor-pointer transition-all duration-300">
            <UploadCloud className="w-6 h-6 text-amber-700 mb-1" />
            <span className="text-xs text-slate-850 font-bold">Upload cover photo</span>
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
          <label className="block text-xs font-bold text-slate-800 mb-2">PDF Document *</label>
          <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-300 hover:border-amber-700/50 bg-white hover:bg-slate-100/20 rounded-xl cursor-pointer transition-all duration-300">
            <UploadCloud className="w-6 h-6 text-amber-700 mb-1" />
            <span className="text-xs text-slate-850 font-bold">Upload PDF eBook</span>
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
          className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-sm shadow-md hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2 mt-4 cursor-pointer"
        >
          {uploading ? "Publishing…" : "Publish Now"}
        </button>
      </form>

      {cropModalOpen && (
        <ImageCropperModal
          imageSrc={imageSrc}
          onCropComplete={handleCropComplete}
          onClose={() => setCropModalOpen(false)}
        />
      )}
    </div>
  );
};

// Custom Book Cover Cropper Modal (Standard 3:4 Portrait Aspect Ratio cutout)
const ImageCropperModal = ({ imageSrc, onCropComplete, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const viewportRef = useRef(null);
  const imgRef = useRef(null);

  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    dragStart.current = {
      x: clientX,
      y: clientY,
      offsetX: offsetX,
      offsetY: offsetY,
    };
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    setOffsetX(dragStart.current.offsetX + dx);
    setOffsetY(dragStart.current.offsetY + dy);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    const imageRatio = naturalWidth / naturalHeight;
    const targetRatio = 210 / 280;

    if (imageRatio > targetRatio) {
      e.target.style.height = "280px";
      e.target.style.width = "auto";
    } else {
      e.target.style.width = "210px";
      e.target.style.height = "auto";
    }
  };

  const handleSave = () => {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement("canvas");
    // Target resolution is 300x400 (exactly 3:4 aspect ratio)
    canvas.width = 300;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    // The crop box is 210px on screen. The canvas output is 300px.
    const scale = 300 / 210;

    const rect = img.getBoundingClientRect();
    const viewRect = viewportRef.current.getBoundingClientRect();

    // The crop box starts at viewport top-left + left offset (35px), top offset (30px)
    const cropBoxLeft = viewRect.left + 35;
    const cropBoxTop = viewRect.top + 30;

    const dx = rect.left - cropBoxLeft;
    const dy = rect.top - cropBoxTop;
    const dw = rect.width;
    const dh = rect.height;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 300, 400);

    ctx.drawImage(img, dx * scale, dy * scale, dw * scale, dh * scale);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const croppedFile = new File([blob], "book-cover.jpg", { type: "image/jpeg" });
          onCropComplete(croppedFile);
        }
      },
      "image/jpeg",
      0.95
    );
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="bg-[#FAF6F0] border border-[#DFD5C6] rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center select-none">
        <h3 className="font-serif font-bold text-lg text-[#2C1F15] mb-1">Crop Book Cover</h3>
        <p className="text-[11px] text-[#8C7B67] mb-6 text-center">Drag and zoom to align your cover inside the portrait frame.</p>

        {/* Crop Viewport */}
        <div 
          ref={viewportRef}
          style={{ width: "280px", height: "340px" }}
          className="relative bg-zinc-950 rounded-2xl overflow-hidden cursor-move border border-[#DFD5C6]/60 shadow-inner select-none touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleEnd}
        >
          {/* Zoomable Image */}
          <img 
            ref={imgRef}
            src={imageSrc} 
            alt="Cover area preview" 
            onLoad={handleImageLoad}
            style={{
              position: "absolute",
              top: "30px",
              left: "35px",
              transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
              transformOrigin: "center center",
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: "none",
              pointerEvents: "none"
            }}
          />

          {/* Rectangular Book Cover Outline Mask Overlay */}
          <div 
            style={{ 
              position: "absolute", 
              top: "30px",
              left: "35px",
              width: "210px",
              height: "280px",
              borderRadius: "12px", 
              border: "2.5px solid #D87F4A", 
              boxShadow: "0 0 0 9999px rgba(10, 8, 7, 0.72)", 
              pointerEvents: "none" 
            }} 
          />
        </div>

        {/* Zoom Controller */}
        <div className="w-full mt-6 space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-[#8C7B67] uppercase tracking-wider">
            <span>Zoom</span>
            <span>{Math.round(zoom * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="3" 
            step="0.01"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#DFD5C6] rounded-lg appearance-none cursor-pointer accent-[#D87F4A]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full mt-8">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#DFD5C6] hover:bg-[#DFD5C6]/30 text-[#6D5E4D] font-bold text-xs rounded-xl transition duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 bg-[#D87F4A] hover:bg-[#C16D3A] text-white font-bold text-xs rounded-xl transition duration-200 cursor-pointer shadow-md shadow-[#D87F4A]/25"
          >
            Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickUpload;