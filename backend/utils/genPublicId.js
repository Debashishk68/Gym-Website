// Helper function to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  try {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1]; // e.g., abc123.jpg
    const publicId = fileName.split(".")[0]; // abc123
    const folder = parts.slice(parts.length - 2, parts.length - 1)[0]; // get folder if used
    return `${folder}/${publicId}`;
  } catch (e) {
    console.error("Error extracting public_id from URL:", e);
    return null;
  }
};
module.exports=getPublicIdFromUrl