import { z } from "zod";

export const idParamSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const userIdParamSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  params: z.object({
    userId: z.string().min(1),
  }),
});