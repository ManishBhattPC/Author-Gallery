import cloudinary from "../config/cloudinary.js";

/**
 * Parses a Cloudinary URL to extract the public_id, resource_type, and type.
 * @param {string} url - The Cloudinary URL.
 * @returns {object|null} - The parsed information or null.
 */
export const extractCloudinaryInfo = (url) => {
  if (!url) return null;

  let folder = null;
  if (url.includes("book-covers/")) {
    folder = "book-covers";
  } else if (url.includes("book-pdfs/")) {
    folder = "book-pdfs";
  } else if (url.includes("author-profiles/")) {
    folder = "author-profiles";
  }

  if (!folder) return null;

  const parts = url.split(`${folder}/`);
  if (parts.length < 2) return null;
  
  const afterFolder = parts[1];
  const cleanPath = afterFolder.split("?")[0]; // remove query parameters
  const publicId = `${folder}/${cleanPath.replace(/\.[^/.]+$/, "")}`; // remove extension

  const isPdf = folder === "book-pdfs";
  const type = isPdf ? "authenticated" : "upload";
  const resourceType = "image"; // All cover images, PDFs, and profile images are uploaded under resource_type 'image'

  return {
    publicId,
    type,
    resourceType,
  };
};

/**
 * Deletes an asset from Cloudinary using its URL.
 * @param {string} url - The URL of the asset to delete.
 * @returns {Promise<object>} - The Cloudinary deletion response.
 */
const deleteFromCloudinary = async (url) => {
  try {
    const info = extractCloudinaryInfo(url);
    if (!info) {
      console.warn("Could not parse Cloudinary URL for deletion:", url);
      return null;
    }

    const { publicId, type, resourceType } = info;
    console.log(`Attempting to delete from Cloudinary: ${publicId} (resource_type: ${resourceType}, type: ${type})`);
    
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      type: type,
    });

    console.log("Cloudinary deletion response:", result);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};

export default deleteFromCloudinary;
