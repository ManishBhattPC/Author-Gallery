import React, { useEffect, useMemo, useState } from "react";
import { FaUser, FaInstagram, FaTwitter, FaGlobe, FaSave, FaUserCheck } from "react-icons/fa";
import { Sun, Moon } from "lucide-react";

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
    setProfileImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

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
    </div>
  );
};

export default AuthorProfileDetails;
