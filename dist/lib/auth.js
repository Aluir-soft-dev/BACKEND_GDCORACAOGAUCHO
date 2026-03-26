import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import { hashPassword, verifyPassword } from "./password.js";
const trustedOrigins = [
    process.env.CORS_ORIGIN,
    process.env.FRONTEND_URL,
    process.env.BILHETERIA_URL,
    process.env.LOJA_URL,
    process.env.ADMIN_URL,
    ...(process.env.TRUSTED_ORIGINS?.split(",") ?? []),
]
    .map((item) => item?.trim())
    .filter(Boolean);
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins,
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        password: {
            hash: hashPassword,
            verify: verifyPassword,
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        facebook: {
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        },
    },
    user: {
        modelName: "user",
        additionalFields: {
            role: { type: "string", required: false, defaultValue: "USER", input: false },
            phone: { type: "string", required: false },
            cpf: { type: "string", required: false },
            endereco: { type: "string", required: false },
            cidade: { type: "string", required: false },
            estado: { type: "string", required: false },
            isActive: { type: "boolean", required: false, defaultValue: true, input: false },
        },
    },
    session: { modelName: "session" },
    account: { modelName: "account" },
    verification: { modelName: "verification" },
});
