import { z } from "zod";
export const createEventoSchema = z.object({
    params: z.object({}).passthrough(),
    query: z.object({}).passthrough(),
    body: z.object({
        nomeEvento: z.string().trim().min(2),
        local: z.string().trim().min(2),
        data: z.coerce.date(),
        descricao: z.string().optional().nullable(),
        atracao: z.string().optional().nullable(),
        preco: z.coerce.number().nonnegative().optional().nullable(),
        imagens: z.array(z.string()).optional().default([]),
        status: z.string().trim().optional().default("Ativo"),
    }).strict(),
});
export const updateEventoSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive(),
    }),
    query: z.object({}).passthrough(),
    body: z.object({
        nomeEvento: z.string().trim().min(2).optional(),
        local: z.string().trim().min(2).optional(),
        data: z.coerce.date().optional(),
        descricao: z.string().optional().nullable(),
        atracao: z.string().optional().nullable(),
        preco: z.coerce.number().nonnegative().optional().nullable(),
        imagens: z.array(z.string()).optional(),
        status: z.string().trim().optional(),
    }).strict().refine((data) => Object.keys(data).length > 0, {
        message: "Envie ao menos um campo para atualizar.",
    }),
});
