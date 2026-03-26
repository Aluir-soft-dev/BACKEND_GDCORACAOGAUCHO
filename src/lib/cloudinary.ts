import { v2 as cloudinary } from "cloudinary";
import type { Express } from "express";

interface UploadedImageInfo {
  id: string;
  url: string;
  thumbnailUrl: string;
  originalFilename: string;
}

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn("⚠️ Cloudinary não está configurado. Uploads farão falha.");
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file: Express.Multer.File): Promise<UploadedImageInfo> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary não está configurado.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "coracao-gaucho",
        resource_type: "image",
        public_id: file.originalname.replace(/\.[^/.]+$/, ""),
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Falha no upload Cloudinary"));
        }

        const thumbnailUrl = cloudinary.url(result.public_id, {
          width: 250,
          height: 250,
          crop: "thumb",
          secure: true,
        });

        resolve({
          id: result.public_id,
          url: result.secure_url,
          thumbnailUrl,
          originalFilename: file.originalname,
        });
      },
    );

    uploadStream.end(file.buffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.warn("Cloudinary não está configurado. Não é possível deletar imagem.");
    return false;
  }

  const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  return result.result === "ok" || result.result === "not found";
}

export function extractImageIdFromUrl(url: string): string | null {
  try {
    // aceita URLs como https://res.cloudinary.com/<cloud>/image/upload/v123/<folder>/<public_id>.<ext>
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.(?:jpg|jpeg|png|webp)/i);
    if (!match) return null;
    return match[1];
  } catch {
    return null;
  }
}
