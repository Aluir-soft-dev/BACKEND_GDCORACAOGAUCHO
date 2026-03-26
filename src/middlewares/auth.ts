import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user?.id) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Você precisa estar logado para acessar este recurso.",
      });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!dbUser || !dbUser.isActive) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Sua sessão não está autorizada para acessar este recurso.",
      });
    }

    req.auth = {
      userId: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
      user: dbUser,
      session,
    };

    return next();
  } catch (error) {
    return next(error);
  }
}