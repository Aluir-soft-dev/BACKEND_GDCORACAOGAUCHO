import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../types/auth.js";

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Você precisa estar logado para acessar este recurso.",
      });
    }

    if (!allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({
        success: false,
        code: "FORBIDDEN",
        message: "Você não tem permissão para realizar esta ação.",
      });
    }

    return next();
  };
}
