import axios from "axios";


const baseURL = import.meta.env.VITE_API_URL;


export const uploadImageToS3 = async (file: File): Promise<string> => {
  if (!file) throw new Error("No file provided for upload.");

  const { data } = await axios.get(`${baseURL}/s3/presigned-url`, {
    params: {
      fileName: file.name,
      fileType: file.type,
      folder: "images",
    },
  });

  const { url, key } = data;

  await axios.put(url, file, { headers: { "Content-Type": file.type } });

  return key;
};


export const uploadPdfToS3 = async (file: File): Promise<string> => {
  if (!file) throw new Error("No file provided for upload.");

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only PDF, DOC, DOCX are allowed.");
  }

  const { data } = await axios.get(`${baseURL}/s3/presigned-url`, {
    params: {
      fileName: file.name,
      fileType: file.type,
      folder: "documents",
    },
  });

  const { url, key } = data;

  await axios.put(url, file, { headers: { "Content-Type": file.type } });

  return key;
};

export const getPresignedDownloadUrl = async (objectKey: string): Promise<string> => {
  const { data } = await axios.get(`${baseURL}/s3/download-url`, {
    params: { key: objectKey },
  });
  return data.url;
};

