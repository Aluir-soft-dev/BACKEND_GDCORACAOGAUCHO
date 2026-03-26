import type { NextFunction, Request, Response } from "express";

export function requireSelfOrRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Você precisa estar logado para acessar este recurso.",
      });
    }

    const paramUserId = req.params.userId;
    const isSelf = !paramUserId || paramUserId === req.auth.userId;
    const hasRole = roles.includes(req.auth.role);

    if (!isSelf && !hasRole) {
      return res.status(403).json({
        success: false,
        code: "FORBIDDEN",
        message: "Você não tem permissão para acessar dados de outro usuário.",
      });
    }

    return next();
  };
}