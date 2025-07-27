import axios from "axios";

export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "testbaji_unsigned"); // YOUR unsigned preset
  formData.append("folder", "testbaji/images"); // optional

  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dhekysjni/image/upload",
    formData
  );

  return res.data.secure_url; // ✅ This is the image URL you save in DB
};
