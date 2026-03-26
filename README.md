# Coração Gaúcho Backend Moderno

Backend refatorado com:
- Better Auth
- Prisma
- RBAC (ADMIN, STAFF, USER)
- Zod
- Swagger
- Express + TypeScript + ESM

## Endpoints principais

- Swagger UI: `/docs`
- OpenAPI JSON: `/docs.json`
- Better Auth: `/api/auth/*`
- Loja / Minha Conta: `/api/minha-conta/*`

## Cadastro e login da loja

O cadastro do usuário final da loja deve ser feito pelo Better Auth:
- `POST /api/auth/sign-up/email`
- `POST /api/auth/sign-in/email`
- login social com Google e Facebook via Better Auth

Os usuários criados pela loja entram com `role = USER` por padrão.

## Instalação

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

## Observações

- Rotas administrativas exigem sessão válida.
- STAFF pode operar produtos, turmas, estoque e inscrições.
- Somente ADMIN pode gerenciar colaboradores e eventos.
- USER só acessa sua própria área da loja.

## AbacatePay

Integração adicionada com:
- criação de checkout hospedado PIX e Cartão nas rotas de checkout existentes
- retorno de `checkout.checkoutUrl` para o frontend redirecionar
- webhook em `POST /api/payments/abacatepay/webhook?webhookSecret=SEU_SECRET`
- confirmação automática de ingressos e inscrições via webhook

Após preencher o `.env`, rode:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name add_payment_record
npm run dev
```
