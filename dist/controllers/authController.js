import { ok } from "../lib/http.js";
export async function login(_req, res) {
    return res.status(410).json({
        success: false,
        code: "AUTH_ENDPOINT_MOVED",
        message: "O login manual foi removido. Use as rotas do Better Auth em /api/auth.",
    });
}
export async function logout(_req, res) {
    res.clearCookie("better-auth.session_token", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });
    res.clearCookie("__Secure-better-auth.session_token", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
    });
    return res.json(ok({ loggedOut: true }, "Logout realizado com sucesso."));
}
