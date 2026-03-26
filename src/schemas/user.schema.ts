import { z } from "zod";

export const createCollaboratorSchema = z.object({
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  body: z.object({
    nome: z.string().trim().min(2),
    email: z.string().email(),
    senha: z.string().min(8),
    telefone: z.string().optional().nullable(),
    cpf: z.string().optional().nullable(),
    role: z.enum(["ADMIN", "STAFF"]).default("STAFF"),
    isActive: z.boolean().optional().default(true),
  }).strict(),
});

export const updateCollaboratorSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).passthrough(),
  body: z.object({
    nome: z.string().trim().min(2).optional(),
    email: z.string().email().optional(),
    senha: z.string().min(8).optional(),
    telefone: z.string().optional().nullable(),
    cpf: z.string().optional().nullable(),
    role: z.enum(["ADMIN", "STAFF"]).optional(),
    isActive: z.boolean().optional(),
  }).strict().refine((data) => Object.keys(data).length > 0, {
    message: "Envie ao menos um campo para atualizar.",
  }),
});

export const createPublicUserSchema = z.object({
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  body: z.object({
    nome: z.string().trim().min(2),
    email: z.string().email(),
    senha: z.string().min(8),
    telefone: z.string().optional().nullable(),
    cpf: z.string().optional().nullable(),
    endereco: z.string().optional().nullable(),
    cidade: z.string().optional().nullable(),
    estado: z.string().optional().nullable(),
  }).strict(),
});

export const updateProfileSchema = z.object({
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  body: z.object({
    nome: z.string().trim().min(2).optional(),
    telefone: z.string().optional().nullable(),
    cpf: z.string().optional().nullable(),
    endereco: z.string().optional().nullable(),
    cidade: z.string().optional().nullable(),
    estado: z.string().optional().nullable(),
    email: z.string().email().optional(),
    senha: z.string().min(8).optional(),
  }).strict().refine((data) => Object.keys(data).length > 0, {
    message: "Envie ao menos um campo para atualizar.",
  }),
});