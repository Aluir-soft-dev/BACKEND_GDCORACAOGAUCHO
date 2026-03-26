import multer from "multer";
import { uploadToCloudinary } from "../lib/cloudinary.js";
const MAX_FILE_SIZE = 3 * 1024 * 1024;
const MAX_FILES = 500;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png"];
function fileFilter(_req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(new Error(`Apenas arquivos JPEG, JPG e PNG são permitidos. Tipo recebido: ${file.mimetype}`));
    }
    const fileExt = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf("."));
    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
        return cb(new Error(`Extensão de arquivo não permitida. Use: ${ALLOWED_EXTENSIONS.join(", ")}`));
    }
    return cb(null, true);
}
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: MAX_FILES,
    },
});
export const uploadSingle = upload.single("imagem");
export const uploadMultiple = upload.array("imagens", MAX_FILES);
export function validateUpload(req, res, next) {
    let totalSize = 0;
    let fileCount = 0;
    if (req.file) {
        fileCount = 1;
        totalSize = req.file.size;
    }
    else if (req.files && Array.isArray(req.files)) {
        fileCount = req.files.length;
        totalSize = req.files.reduce((sum, file) => sum + file.size, 0);
    }
    if (fileCount > MAX_FILES) {
        return res.status(400).json({
            success: false,
            code: "TOO_MANY_FILES",
            message: `Máximo de ${MAX_FILES} arquivos permitidos por vez. Você enviou ${fileCount}.`,
        });
    }
    if (req.file && req.file.size > MAX_FILE_SIZE) {
        return res.status(400).json({
            success: false,
            code: "FILE_TOO_LARGE",
            message: `O arquivo "${req.file.originalname}" excede o tamanho máximo de 3MB (${(req.file.size / 1024 / 1024).toFixed(2)}MB).`,
        });
    }
    if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
            if (file.size > MAX_FILE_SIZE) {
                return res.status(400).json({
                    success: false,
                    code: "FILE_TOO_LARGE",
                    message: `O arquivo "${file.originalname}" excede o tamanho máximo de 3MB (${(file.size / 1024 / 1024).toFixed(2)}MB).`,
                });
            }
        }
    }
    if (totalSize > MAX_FILE_SIZE * MAX_FILES) {
        return res.status(400).json({
            success: false,
            code: "TOTAL_SIZE_EXCEEDED",
            message: `Tamanho total dos arquivos excede o limite permitido (${((MAX_FILE_SIZE * MAX_FILES) / 1024 / 1024).toFixed(0)}MB).`,
        });
    }
    return next();
}
export async function processUploadToCloudinary(req, res, next) {
    try {
        if (req.file) {
            const uploadedImage = await uploadToCloudinary(req.file);
            req.uploadedImage = uploadedImage;
        }
        if (req.files && Array.isArray(req.files)) {
            const uploadedImages = [];
            for (const file of req.files) {
                const uploadedImage = await uploadToCloudinary(file);
                uploadedImages.push(uploadedImage);
            }
            req.uploadedImages = uploadedImages;
        }
        return next();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Erro ao fazer upload";
        return res.status(400).json({
            success: false,
            code: "UPLOAD_FAILED",
            message,
        });
    }
}
