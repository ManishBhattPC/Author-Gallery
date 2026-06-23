import React, { useEffect, useState } from "react";
import AuthorProfileDetails from "../components/DashboardComponents/AuthorProfileDetails.jsx";
import {
  getMyAuthorProfile,
  createAuthorProfile,
  updateAuthorProfile,
} from "../services/authorProfileService.js";

const AuthorProfile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await getMyAuthorProfile();
      setProfile(data);
      setProfileExists(true);
    } catch (error) {
      setProfile({});
      setProfileExists(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();

    formData.append("displayName", values.displayName);
    formData.append("age", values.age);
    formData.append("gender", values.gender || "");
    formData.append("bio", values.bio || "");
    formData.append("location", values.location || "");
    formData.append("instagram", values.instagram || "");
    formData.append("twitter", values.twitter || "");
    formData.append("website", values.website || "");

    values.genres.forEach((genre) => {
      formData.append("genres", genre);
    });

    if (values.profileImage) {
      formData.append("profileImage", values.profileImage);
    }

    if (profileExists) {
      await updateAuthorProfile(formData);
    } else {
      await createAuthorProfile(formData);
    }

    await loadProfile();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">Loading author profile...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <AuthorProfileDetails initialValues={profile} onSubmit={handleSubmit} />
    </div>
  );
};

export default AuthorProfile;
