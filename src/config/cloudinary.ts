import axios from 'axios';

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET

export const uploadImageToCloudinary = async (file: File) => {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);

  try {
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};