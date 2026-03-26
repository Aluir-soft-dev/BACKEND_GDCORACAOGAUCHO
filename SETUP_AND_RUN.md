# Guia de Setup e Execução da API Coração Gaúcho

## 📋 Pré-requisitos

- Node.js v18+ ou v20+
- npm ou yarn
- PostgreSQL (para banco de dados)
- Um navegador moderno

---

## 🚀 Instalação Inicial

### 1. Instalar Dependências

```bash
npm install
```

Ou com yarn:

```bash
yarn install
```

As dependências principais incluem:
- **Express** - Framework web
- **Better Auth** - Autenticação
- **Prisma** - ORM para banco de dados
- **Zod** - Validação de dados
- **Swagger UI Express** - Documentação interativa
- **Multer** - Upload de arquivos

---

## 🗄️ Configuração do Banco de Dados

### 1. Criar arquivo `.env`

Na raiz do projeto, crie um arquivo `.env` com as variáveis de ambiente:

```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/coracao_gaucho"

# Better Auth
BETTER_AUTH_SECRET="uma-chave-secreta-muito-segura-minimo-32-caracteres"

# CORS
CORS_ORIGIN="http://localhost:3000"

# Servidor
PORT=3333
NODE_ENV=development
```

### 2. Executar Migrations do Prisma

```bash
npm run prisma:migrate
```

Este comando:
- Cria as tabelas no banco de dados
- Atualiza o schema Prisma
- Gera o Prisma Client

### 3. (Opcional) Executar Seed

Para popular o banco com dados de exemplo:

```bash
npm run seed
```

---

## ▶️ Executar a API

### Modo Desenvolvimento

Com hot-reload automático:

```bash
npm run dev
```

A API estará disponível em: `http://localhost:3333`

### Modo Produção

Primeiro, fazer o build:

```bash
npm run build
```

Depois iniciar o servidor:

```bash
npm start
```

---

## 📚 Acessar a Documentação

### Swagger UI (Interativa)

Abra no navegador:

```
http://localhost:3333/docs
```

Aqui você pode:
- Visualizar todas as endpoints
- Ver exemplos de requisições
- Testar endpoints diretamente
- Ver respostas esperadas

### JSON OpenAPI

Acesse a especificação bruta:

```
http://localhost:3333/docs.json
```

---

## 🧪 Testando a API

### Usando o Swagger UI

1. Acesse `http://localhost:3333/docs`
2. Clique em **Authorize**
3. Faça login em `/api/auth/sign-in/email`
4. Use o token nos endpoints autenticados

### Usando cURL

#### Registrar usuário

```bash
curl -X POST http://localhost:3333/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "Senha@123"
  }'
```

#### Fazer login

```bash
curl -X POST http://localhost:3333/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "joao@email.com",
    "password": "Senha@123"
  }'
```

#### Listar eventos

```bash
curl http://localhost:3333/api/eventos
```

#### Criar evento (com autenticação)

```bash
curl -X POST http://localhost:3333/api/eventos \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "nomeEvento": "Festa do Divino",
    "local": "Praça Central",
    "data": "2025-06-15T20:00:00Z",
    "preco": 50.00,
    "status": "Ativo"
  }'
```

### Usando REST Client (VS Code)

1. Instale a extensão **REST Client** (humao.rest-client)
2. Abra o arquivo `API_REQUESTS.http`
3. Clique em **Send Request** acima de cada requisição
4. Veja a resposta no painel lateral

---

## 📂 Estrutura de Arquivos

```
src/
├── app.ts                    # Configuração Express
├── server.ts                 # Inicialização servidor
├── docs/
│   └── openapi.ts           # Documentação Swagger
├── lib/
│   ├── auth.ts              # Configuração Better Auth
│   ├── password.ts          # Utilitários senha
│   ├── permissions.ts       # Gestão permissões
│   └── prisma.ts            # Cliente Prisma
├── middlewares/
│   ├── auth.ts              # Autenticação
│   ├── errorHandler.ts      # Tratamento erros
│   ├── requireRole.ts       # Verificação role
│   ├── ownership.ts         # Verificação ownership
│   ├── upload.ts            # Multer config
│   └── validate.ts          # Validação Zod
├── routes/
│   ├── index.ts             # Router principal
│   ├── auth.ts              # Rotas auth
│   ├── produtos.ts          # Rotas produtos
│   ├── eventos.ts           # Rotas eventos
│   ├── turmas.ts            # Rotas turmas
│   ├── checkout.ts          # Rotas checkout
│   └── ...                  # Outras rotas
├── controllers/
│   ├── produtosController.ts
│   ├── eventosController.ts
│   ├── turmasController.ts
│   ├── checkoutEventoController.ts
│   └── ...                  # Outros controllers
├── services/
│   ├── produto.service.ts
│   ├── evento.service.ts
│   ├── turma.service.ts
│   └── ...                  # Outros services
├── schemas/
│   ├── produto.schema.ts    # Validação Zod
│   ├── evento.schema.ts
│   └── ...                  # Outros schemas
└── types/
    └── express.d.ts         # Tipos Express

prisma/
├── schema.prisma            # Schema banco dados
└── seed.ts                  # Script seed

uploads/
└── qr/                      # Uploads QR codes
```

---

## 🔑 Variáveis de Ambiente

### Obrigatórias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL conexão PostgreSQL | `postgresql://user:pass@localhost/db` |
| `BETTER_AUTH_SECRET` | Chave secreta Better Auth | Mínimo 32 caracteres |

### Opcionais

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta servidor | `3333` |
| `NODE_ENV` | Ambiente execução | `development` |
| `CORS_ORIGIN` | Origem CORS permitida | `http://localhost:3000` |

---

## 📱 Scripts Disponíveis

```json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "seed": "tsx prisma/seed.ts"
}
```

### Explicação

- **dev** - Inicia servidor em modo desenvolvimento com hot-reload
- **build** - Compila TypeScript para JavaScript
- **start** - Inicia servidor em modo produção
- **prisma:generate** - Gera cliente Prisma
- **prisma:migrate** - Cria/aplica migrations
- **seed** - Popula banco com dados iniciais

---

## 🔐 Segurança

### Configurações Implementadas

1. **Helmet** - Headers segurança HTTP
2. **CORS** - Controle cross-origin
3. **Cookie HTTP-only** - Cookies seguros
4. **Bcrypt** - Hash de senhas
5. **Validação Zod** - Validação entrada
6. **RBAC** - Controle acesso baseado papéis
7. **Rate limiting** - (Recomendado adicionar)

### Recomendações

- Usar HTTPS em produção
- Manter `CORS_ORIGIN` configurado corretamente
- Usar senha forte para `BETTER_AUTH_SECRET`
- Configurar variáveis de ambiente seguuras
- Implementar rate limiting
- Manter dependências atualizadas

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"

```bash
npm install
npm run prisma:generate
```

### Erro: "Database connection failed"

Verifique:
1. PostgreSQL está rodando
2. `DATABASE_URL` está correta
3. Banco de dados existe

### Erro: "Port already in use"

Mude a porta em `.env`:

```env
PORT=3334
```

### Erro: "Migration pending"

Aplique migrations:

```bash
npm run prisma:migrate
```

### Swagger não funciona

Verifique:
1. Servidor está rodando
2. Arquivo `openapi.ts` está correto
3. Limpe cache do navegador

---

## 📝 Logs e Debug

### Habilitar Logs Prisma

Adicione ao `.env`:

```env
DEBUG=@prisma:*
```

### Logs Estruturados

A API utiliza console nativo. Para melhor logging em produção, considere:

- Winston
- Pino
- Bunyan

---

## 🚢 Deploy

### Heroku

```bash
heroku create seu-app-name
heroku config:set DATABASE_URL=postgresql://...
heroku config:set BETTER_AUTH_SECRET=sua-chave-secreta
git push heroku main
```

### Vercel

Crie `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "src/server.ts" }
  ]
}
```

### Docker

Crie `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3333

CMD ["npm", "start"]
```

---

## 📊 Monitoramento

### Health Check

```bash
curl http://localhost:3333/health
```

### Banco de Dados

Abra Prisma Studio:

```bash
npx prisma studio
```

---

## 📖 Documentação Adicional

- [OpenAPI 3.0 Spec](https://spec.openapis.org/oas/v3.0.3)
- [Better Auth Docs](https://better-auth.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Express Docs](https://expressjs.com)
- [Zod Docs](https://zod.dev)

---

## 💬 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação Swagger: `/docs`
2. Consulte este guia: `SETUP_AND_RUN.md`
3. Veja exemplos em: `API_REQUESTS.http`
4. Leia documentação completa: `API_DOCUMENTATION.md`

---

**Última atualização:** Março 2025
