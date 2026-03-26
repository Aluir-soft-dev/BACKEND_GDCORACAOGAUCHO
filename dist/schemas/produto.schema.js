import { z } from "zod";
export const createProdutoSchema = z.object({
    params: z.object({}).passthrough(),
    query: z.object({}).passthrough(),
    body: z.object({
        nome: z.string().trim().min(2),
        quantidade: z.coerce.number().int().min(0),
        preco: z.coerce.number().nonnegative(),
        descricao: z.string().trim().optional().nullable(),
        categoria: z.string().trim().optional().nullable(),
        categoriaId: z.coerce.number().int().positive().optional().nullable(),
        imagem: z.string().trim().optional().nullable(),
    }).strict(),
});
export const updateProdutoSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive(),
    }),
    query: z.object({}).passthrough(),
    body: z.object({
        nome: z.string().trim().min(2).optional(),
        quantidade: z.coerce.number().int().min(0).optional(),
        preco: z.coerce.number().nonnegative().optional(),
        descricao: z.string().trim().optional().nullable(),
        categoria: z.string().trim().optional().nullable(),
        categoriaId: z.coerce.number().int().positive().optional().nullable(),
        imagem: z.string().trim().optional().nullable(),
    }).strict().refine((data) => Object.keys(data).length > 0, {
        message: "Envie ao menos um campo para atualizar.",
    }),
});
