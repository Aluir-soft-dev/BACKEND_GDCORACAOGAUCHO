import fs from "node:fs";
import path from "node:path";
import QRCode from "qrcode";
import { randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/http.js";
import { AbacatePayService } from "./abacatepay.service.js";

const abacatepay = new AbacatePayService();

export class CheckoutService {
  private ensureQrFolder() {
    const folder = path.resolve(process.cwd(), "uploads", "qr");
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    return folder;
  }

  async criarIngressos(input: {
    userId: string;
    eventoId: number;
    quantidade: number;
    portadores?: Array<{ nome: string; cpf?: string | null }>;
    precoUnit?: number;
  }) {
    const user = await prisma.user.findUnique({ where: { id: input.userId } });
    if (!user) throw new AppError(404, "USER_NOT_FOUND", "Usuário não encontrado.");

    const evento = await prisma.evento.findUnique({ where: { id: input.eventoId } });
    if (!evento) throw new AppError(404, "EVENT_NOT_FOUND", "Evento não encontrado.");

    const preco = input.precoUnit ?? evento.preco ?? 0;
    if (preco <= 0) throw new AppError(400, "INVALID_PRICE", "Preço do ingresso inválido.");

    const folder = this.ensureQrFolder();
    const ingressos = await prisma.$transaction(async (tx) => {
      const results: any[] = [];

      for (let i = 0; i < input.quantidade; i++) {
        const qrcodeId = randomUUID();
        const payload = JSON.stringify({ type: "ingresso", eventoId: input.eventoId, userId: input.userId, qrcodeId });
        const fileName = `${qrcodeId}.png`;
        const filePath = path.join(folder, fileName);
        await QRCode.toFile(filePath, payload);

        const ingresso = await tx.ingresso.create({
          data: {
            preco,
            qrcode: qrcodeId,
            userId: input.userId,
            eventoId: input.eventoId,
            status: "PENDENTE",
          },
          include: { usuario: true, evento: true },
        });

        results.push({ ingresso, qrcodeImage: `/uploads/qr/${fileName}`, portador: input.portadores?.[i] ?? null });
      }
      return results;
    });

    const checkout = await abacatepay.createEventoCheckout({
      userId: input.userId,
      ingressos: ingressos.map((item) => ({ id: item.ingresso.id, preco: item.ingresso.preco, evento: { nomeEvento: item.ingresso.evento.nomeEvento } })),
      user: { name: user.name, email: user.email, phone: user.phone, cpf: user.cpf },
    });

    return {
      compra: {
        usuario: user,
        evento,
        quantidade: input.quantidade,
        precoUnit: preco,
        total: preco * input.quantidade,
      },
      ingressos,
      checkout,
    };
  }

  async criarInscricao(input: { userId: string; turmaId: number }) {
    const user = await prisma.user.findUnique({ where: { id: input.userId } });
    if (!user) throw new AppError(404, "USER_NOT_FOUND", "Usuário não encontrado.");

    const turma = await prisma.turma.findUnique({ where: { id: input.turmaId } });
    if (!turma) throw new AppError(404, "CLASS_NOT_FOUND", "Turma não encontrada.");

    const duplicate = await prisma.inscricao.findUnique({ where: { userId_turmaId: { userId: input.userId, turmaId: input.turmaId } } });
    if (duplicate) throw new AppError(409, "ALREADY_ENROLLED", "Você já está inscrito nesta turma.");

    const folder = this.ensureQrFolder();
    const qrcodeId = randomUUID();
    const payload = JSON.stringify({ type: "inscricao", turmaId: input.turmaId, userId: input.userId, qrcodeId });
    const fileName = `${qrcodeId}.png`;
    const filePath = path.join(folder, fileName);
    await QRCode.toFile(filePath, payload);

    const inscricao = await prisma.inscricao.create({
      data: {
        dataHora: turma.dataHora,
        preco: turma.preco,
        local: turma.local,
        descricao: turma.descricao,
        userId: input.userId,
        turmaId: input.turmaId,
        jaFoiAluno: false,
        status: "PENDENTE",
        qrcode: qrcodeId,
      },
      include: { usuario: true, turma: true },
    });

    const checkout = await abacatepay.createCursoCheckout({
      userId: input.userId,
      inscricao: { id: inscricao.id, preco: inscricao.preco, turma: { nome: inscricao.turma.nome } },
      user: { name: user.name, email: user.email, phone: user.phone, cpf: user.cpf },
    });

    return { inscricao, qrcodeImage: `/uploads/qr/${fileName}`, checkout };
  }

  async atualizarStatusIngresso(id: number, status: "DISPONIVEL" | "PENDENTE" | "CANCELADO") {
    return prisma.ingresso.update({ where: { id }, data: { status } });
  }

  async atualizarStatusInscricao(id: number, status: "PENDENTE" | "CONFIRMADA" | "CANCELADA") {
    return prisma.inscricao.update({ where: { id }, data: { status } });
  }
}
