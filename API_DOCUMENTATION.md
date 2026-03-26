# Documentação da API Coração Gaúcho

## 📋 Visão Geral

Documentação completa da API do Coração Gaúcho, um sistema de gerenciamento de eventos, cursos e vendas com autenticação baseada em Better Auth.

**Versão:** 2.2.0  
**Base URL:** `http://localhost:3333` (desenvolvimento) ou `https://api.coracaogaucho.com` (produção)  
**Documentação Swagger:** `/docs`

---

## 🔐 Autenticação

A API utiliza **Better Auth** com autenticação por cookie HTTP-only.

### Fluxo de Autenticação

1. Usuário se registra em `/api/auth/sign-up/email` (role USER)
2. Usuário faz login em `/api/auth/sign-in/email`
3. Servidor retorna um cookie `better-auth.session_token`
4. Cookie é enviado automaticamente em requisições subsequentes
5. Usuário faz logout em `/api/auth/sign-out`

### Papéis (Roles)

A API implementa controle de acesso baseado em papéis (RBAC):

| Papel | Descrição | Acesso |
|-------|-----------|--------|
| **USER** | Usuário regular da loja | Compras, ingressos, inscrições, perfil |
| **STAFF** | Membro do staff | Criar/editar eventos, turmas, produtos, colaboradores |
| **ADMIN** | Administrador | Acesso total a todas as funcionalidades |

---

## 📁 Estrutura de Endpoints

### 🏥 Health Check

```http
GET /health
```

Verifica se a API está online.

**Resposta:** `200 OK`
```json
{
  "success": true,
  "message": "API online"
}
```

---

## � AbacatePay - Integração de Pagamentos

A API integra o AbacatePay para processamento de pagamentos PIX e cartão de crédito.

### Webhook de Pagamento

```http
POST /api/payments/abacatepay/webhook?webhookSecret=SEU_SECRET
Content-Type: application/json
X-Webhook-Signature: assinatura
```

**Descrição:** Endpoint para receber notificações de status de pagamento do AbacatePay.

**Parâmetros de Query:**
- `webhookSecret` (string, obrigatório): Segredo configurado no painel do AbacatePay

**Headers:**
- `X-Webhook-Signature` (string, opcional): Assinatura para verificação de integridade

**Resposta:** `200 OK`
```json
{
  "success": true,
  "message": "Webhook processado.",
  "data": { ... }
}
```

---

## �🔐 Autenticação (Auth)

### Registrar Novo Usuário

```http
POST /api/auth/sign-up/email
Content-Type: application/json
```

**Body:**
```json
{
  "name": "João da Silva",
  "email": "joao@email.com",
  "password": "Senha@123",
  "phone": "48999999999",
  "cpf": "12345678900",
  "endereco": "Rua A, 123",
  "cidade": "Florianópolis",
  "estado": "SC"
}
```

**Resposta:** `200 OK`
- Cria usuário com role **USER** por padrão
- Retorna cookie de sessão

---

### Fazer Login

```http
POST /api/auth/sign-in/email
Content-Type: application/json
```

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "Senha@123"
}
```

**Resposta:** `200 OK`
- Retorna cookie `better-auth.session_token`

---

### Fazer Logout

```http
POST /api/auth/sign-out
Cookie: better-auth.session_token=...
```

**Resposta:** `200 OK`
- Encerra a sessão atual

---

### Obter Sessão Atual

```http
GET /api/auth/get-session
Cookie: better-auth.session_token=...
```

**Resposta:** `200 OK`
```json
{
  "success": true,
  "message": "Sessão atual",
  "data": {
    "user": {
      "id": "user123",
      "name": "João",
      "email": "joao@email.com",
      "role": "USER"
    }
  }
}
```

---

## 🛒 Loja / Minha Conta

Endpoints para usuários da loja (role **USER**).

### Resumo da Conta

```http
GET /api/minha-conta/resumo
Cookie: better-auth.session_token=...
```

Retorna um resumo com:
- Compras recentes
- Ingressos ativos
- Inscrições
- Informações do perfil

---

### Obter Perfil

```http
GET /api/minha-conta/perfil
Cookie: better-auth.session_token=...
```

---

### Atualizar Perfil

```http
PUT /api/minha-conta/perfil
Cookie: better-auth.session_token=...
Content-Type: application/json
```

**Body:**
```json
{
  "nome": "João da Silva",
  "telefone": "48999999999",
  "cpf": "12345678900",
  "endereco": "Rua B, 456",
  "cidade": "Florianópolis",
  "estado": "SC",
  "email": "joao@email.com",
  "senha": "NovaSenha@123"
}
```

---

### Listar Compras

```http
GET /api/minha-conta/compras
Cookie: better-auth.session_token=...
```

---

### Listar Ingressos

```http
GET /api/minha-conta/ingressos
Cookie: better-auth.session_token=...
```

### Obter Ingresso por ID

```http
GET /api/minha-conta/ingressos/{id}
Cookie: better-auth.session_token=...
```

---

### Listar Inscrições

```http
GET /api/minha-conta/inscricoes
Cookie: better-auth.session_token=...
```

### Obter Inscrição por ID

```http
GET /api/minha-conta/inscricoes/{id}
Cookie: better-auth.session_token=...
```

---

## 👤 Gestão de Perfil

### Obter Meu Perfil

```http
GET /api/usuario-perfil/me
Cookie: better-auth.session_token=...
```

---

### Atualizar Meu Perfil

```http
PUT /api/usuario-perfil/me
Cookie: better-auth.session_token=...
Content-Type: application/json
```

---

### Obter Perfil de Outro Usuário

```http
GET /api/usuario-perfil/{userId}
Cookie: better-auth.session_token=...
```

**Restrições:** Apenas o próprio usuário ou ADMINs podem acessar.

---

### Atualizar Perfil de Outro Usuário

```http
PUT /api/usuario-perfil/{userId}
Cookie: better-auth.session_token=...
```

**Restrições:** Apenas ADMINs podem fazer isso.

---

## 🏷️ Categorias

### Listar Categorias

```http
GET /api/categorias
```

Endpoint público. Lista todas as categorias de produtos.

---

### Criar Categoria

```http
POST /api/categorias
Cookie: better-auth.session_token=...
Content-Type: application/json
```

**Requer:** Role ADMIN ou STAFF

**Body:**
```json
{
  "nome": "Bombacha"
}
```

**Resposta:** `201 Created`

---

## 📦 Produtos

### Listar Produtos

```http
GET /api/produtos
```

Endpoint público.

---

### Obter Produto

```http
GET /api/produtos/{id}
```

---

### Criar Produto

```http
POST /api/produtos
Cookie: better-auth.session_token=...
Content-Type: application/json
```

**Requer:** Role ADMIN ou STAFF

**Body:**
```json
{
  "nome": "Camiseta Oficial",
  "quantidade": 10,
  "preco": 79.90,
  "descricao": "Camiseta oficial do Coração Gaúcho",
  "imagem": "URL ou path da imagem",
  "categoria": "Vestuário",
  "categoriaId": 1
}
```

---

### Atualizar Produto

```http
PUT /api/produtos/{id}
Cookie: better-auth.session_token=...
Content-Type: application/json
```

**Requer:** Role ADMIN ou STAFF

---

### Deletar Produto

```http
DELETE /api/produtos/{id}
Cookie: better-auth.session_token=...
```

**Requer:** Role ADMIN ou STAFF

---

## 🎉 Eventos

### Listar Eventos

```http
GET /api/eventos
```

Endpoint público.

---

### Obter Próximo Evento

```http
GET /api/eventos/proximo
```

---

### Obter Evento

```http
GET /api/eventos/{id}
```

---

### Criar Evento

```http
POST /api/eventos
Cookie: better-auth.session_token=...
Content-Type: application/json
```

**Requer:** Role ADMIN

**Body:**
```json
{
  "nomeEvento": "Festa do Divino",
  "local": "Praça Central",
  "data": "2024-06-15T20:00:00Z",
  "descricao": "Celebração tradicional gaúcha",
  "atracao": "Banda Tradicional",
  "preco": 50.00,
  "imagens": ["URL da imagem 1", "URL da imagem 2"],
  "status": "Ativo"
}
```

---

### Atualizar Evento

```http
PUT /api/eventos/{id}
Cookie: better-auth.session_token=...
Content-Type: application/json
```

**Requer:** Role ADMIN

---

### Deletar Evento

```http
DELETE /api/eventos/{id}
Cookie: better-auth.session_token=...
```

**Requer:** Role ADMIN

---

## 🎓 Turmas/Cursos

### Listar Turmas

```http
GET /api/turmas
```

Endpoint público.

---

### Listar Cursos

```http
GET /api/cursos
```

Endpoint público (mesmo que turmas).

---

### Obter Próxima Turma

```http
GET /api/turmas/proxima
```

---

### Obter Turma

```http
GET /api/turmas/{id}
```

---

### Criar Turma

```http
POST /api/turmas
Cookie: better-auth.session_token=...
Content-Type: application/json
```

**Requer:** Role ADMIN ou STAFF

**Body:**
```json
{
  "nome": "Aula de Dança Gaúcha",
  "local": "Salão Cultural",
  "dataHora": "2024-06-20T19:00:00Z",
  "descricao": "Aprenda os passos da cultura gaúcha",
  "preco": 100.00,
  "nivel": "Iniciante",
  "imagens": ["URL da imagem 1"]
}
```

---

### Atualizar Turma

```http
PUT /api/turmas/{id}
Cookie: better-auth.session_token=...
Content-Type: application/json
```

**Requer:** Role ADMIN ou STAFF

---

### Deletar Turma

```http
DELETE /api/turmas/{id}
Cookie: better-auth.session_token=...
```

**Requer:** Role ADMIN ou STAFF

---

## 👥 Colaboradores

### Listar Colaboradores

```http
GET /api/colaboradores
Cookie: better-auth.session_token=...
```

**Requer:** Role ADMIN

---

### Obter Meus Dados como Colaborador

```http
GET /api/colaboradores/me
Cookie: better-auth.session_token=...
```

**Requer:** Role ADMIN ou STAFF

---

### Criar Colaborador

```http
POST /api/colaboradores
Cookie: better-auth.session_token=...
Content-Type: application/json
```

**Requer:** Role ADMIN

**Body:**
```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "senha": "SenhaForte@123",
  "telefone": "48999999999",
  "cpf": "12345678900",
  "role": "STAFF",
  "isActive": true
}
```

---

### Atualizar Colaborador

```http
PUT /api/colaboradores/{id}
Cookie: better-auth.session_token=...
Content-Type: application/json
```

**Requer:** Role ADMIN

**Body:**
```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "telefone": "48999999999",
  "cpf": "12345678900",
  "role": "ADMIN",
  "isActive": true
}
```

---

### Deletar Colaborador

```http
DELETE /api/colaboradores/{id}
Cookie: better-auth.session_token=...
```

**Requer:** Role ADMIN

---

## 💳 Checkout

### Comprar Ingresso de Evento

```http
POST /api/checkout/evento
Cookie: better-auth.session_token=...
Content-Type: application/json
```

**Body:**
```json
{
  "eventoId": 1
}
```

**Resposta:** `200 OK`
- Cria registro de ingresso
- Retorna detalhes da compra

---

### Comprar Inscrição de Curso

```http
POST /api/checkout/curso
Cookie: better-auth.session_token=...
Content-Type: application/json
```

**Body:**
```json
{
  "turmaId": 1,
  "jaFoiAluno": false
}
```

**Resposta:** `200 OK`
- Cria registro de inscrição

---

### Atualizar Status do Ingresso

```http
PUT /api/ingresso/{id}/status
Cookie: better-auth.session_token=...
Content-Type: application/json
```

**Requer:** Role ADMIN ou STAFF

**Body:**
```json
{
  "status": "confirmado"
}
```

---

### Atualizar Status da Inscrição

```http
PUT /api/inscricao/{id}/status
Cookie: better-auth.session_token=...
Content-Type: application/json
```

**Requer:** Role ADMIN ou STAFF

**Body:**
```json
{
  "status": "confirmado"
}
```

---

## 🎟️ Ingressos

### Listar Meus Ingressos

```http
GET /api/ingressos/me
Cookie: better-auth.session_token=...
```

---

### Listar Ingressos de um Usuário

```http
GET /api/ingressos/usuario/{userId}
Cookie: better-auth.session_token=...
```

**Restrições:** Apenas o próprio usuário ou ADMINs.

---

### Obter Ingresso por ID

```http
GET /api/ingresso/{id}
Cookie: better-auth.session_token=...
```

---

## 📋 Inscrições

### Listar Minhas Inscrições

```http
GET /api/inscricoes/me
Cookie: better-auth.session_token=...
```

---

### Listar Inscrições de um Usuário

```http
GET /api/inscricoes/{userId}
Cookie: better-auth.session_token=...
```

**Restrições:** Apenas o próprio usuário ou ADMINs.

---

### Obter Inscrição por ID

```http
GET /api/inscricao/{id}
Cookie: better-auth.session_token=...
```

---

## 📊 Dashboard

### Obter Indicadores Administrativos

```http
GET /api/dashboard
Cookie: better-auth.session_token=...
```

Retorna:
- Total de eventos
- Total de cursos
- Total de usuários
- Receita total
- Eventos próximos
- Turmas próximas

---

## 📤 Upload

### Upload Único

```http
POST /api/upload/single
Cookie: better-auth.session_token=...
Content-Type: multipart/form-data
```

**Requer:** Role ADMIN ou STAFF

**Exemplo com curl:**
```bash
curl -X POST http://localhost:3333/api/upload/single \
  -H "Cookie: better-auth.session_token=..." \
  -F "file=@imagem.jpg"
```

**Resposta:** `200 OK`
```json
{
  "success": true,
  "message": "Upload realizado com sucesso!",
  "data": {
    "file": { ... },
    "url": "/uploads/imagem-123.jpg"
  }
}
```

---

### Upload Múltiplo

```http
POST /api/upload/multiple
Cookie: better-auth.session_token=...
Content-Type: multipart/form-data
```

**Requer:** Role ADMIN ou STAFF

**Exemplo com curl:**
```bash
curl -X POST http://localhost:3333/api/upload/multiple \
  -H "Cookie: better-auth.session_token=..." \
  -F "files=@imagem1.jpg" \
  -F "files=@imagem2.jpg"
```

---

## 🏷️ Listagem Pública

Endpoints públicos para listar eventos e cursos.

### Listar Eventos Públicos

```http
GET /api/eventos
```

### Listar Cursos Públicos

```http
GET /api/cursos
```

---

## 📝 Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | Sucesso (GET, PUT) |
| 201 | Criado com sucesso (POST) |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Não autorizado |
| 404 | Não encontrado |
| 409 | Conflito (ex: email duplicado) |
| 500 | Erro interno do servidor |

---

## 🔍 Exemplo de Fluxo Completo

### 1. Registrar Novo Usuário

```bash
curl -X POST http://localhost:3333/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "Senha@123"
  }'
```

### 2. Fazer Login

```bash
curl -X POST http://localhost:3333/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "joao@email.com",
    "password": "Senha@123"
  }'
```

### 3. Listar Eventos

```bash
curl -X GET http://localhost:3333/api/eventos
```

### 4. Comprar Ingresso

```bash
curl -X POST http://localhost:3333/api/checkout/evento \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "eventoId": 1
  }'
```

### 5. Listar Meus Ingressos

```bash
curl -X GET http://localhost:3333/api/ingressos/me \
  -b cookies.txt
```

### 6. Fazer Logout

```bash
curl -X POST http://localhost:3333/api/auth/sign-out \
  -b cookies.txt
```

---

## 🛠️ Acessar Documentação Swagger

Abra seu navegador e acesse:

```
http://localhost:3333/docs
```

Ou obtenha o JSON OpenAPI:

```
http://localhost:3333/docs.json
```

---

## ⚠️ Tratamento de Erros

### Erro de Validação

```json
{
  "success": false,
  "message": "Dados inválidos",
  "code": "VALIDATION_ERROR"
}
```

### Erro de Autenticação

```json
{
  "success": false,
  "message": "Não autenticado",
  "code": "UNAUTHORIZED"
}
```

### Erro de Autorização

```json
{
  "success": false,
  "message": "Sem permissão",
  "code": "FORBIDDEN"
}
```

### Erro de Recurso Não Encontrado

```json
{
  "success": false,
  "message": "Recurso não encontrado",
  "code": "NOT_FOUND"
}
```

---

## 📞 Contato e Suporte

Para dúvidas ou sugestões sobre a API:

- **Email:** suporte@coracaogaucho.com
- **Documentação:** `/docs` (Swagger UI)
- **JSON OpenAPI:** `/docs.json`

---

## 📝 Notas Importantes

1. **Todas as requisições autenticadas** devem incluir o cookie `better-auth.session_token`
2. **IDs de usuários** são strings no formato de UUID
3. **Data e hora** devem estar no formato ISO 8601 (UTC)
4. **Preços** são números decimais
5. **Validação Zod** é aplicada a todos os inputs
6. **RBAC** é enforçado em middlewares
7. **Uploads** são salvos em `/uploads/`

---

**Última atualização:** Março 2025  
**Versão da API:** 2.1.0
