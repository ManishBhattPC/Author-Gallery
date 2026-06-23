import React, { useEffect, useMemo, useState } from "react";

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
	}, [initialValues]);

	useEffect(() => {
		if (!profileImage) {
			setPreviewUrl("");
			return;
		}

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
			genres: Array.from(new Set([...prev.genres, value])),
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
			setSuccess("Author profile details saved successfully.");
		} catch (submitError) {
			setError(submitError?.message || "Unable to save profile details.");
		} finally {
			setLoading(false);
		}
	};

	const hasGenreErrors = useMemo(() => form.genres.length === 0, [form.genres]);

	return (
		<div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
			<div className="mb-8">
				<h2 className="text-3xl font-semibold text-slate-900">Complete Your Author Profile</h2>
				<p className="mt-2 text-sm text-slate-600">
					Fill in your author details so your dashboard and profile feel complete.
				</p>
			</div>

			<form className="space-y-8" onSubmit={handleSubmit}>
				<div className="grid gap-6 lg:grid-cols-2">
					<div>
						<label className="block text-sm font-medium text-slate-700">Artistic / Display Name</label>
						<input
							type="text"
							name="displayName"
							value={form.displayName}
							onChange={handleChange}
							required
							className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
							placeholder="Your author name"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700">Age</label>
						<input
							type="number"
							name="age"
							min="1"
							value={form.age}
							onChange={handleChange}
							required
							className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700">Gender (optional)</label>
						<select
							name="gender"
							value={form.gender}
							onChange={handleChange}
							className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
						>
							<option value="">Choose one</option>
							<option value="Female">Female</option>
							<option value="Male">Male</option>
							<option value="Non-binary">Non-binary</option>
							<option value="Prefer not to say">Prefer not to say</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700">Location (optional)</label>
						<input
							type="text"
							name="location"
							value={form.location}
							onChange={handleChange}
							className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
							placeholder="City, Country"
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-slate-700">Genre</label>
					<p className="mt-1 text-sm text-slate-500">Select one or more genres that reflect your writing style.</p>
					<div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{genreOptions.map((option) => (
							<button
								key={option}
								type="button"
								onClick={() => handleGenreSelect(option)}
								className={`rounded-full border px-4 py-2 text-sm transition ${
									form.genres.includes(option)
										? "border-amber-600 bg-amber-50 text-amber-700"
										: "border-slate-300 bg-white text-slate-700 hover:border-amber-500"
								}`}
							>
								{option}
							</button>
						))}
					</div>
					<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
						<input
							type="text"
							value={genreInput}
							onChange={(e) => setGenreInput(e.target.value)}
							placeholder="Add custom genre"
							className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
						/>
						<button
							type="button"
							onClick={handleAddGenre}
							className="rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-800"
						>
							Add Genre
						</button>
					</div>
					<div className="mt-4 flex flex-wrap gap-2">
						{form.genres.map((genre) => (
							<span
								key={genre}
								className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-sm text-slate-700"
							>
								{genre}
								<button
									type="button"
									onClick={() => handleRemoveGenre(genre)}
									className="text-slate-500 transition hover:text-rose-600"
								>
									×
								</button>
							</span>
						))}
					</div>
					{hasGenreErrors && (
						<p className="mt-2 text-sm text-rose-600">At least one genre is required.</p>
					)}
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					<div>
						<label className="block text-sm font-medium text-slate-700">Profile Picture</label>
						<input
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="mt-2 w-full text-sm text-slate-700"
						/>
						{previewUrl && (
							<div className="mt-3 overflow-hidden rounded-3xl border border-slate-200">
								<img
									src={previewUrl}
									alt="Profile preview"
									className="h-56 w-full object-cover"
								/>
							</div>
						)}
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-slate-700">Short Bio / About Author</label>
					<textarea
						name="bio"
						value={form.bio}
						onChange={handleChange}
						rows={5}
						className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
						placeholder="Tell readers about your work, voice, and creative inspiration."
					/>
				</div>

				<div className="grid gap-6 lg:grid-cols-3">
					<div>
						<label className="block text-sm font-medium text-slate-700">Instagram</label>
						<input
							type="url"
							name="instagram"
							value={form.instagram}
							onChange={handleChange}
							className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
							placeholder="https://instagram.com/yourname"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-slate-700">Twitter</label>
						<input
							type="url"
							name="twitter"
							value={form.twitter}
							onChange={handleChange}
							className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
							placeholder="https://twitter.com/yourname"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-slate-700">Website</label>
						<input
							type="url"
							name="website"
							value={form.website}
							onChange={handleChange}
							className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
							placeholder="https://yourwebsite.com"
						/>
					</div>
				</div>

				{(error || success) && (
					<div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm">
						{error ? (
							<p className="text-rose-600">{error}</p>
						) : (
							<p className="text-emerald-700">{success}</p>
						)}
					</div>
				)}

				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-sm text-slate-500">
						Required fields are display name, age, and genre. Profile picture is optional but recommended.
					</p>
					<button
						type="submit"
						disabled={loading}
						className="inline-flex items-center justify-center rounded-full bg-amber-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-70"
					>
						{loading ? "Saving profile…" : "Save Profile"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default AuthorProfileDetails;
