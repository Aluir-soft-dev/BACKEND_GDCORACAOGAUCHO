import { Router } from "express";
import { uploadMultiple, uploadSingle, processUploadToCloudinary, validateUpload } from "../middlewares/upload.js";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = Router();

router.post(
  "/single",
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  uploadSingle,
  validateUpload,
  processUploadToCloudinary,
  (req, res) => {
    const uploadedImage = (req as any).uploadedImage;

    if (!uploadedImage) {
      return res.status(400).json({
        success: false,
        code: "FILE_REQUIRED",
        message: "Nenhum arquivo foi enviado ou o upload falhou.",
      });
    }

    return res.json({
      success: true,
      message: "Upload realizado com sucesso!",
      data: {
        id: uploadedImage.id,
        url: uploadedImage.url,
        thumbnailUrl: uploadedImage.thumbnailUrl,
        filename: uploadedImage.originalFilename,
      },
    });
  },
);

router.post(
  "/multiple",
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  uploadMultiple,
  validateUpload,
  processUploadToCloudinary,
  (req, res) => {
    const uploadedImages = (req as any).uploadedImages;

    if (!uploadedImages?.length) {
      return res.status(400).json({
        success: false,
        code: "FILE_REQUIRED",
        message: "Nenhum arquivo foi enviado ou o upload falhou.",
      });
    }

    return res.json({
      success: true,
      message: "Upload múltiplo realizado com sucesso!",
      data: uploadedImages.map((image: any) => ({
        id: image.id,
        url: image.url,
        thumbnailUrl: image.thumbnailUrl,
        filename: image.originalFilename,
      })),
    });
  },
);

export default router;