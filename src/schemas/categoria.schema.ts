import { z } from "zod";

export const createCategoriaSchema = z.object({
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  body: z.object({
    nome: z.string().trim().min(2, "Informe o nome da categoria."),
  }).strict(),
});