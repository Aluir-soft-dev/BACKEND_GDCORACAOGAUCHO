import { z } from "zod";

export const checkoutEventoSchema = z.object({
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  body: z.object({
    eventoId: z.coerce.number().int().positive(),
    quantidade: z.coerce.number().int().positive(),
    portadores: z.array(z.object({
      nome: z.string().min(2),
      cpf: z.string().optional().nullable(),
    })).optional(),
    precoUnit: z.coerce.number().nonnegative().optional(),
  }).strict(),
});

export const checkoutCursoSchema = z.object({
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  body: z.object({
    turmaId: z.coerce.number().int().positive(),
  }).strict(),
});

export const updateIngressoStatusSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  query: z.object({}).passthrough(),
  body: z.object({
    status: z.enum(["DISPONIVEL", "PENDENTE", "CANCELADO"]),
  }).strict(),
});

export const updateInscricaoStatusSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  query: z.object({}).passthrough(),
  body: z.object({
    status: z.enum(["PENDENTE", "CONFIRMADA", "CANCELADA"]),
  }).strict(),
});