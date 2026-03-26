import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import type { UserRole } from "../types/auth.js";
import { AppError } from "../lib/http.js";

export class UserService {
  async createCollaborator(input: {
    nome: string;
    email: string;
    senha: string;
    telefone?: string | null;
    cpf?: string | null;
    role: "ADMIN" | "STAFF";
    isActive?: boolean;
  }) {
    const exists = await prisma.user.findUnique({ where: { email: input.email } });
    if (exists) {
      throw new AppError(409, "EMAIL_ALREADY_EXISTS", "Já existe usuário com este e-mail.");
    }

    const hash = await bcrypt.hash(input.senha, 12);

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: input.nome,
          email: input.email,
          phone: input.telefone,
          cpf: input.cpf,
          role: input.role,
          isActive: input.isActive ?? true,
          emailVerified: true,
        },
      });

      await tx.account.create({
        data: {
          userId: user.id,
          providerId: "credential",
          accountId: input.email,
          password: hash,
        },
      });

      return user;
    });
  }

  async updateCollaborator(
    id: string,
    input: {
      nome?: string;
      email?: string;
      senha?: string;
      telefone?: string | null;
      cpf?: string | null;
      role?: "ADMIN" | "STAFF";
      isActive?: boolean;
    },
  ) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "Usuário não encontrado.");
    }

    if (input.email && input.email !== user.email) {
      const emailInUse = await prisma.user.findUnique({ where: { email: input.email } });
      if (emailInUse) {
        throw new AppError(409, "EMAIL_ALREADY_EXISTS", "Já existe usuário com este e-mail.");
      }
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id },
        data: {
          ...(input.nome !== undefined ? { name: input.nome } : {}),
          ...(input.email !== undefined ? { email: input.email } : {}),
          ...(input.telefone !== undefined ? { phone: input.telefone } : {}),
          ...(input.cpf !== undefined ? { cpf: input.cpf } : {}),
          ...(input.role !== undefined ? { role: input.role as UserRole } : {}),
          ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
        },
      });

      if (input.email || input.senha) {
        const account = await tx.account.findFirst({
          where: { userId: id, providerId: "credential" },
        });

        if (account) {
          await tx.account.update({
            where: { id: account.id },
            data: {
              ...(input.email ? { accountId: input.email } : {}),
              ...(input.senha ? { password: await bcrypt.hash(input.senha, 12) } : {}),
            },
          });
        }
      }

      return updated;
    });
  }

  async createPublicUser(input: {
    nome: string;
    email: string;
    senha: string;
    telefone?: string | null;
    cpf?: string | null;
    endereco?: string | null;
    cidade?: string | null;
    estado?: string | null;
  }) {
    const exists = await prisma.user.findUnique({ where: { email: input.email } });
    if (exists) {
      throw new AppError(409, "EMAIL_ALREADY_EXISTS", "Email já cadastrado.");
    }

    const hash = await bcrypt.hash(input.senha, 12);

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: input.nome,
          email: input.email,
          phone: input.telefone,
          cpf: input.cpf,
          endereco: input.endereco,
          cidade: input.cidade,
          estado: input.estado,
          role: "USER",
          isActive: true,
        },
      });

      await tx.account.create({
        data: {
          userId: user.id,
          providerId: "credential",
          accountId: input.email,
          password: hash,
        },
      });

      return user;
    });
  }

  listCollaborators() {
    return prisma.user.findMany({
      where: { role: { in: ["ADMIN", "STAFF"] } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        cpf: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async deleteCollaborator(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "Usuário não encontrado.");
    }

    if (user.role === "USER") {
      throw new AppError(400, "INVALID_TARGET", "Este usuário não é colaborador.");
    }

    await prisma.user.delete({ where: { id } });
    return true;
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        cpf: true,
        endereco: true,
        cidade: true,
        estado: true,
        role: true,
        image: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "Usuário não encontrado.");
    }

    return user;
  }

  async updateProfile(userId: string, input: {
    nome?: string;
    telefone?: string | null;
    cpf?: string | null;
    endereco?: string | null;
    cidade?: string | null;
    estado?: string | null;
    email?: string;
    senha?: string;
  }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "Usuário não encontrado.");
    }

    if (input.email && input.email !== user.email) {
      const emailInUse = await prisma.user.findUnique({ where: { email: input.email } });
      if (emailInUse) {
        throw new AppError(409, "EMAIL_ALREADY_EXISTS", "Já existe usuário com este e-mail.");
      }
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id: userId },
        data: {
          ...(input.nome !== undefined ? { name: input.nome } : {}),
          ...(input.telefone !== undefined ? { phone: input.telefone } : {}),
          ...(input.cpf !== undefined ? { cpf: input.cpf } : {}),
          ...(input.endereco !== undefined ? { endereco: input.endereco } : {}),
          ...(input.cidade !== undefined ? { cidade: input.cidade } : {}),
          ...(input.estado !== undefined ? { estado: input.estado } : {}),
          ...(input.email !== undefined ? { email: input.email } : {}),
        },
      });

      if (input.email || input.senha) {
        const account = await tx.account.findFirst({
          where: { userId, providerId: "credential" },
        });

        if (account) {
          await tx.account.update({
            where: { id: account.id },
            data: {
              ...(input.email ? { accountId: input.email } : {}),
              ...(input.senha ? { password: await bcrypt.hash(input.senha, 12) } : {}),
            },
          });
        }
      }

      return updated;
    });
  }
}