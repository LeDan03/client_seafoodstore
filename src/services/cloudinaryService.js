import { CLOUDINARY_CONFIG } from "../../config/cloudinaryConfig";
import { toast } from "react-toastify";

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);

    try {
        const response = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
            method: "POST",
            body: formData
        })
        const data = await response.json();

        return {
            secureUrl: data.secure_url,
            publicId: data.public_id
        }
    } catch (error) {
        toast.error("Lỗi tải ảnh: " + error?.message);
        console.error("Lỗi upload ảnh", error);
        throw error;
    }
}

export const uploadMultipleImages = async (files) => {
    try {

        const uploadPromises = files.map((file) => uploadImage(file));

        const results = await Promise.all(uploadPromises);

        return results;

    } catch (error) {
        console.error("Upload multiple images error:", error);
        throw error;
    }
};