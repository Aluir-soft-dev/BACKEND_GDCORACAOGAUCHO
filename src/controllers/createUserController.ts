import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import { ok } from "../lib/http.js";

const service = new UserService();

export class CreateUserController {
  async create(req: Request, res: Response) {
    const user = await service.createPublicUser({
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha,
      telefone: req.body.telefone,
      cpf: req.body.cpf,
      endereco: req.body.endereco,
      cidade: req.body.cidade,
      estado: req.body.estado,
    });

    return res.status(201).json(
      ok(
        {
          id: user?.id,
          nome: user?.name,
          email: user?.email,
          role: user?.role,
        },
        "Usuário cadastrado com sucesso.",
      ),
    );
  }
}