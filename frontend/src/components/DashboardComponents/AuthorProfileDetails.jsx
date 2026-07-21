import React, { useEffect, useMemo, useState, useRef } from "react";
import { FaUser, FaInstagram, FaTwitter, FaGlobe, FaSave, FaUserCheck } from "react-icons/fa";
import { Sun, Moon, ShieldAlert } from "lucide-react";

const genreOptions = [
  "Fiction",
  "Poetry",
  "Sci-Fi",
  "Fantasy",
  "Mystery",
  "Romance",
  "Non-fiction",
  "Memoir",
  "Horror",
  "Drama",
];

const AuthorProfileDetails = ({ initialValues = {}, onSubmit }) => {
  const [form, setForm] = useState({
    displayName: "",
    age: "",
    gender: "",
    genres: [],
    bio: "",
    location: "",
    instagram: "",
    twitter: "",
    website: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [genreInput, setGenreInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "system";
  });

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "system");
    };
    window.addEventListener("theme-change", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);
    return () => {
      window.removeEventListener("theme-change", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    window.dispatchEvent(new Event("theme-change"));
  };

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      displayName: initialValues.displayName || "",
      age: initialValues.age || "",
      gender: initialValues.gender || "",
      genres: initialValues.genres || [],
      bio: initialValues.bio || "",
      location: initialValues.location || "",
      instagram: initialValues.instagram || "",
      twitter: initialValues.twitter || "",
      website: initialValues.website || "",
    }));
    if (initialValues.profileImage) {
      setPreviewUrl(initialValues.profileImage);
    }
  }, [initialValues]);

  useEffect(() => {
    if (!profileImage) return;

    const objectUrl = URL.createObjectURL(profileImage);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [profileImage]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreSelect = (value) => {
    if (!value) return;
    setForm((prev) => ({
      ...prev,
      genres: prev.genres.includes(value)
        ? prev.genres.filter((g) => g !== value)
        : [...prev.genres, value],
    }));
  };

  const handleAddGenre = () => {
    const value = genreInput.trim();
    if (!value) return;
    setForm((prev) => ({
      ...prev,
      genres: Array.from(new Set([...prev.genres, value])),
    }));
    setGenreInput("");
  };

  const handleRemoveGenre = (genreToRemove) => {
    setForm((prev) => ({
      ...prev,
      genres: prev.genres.filter((genre) => genre !== genreToRemove),
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleCropComplete = (croppedFile) => {
    setProfileImage(croppedFile);
    setCropModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const isMaintenanceActive = localStorage.getItem("admin_setting_maintenanceMode") === "true";
    if (isMaintenanceActive && initialValues?.user?.role !== "admin") {
      setError("Maintenance Shield Active: Profile media & details updates are temporarily paused for storage maintenance. Please try again later.");
      return;
    }

    if (!form.displayName.trim()) {
      setError("Display name is required.");
      return;
    }

    if (!form.age || Number(form.age) < 1) {
      setError("Please provide a valid age.");
      return;
    }

    if (!form.genres.length) {
      setError("Please add at least one genre.");
      return;
    }

    const values = {
      ...form,
      age: Number(form.age),
      genres: form.genres,
    };

    if (profileImage) {
      values.profileImage = profileImage;
    }

    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
      setSuccess("Profile details updated successfully! 🎉");
      setTimeout(() => setSuccess(""), 4000);
    } catch (submitError) {
      setError(submitError?.message || "Unable to save profile details.");
    } finally {
      setLoading(false);
    }
  };

  const hasGenreErrors = useMemo(() => form.genres.length === 0, [form.genres]);

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200/60 p-6 sm:p-8 rounded-2xl shadow-sm">
      <div className="mb-8 border-b border-slate-100 pb-5">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FaUserCheck className="w-6 h-6 text-amber-700" />
          Author Profile Settings
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Personalize your public author profile, genres, bio, and social presence.
        </p>
      </div>

      <form className="space-y-6 text-sm" onSubmit={handleSubmit}>
        
        {/* Maintenance Shield Warning */}
        {localStorage.getItem("admin_setting_maintenanceMode") === "true" && initialValues?.user?.role !== "admin" && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 font-semibold flex items-start gap-2.5 shadow-sm">
            <ShieldAlert size={18} className="text-amber-800 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Maintenance Shield Active:</strong> Profile image uploads and account updates are temporarily paused for storage maintenance.
            </div>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Artistic / Display Name *</label>
            <input
              type="text"
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-50/50 focus:border-amber-600 rounded-xl text-slate-800 outline-none transition-all placeholder-slate-300"
              placeholder="Your pen name"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Age *</label>
            <input
              type="number"
              name="age"
              min="1"
              value={form.age}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-50/50 focus:border-amber-600 rounded-xl text-slate-800 outline-none transition-all"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Gender (optional)</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-50/50 focus:border-amber-600 rounded-xl text-slate-800 outline-none transition-all"
            >
              <option value="">Choose one</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Location (optional)</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-50/50 focus:border-amber-600 rounded-xl text-slate-800 outline-none transition-all placeholder-slate-300"
              placeholder="e.g., Paris, France"
            />
          </div>
        </div>

        {/* Profile Picture */}
        <div className="border-t border-slate-100 pt-6">
          <label className="block text-xs font-semibold text-slate-600 mb-2">Profile Avatar</label>
          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shrink-0">
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar preview" className="h-full w-full object-cover" />
              ) : (
                <FaUser className="h-10 w-10 text-slate-300 absolute inset-0 m-auto" />
              )}
            </div>
            <label className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer transition-colors">
              Change Image
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Genres Selection */}
        <div className="border-t border-slate-100 pt-6">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Genres *</label>
          <p className="text-slate-400 text-[11px] mb-3">Select writing styles that represent you.</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {genreOptions.map((option) => {
              const selected = form.genres.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleGenreSelect(option)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    selected
                      ? "border-amber-600 bg-amber-50 text-amber-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-amber-600/50"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              placeholder="Custom genre..."
              className="flex-grow max-w-xs px-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-50/50 focus:border-amber-600 rounded-xl text-slate-800 outline-none text-xs transition-all"
            />
            <button
              type="button"
              onClick={handleAddGenre}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold text-xs transition-colors"
            >
              Add Custom
            </button>
          </div>

          {form.genres.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {form.genres.map((genre) => (
                <span
                  key={genre}
                  className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200"
                >
                  {genre}
                  <button
                    type="button"
                    onClick={() => handleRemoveGenre(genre)}
                    className="text-slate-400 hover:text-red-600 ml-1 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          {hasGenreErrors && <p className="text-red-500 text-xs mt-2">At least one genre is required.</p>}
        </div>

        {/* Bio */}
        <div className="border-t border-slate-100 pt-6">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Short Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-50/50 focus:border-amber-600 rounded-xl text-slate-800 outline-none transition-all placeholder-slate-400 leading-relaxed text-xs"
            placeholder="Introduce yourself, your voice, and creative works..."
          />
        </div>

        {/* Social Links */}
        <div className="border-t border-slate-100 pt-6">
          <label className="block text-xs font-semibold text-slate-600 mb-3">Social & Online Presence</label>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="relative flex items-center">
              <FaInstagram className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="url"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-50/50 focus:border-amber-600 rounded-xl text-slate-800 outline-none text-xs transition-all"
                placeholder="Instagram URL"
              />
            </div>
            <div className="relative flex items-center">
              <FaTwitter className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="url"
                name="twitter"
                value={form.twitter}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-50/50 focus:border-amber-600 rounded-xl text-slate-800 outline-none text-xs transition-all"
                placeholder="Twitter URL"
              />
            </div>
            <div className="relative flex items-center">
              <FaGlobe className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="url"
                name="website"
                value={form.website}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-50/50 focus:border-amber-600 rounded-xl text-slate-800 outline-none text-xs transition-all"
                placeholder="Personal website"
              />
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="border-t border-slate-100 pt-6">
          <label className="block text-xs font-semibold text-slate-600 mb-3">Theme Settings</label>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-slate-50 border border-slate-200/40 p-4 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-slate-800">Interface Theme</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Customize how Author Gallery looks on your device.</p>
            </div>
            <div className="flex bg-slate-200/60 p-1 rounded-xl w-full sm:w-auto shadow-inner">
              <button
                type="button"
                onClick={() => handleThemeChange("light")}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer select-none ${
                  theme === "light" ? "bg-white text-slate-800 shadow-sm" : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <Sun size={14} />
                Light
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange("dark")}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer select-none ${
                  theme === "dark" ? "bg-white text-slate-800 shadow-sm" : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <Moon size={14} />
                Dark
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange("system")}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer select-none ${
                  theme === "system" ? "bg-white text-slate-800 shadow-sm" : "text-slate-600 hover:text-slate-800"
                }`}
              >
                System
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        {(error || success) && (
          <div className={`p-4 rounded-xl text-xs font-semibold ${
            error ? "bg-red-50 text-red-800 border border-red-100" : "bg-emerald-50 text-emerald-800 border border-emerald-100"
          }`}>
            <p>{error || success}</p>
          </div>
        )}

        {/* Save button */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-between border-t border-slate-100 pt-6">
          <p className="text-[11px] text-slate-400 font-medium">
            Fields marked with * are required. Saving updates your author public cards.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold text-xs transition-all focus:ring-4 focus:ring-amber-100 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FaSave className="w-4.5 h-4.5" />
            {loading ? "Saving Profile…" : "Save Profile Details"}
          </button>
        </div>
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

// WhatsApp-like Custom Profile Picture Cropper Modal (Self-contained with HTML5 Canvas)
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
    if (naturalWidth > naturalHeight) {
      e.target.style.height = "200px";
      e.target.style.width = "auto";
    } else {
      e.target.style.width = "200px";
      e.target.style.height = "auto";
    }
  };

  const handleSave = () => {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");

    // Map screen coordinates to output canvas coordinate space (300px target size)
    const scale = 300 / 200;

    const rect = img.getBoundingClientRect();
    const viewRect = viewportRef.current.getBoundingClientRect();

    // The crop box starts at viewport top-left + 40px
    const cropBoxLeft = viewRect.left + 40;
    const cropBoxTop = viewRect.top + 40;

    const dx = rect.left - cropBoxLeft;
    const dy = rect.top - cropBoxTop;
    const dw = rect.width;
    const dh = rect.height;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 300, 300);

    ctx.drawImage(img, dx * scale, dy * scale, dw * scale, dh * scale);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const croppedFile = new File([blob], "profile-avatar.jpg", { type: "image/jpeg" });
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
        <h3 className="font-serif font-bold text-lg text-[#2C1F15] mb-1">Crop Profile Photo</h3>
        <p className="text-[11px] text-[#8C7B67] mb-6 text-center">Drag and zoom to align your photo inside the circular frame.</p>

        {/* Crop Viewport */}
        <div 
          ref={viewportRef}
          style={{ width: "280px", height: "280px" }}
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
            alt="Crop area preview" 
            onLoad={handleImageLoad}
            style={{
              position: "absolute",
              top: "40px",
              left: "40px",
              transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
              transformOrigin: "center center",
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: "none",
              pointerEvents: "none"
            }}
          />

          {/* Circular Cutout Mask Overlay */}
          <div 
            style={{ 
              position: "absolute", 
              top: "40px",
              left: "40px",
              width: "200px",
              height: "200px",
              borderRadius: "50%", 
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

        {/* Modal Buttons */}
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

export default AuthorProfileDetails;
