// uploadImage.js (Client-side version for React)

export const uploadImage = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "chat_app_upload"); // Your unsigned preset name

  try {
    const response = await fetch("https://api.cloudinary.com/v1_1/dxxltlx2l/image/upload", {
      method: "POST",
      body: data,
    });

    const result = await response.json();
    return result.secure_url; // ✅ Returns the Cloudinary image URL

  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};
