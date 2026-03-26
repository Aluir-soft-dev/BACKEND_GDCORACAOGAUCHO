const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_IMAGES_URL = process.env.CLOUDFLARE_IMAGES_URL || "https://imagedelivery.net";
if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
    console.warn("⚠️  Cloudflare Images não configurado. Uploads ficarão com erro.");
}
export async function uploadToCloudflare(file) {
    if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
        throw new Error("Cloudflare não está configurado.");
    }
    const formData = new FormData();
    const fileBytes = new Uint8Array(file.buffer);
    const blob = new Blob([fileBytes], { type: file.mimetype });
    formData.append("file", blob, file.originalname);
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        },
        body: formData,
    });
    const data = (await response.json());
    if (!data.success || !data.result) {
        const errorMsg = data.errors?.[0]?.message || "Erro ao fazer upload para Cloudflare";
        throw new Error(errorMsg);
    }
    const imageId = data.result.id;
    const url = `${CLOUDFLARE_IMAGES_URL}/${CLOUDFLARE_ACCOUNT_ID}/${imageId}/public`;
    const thumbnailUrl = `${CLOUDFLARE_IMAGES_URL}/${CLOUDFLARE_ACCOUNT_ID}/${imageId}/thumbnail`;
    return {
        id: imageId,
        url,
        thumbnailUrl,
        originalFilename: data.result.filename,
    };
}
export async function deleteFromCloudflare(imageId) {
    if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
        console.warn("Cloudflare não está configurado. Não é possível deletar imagem.");
        return false;
    }
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        },
    });
    const data = (await response.json());
    return data.success;
}
export function extractImageIdFromUrl(url) {
    const match = url.match(/\/([a-f0-9-]+)\/public$/);
    return match ? match[1] : null;
}
