import { z } from "zod";
export const createTurmaSchema = z.object({
    params: z.object({}).passthrough(),
    query: z.object({}).passthrough(),
    body: z.object({
        nome: z.string().trim().min(2),
        local: z.string().trim().min(2),
        dataHora: z.coerce.date(),
        descricao: z.string().optional().nullable(),
        preco: z.coerce.number().nonnegative(),
        nivel: z.string().trim().min(2),
        imagens: z.array(z.string()).optional().default([]),
    }).strict(),
});
export const updateTurmaSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive(),
    }),
    query: z.object({}).passthrough(),
    body: z.object({
        nome: z.string().trim().min(2).optional(),
        local: z.string().trim().min(2).optional(),
        dataHora: z.coerce.date().optional(),
        descricao: z.string().optional().nullable(),
        preco: z.coerce.number().nonnegative().optional(),
        nivel: z.string().trim().min(2).optional(),
        imagens: z.array(z.string()).optional(),
    }).strict().refine((data) => Object.keys(data).length > 0, {
        message: "Envie ao menos um campo para atualizar.",
    }),
});
