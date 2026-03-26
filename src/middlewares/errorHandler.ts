import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/http.js";

export function notFoundHandler(_req: Request, res: Response) {
  return res.status(404).json({
    success: false,
    code: "NOT_FOUND",
    message: "Rota não encontrada.",
  });
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message,
      ...(error.errors ? { errors: error.errors } : {}),
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    code: "INTERNAL_ERROR",
    message: "Ocorreu um erro interno. Tente novamente em instantes.",
  });
}