export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Coração Gaúcho API",
    version: "2.2.0",
    description:
      "API completa do Coração Gaúcho com Better Auth, RBAC (ADMIN/STAFF/USER), Zod, Prisma e documentação Swagger.",
    contact: {
      name: "Suporte",
      email: "suporte@coracaogaucho.com",
    },
  },
  servers: [
    { url: "http://localhost:3333", description: "Desenvolvimento local" },
    { url: "https://api.coracaogaucho.com", description: "Produção" },
  ],
  tags: [
    { name: "Health", description: "Saúde da aplicação" },
    { name: "Auth", description: "Autenticação com Better Auth" },
    { name: "Loja / Minha Conta", description: "Área do usuário da loja (role USER)" },
    { name: "Perfil", description: "Gestão de perfil do usuário" },
    { name: "Categorias", description: "CRUD de categorias de produtos" },
    { name: "Produtos", description: "CRUD de produtos e gestão de estoque" },
    { name: "Eventos", description: "CRUD de eventos e próximos eventos" },
    { name: "Turmas", description: "CRUD de cursos/turmas e próximas turmas" },
    { name: "Colaboradores", description: "Gestão de colaboradores (ADMIN/STAFF)" },
    { name: "Checkout", description: "Checkout de eventos e cursos" },
    { name: "Ingressos", description: "Consulta e gestão de ingressos" },
    { name: "Inscrições", description: "Consulta de inscrições em cursos" },
    { name: "Listagem Pública", description: "Endpoints públicos de listagem" },
    { name: "Dashboard", description: "Indicadores administrativos" },
    { name: "Upload", description: "Upload de arquivos (imagens)" },
    { name: "AbacatePay", description: "Integração com AbacatePay para pagamentos" },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "better-auth.session_token",
        description: "Cookie de sessão Better Auth. Enviado automaticamente pelo navegador.",
      },
    },
    schemas: {
      UserRole: { type: "string", enum: ["ADMIN", "STAFF", "USER"], description: "Papel do usuário" },
      PublicUserSignUp: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "João da Silva" },
          email: { type: "string", format: "email", example: "joao@email.com" },
          password: { type: "string", minLength: 8, example: "Senha@123" },
          phone: { type: "string", nullable: true, example: "48999999999" },
          cpf: { type: "string", nullable: true, example: "12345678900" },
          endereco: { type: "string", nullable: true, example: "Rua A, 123" },
          cidade: { type: "string", nullable: true, example: "Florianópolis" },
          estado: { type: "string", nullable: true, example: "SC" },
        },
      },
      SignInEmail: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
        },
      },
      UpdateProfile: {
        type: "object",
        properties: {
          nome: { type: "string", example: "João da Silva" },
          telefone: { type: "string", nullable: true, example: "48999999999" },
          cpf: { type: "string", nullable: true, example: "12345678900" },
          endereco: { type: "string", nullable: true, example: "Rua A, 123" },
          cidade: { type: "string", nullable: true, example: "Florianópolis" },
          estado: { type: "string", nullable: true, example: "SC" },
          email: { type: "string", format: "email" },
          senha: { type: "string", minLength: 8 },
        },
      },
      CreateCollaborator: {
        type: "object",
        required: ["nome", "email", "senha", "role"],
        properties: {
          nome: { type: "string" },
          email: { type: "string", format: "email" },
          senha: { type: "string", minLength: 8 },
          telefone: { type: "string", nullable: true },
          cpf: { type: "string", nullable: true },
          role: { $ref: "#/components/schemas/UserRole" },
          isActive: { type: "boolean", example: true },
        },
      },
      UpdateCollaborator: {
        type: "object",
        properties: {
          nome: { type: "string" },
          email: { type: "string", format: "email" },
          telefone: { type: "string", nullable: true },
          cpf: { type: "string", nullable: true },
          role: { $ref: "#/components/schemas/UserRole" },
          isActive: { type: "boolean" },
        },
      },
      CategoriaInput: {
        type: "object",
        required: ["nome"],
        properties: { nome: { type: "string", example: "Bombacha" } },
      },
      ProdutoInput: {
        type: "object",
        required: ["nome", "preco"],
        properties: {
          nome: { type: "string", example: "Camiseta Oficial" },
          quantidade: { type: "integer", minimum: 0, example: 10 },
          preco: { type: "number", example: 79.9 },
          descricao: { type: "string", nullable: true },
          imagem: { type: "string", nullable: true },
          categoria: { type: "string", nullable: true },
          categoriaId: { type: "integer", nullable: true },
        },
      },
      EventoInput: {
        type: "object",
        required: ["nomeEvento", "local", "data"],
        properties: {
          nomeEvento: { type: "string" },
          local: { type: "string" },
          data: { type: "string", format: "date-time" },
          descricao: { type: "string", nullable: true },
          atracao: { type: "string", nullable: true },
          preco: { type: "number", nullable: true },
          imagens: { type: "array", items: { type: "string" } },
          status: { type: "string", example: "Ativo" },
        },
      },
      TurmaInput: {
        type: "object",
        required: ["nome", "local", "dataHora", "preco", "nivel"],
        properties: {
          nome: { type: "string" },
          local: { type: "string" },
          dataHora: { type: "string", format: "date-time" },
          descricao: { type: "string", nullable: true },
          preco: { type: "number" },
          nivel: { type: "string" },
          imagens: { type: "array", items: { type: "string" } },
        },
      },
      CheckoutEventoInput: {
        type: "object",
        required: ["eventoId"],
        properties: { eventoId: { type: "integer" } },
      },
      CheckoutCursoInput: {
        type: "object",
        required: ["turmaId"],
        properties: {
          turmaId: { type: "integer" },
        },
      },
      UpdateStatusInput: {
        type: "object",
        required: ["status"],
        properties: { status: { type: "string", example: "confirmado" } },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          code: { type: "string" },
        },
      },
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
          data: { type: "object" },
        },
      },
      CheckoutResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              compra: {
                type: "object",
                properties: {
                  usuario: { type: "object" },
                  evento: { type: "object" },
                  quantidade: { type: "integer" },
                  precoUnit: { type: "number" },
                  total: { type: "number" },
                },
              },
              ingressos: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    preco: { type: "number" },
                    qrcodeImage: { type: "string" },
                    status: { type: "string" },
                  },
                },
              },
              checkout: {
                type: "object",
                properties: {
                  checkoutUrl: { type: "string", description: "URL para redirecionar o usuário para o checkout hospedado do AbacatePay" },
                },
              },
            },
          },
        },
      },
      CheckoutCursoResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              inscricao: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  preco: { type: "number" },
                  qrcodeImage: { type: "string" },
                  status: { type: "string" },
                },
              },
              checkout: {
                type: "object",
                properties: {
                  checkoutUrl: { type: "string", description: "URL para redirecionar o usuário para o checkout hospedado do AbacatePay" },
                },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Verificar saúde da API",
        description: "Endpoint sem autenticação para verificar se a API está online",
        responses: {
          "200": {
            description: "API está online",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/sign-up/email": {
      post: {
        tags: ["Auth"],
        summary: "Registrar novo usuário",
        description: "Cria uma nova conta de usuário com role USER por padrão. Não requer autenticação.",
        requestBody: {
          required: true,
          description: "Dados do novo usuário",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PublicUserSignUp" },
            },
          },
        },
        responses: {
          "200": {
            description: "Usuário cadastrado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "409": {
            description: "E-mail já está cadastrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/sign-in/email": {
      post: {
        tags: ["Auth"],
        summary: "Fazer login",
        description: "Autentica um usuário e retorna um cookie de sessão",
        requestBody: {
          required: true,
          description: "Credenciais de login",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SignInEmail" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login efetuado com sucesso. Cookie de sessão será enviado.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "401": {
            description: "E-mail ou senha incorretos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/sign-out": {
      post: {
        tags: ["Auth"],
        summary: "Fazer logout",
        description: "Encerra a sessão atual do usuário",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Sessão encerrada com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "401": {
            description: "Não autenticado",
          },
        },
      },
    },
    "/api/auth/get-session": {
      get: {
        tags: ["Auth"],
        summary: "Obter sessão atual",
        description: "Retorna informações da sessão do usuário autenticado",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Dados da sessão",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "401": {
            description: "Não autenticado",
          },
        },
      },
    },
    "/api/minha-conta/resumo": {
      get: {
        tags: ["Loja / Minha Conta"],
        summary: "Resumo da conta",
        description: "Retorna um resumo da conta do usuário da loja (role USER)",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Resumo da conta",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "403": {
            description: "Disponível apenas para usuários com role USER",
          },
          "401": {
            description: "Não autenticado",
          },
        },
      },
    },
    "/api/minha-conta/perfil": {
      get: {
        tags: ["Loja / Minha Conta"],
        summary: "Buscar perfil da loja",
        description: "Retorna o perfil completo do usuário da loja",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Perfil do usuário",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "401": {
            description: "Não autenticado",
          },
        },
      },
    },
    "/api/minha-conta/perfil-put": {
      put: {
        tags: ["Loja / Minha Conta"],
        summary: "Atualizar perfil da loja",
        description: "Atualiza os dados do perfil do usuário da loja",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProfile" },
            },
          },
        },
        responses: {
          "200": {
            description: "Perfil atualizado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
          },
          "401": {
            description: "Não autenticado",
          },
        },
      },
    },
    "/api/minha-conta/compras": {
      get: {
        tags: ["Loja / Minha Conta"],
        summary: "Listar compras",
        description: "Lista todas as compras realizadas pelo usuário",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Compras listadas",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "401": {
            description: "Não autenticado",
          },
        },
      },
    },
    "/api/minha-conta/ingressos": {
      get: {
        tags: ["Loja / Minha Conta"],
        summary: "Listar ingressos",
        description: "Lista todos os ingressos comprados pelo usuário",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Ingressos listados",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "401": {
            description: "Não autenticado",
          },
        },
      },
    },
    "/api/minha-conta/ingressos/{id}": {
      get: {
        tags: ["Loja / Minha Conta"],
        summary: "Obter ingresso por ID",
        description: "Retorna um ingresso específico do usuário",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID do ingresso",
          },
        ],
        responses: {
          "200": {
            description: "Ingresso encontrado",
          },
          "401": {
            description: "Não autenticado",
          },
          "404": {
            description: "Ingresso não encontrado",
          },
        },
      },
    },
    "/api/minha-conta/inscricoes": {
      get: {
        tags: ["Loja / Minha Conta"],
        summary: "Listar inscrições",
        description: "Lista todas as inscrições em cursos do usuário",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Inscrições listadas",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "401": {
            description: "Não autenticado",
          },
        },
      },
    },
    "/api/minha-conta/inscricoes/{id}": {
      get: {
        tags: ["Loja / Minha Conta"],
        summary: "Obter inscrição por ID",
        description: "Retorna uma inscrição específica do usuário",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID da inscrição",
          },
        ],
        responses: {
          "200": {
            description: "Inscrição encontrada",
          },
          "401": {
            description: "Não autenticado",
          },
          "404": {
            description: "Inscrição não encontrada",
          },
        },
      },
    },
    "/api/usuario-perfil/me": {
      get: {
        tags: ["Perfil"],
        summary: "Obter meu perfil",
        description: "Retorna o perfil do usuário autenticado",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Perfil retornado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "401": {
            description: "Não autenticado",
          },
        },
      },
    },
    "/api/usuario-perfil/me-put": {
      put: {
        tags: ["Perfil"],
        summary: "Atualizar meu perfil",
        description: "Atualiza o perfil do usuário autenticado",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProfile" },
            },
          },
        },
        responses: {
          "200": {
            description: "Perfil atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
          },
          "401": {
            description: "Não autenticado",
          },
        },
      },
    },
    "/api/usuario-perfil/{userId}": {
      get: {
        tags: ["Perfil"],
        summary: "Obter perfil de usuário",
        description: "Retorna o perfil de um usuário específico. Apenas admins podem acessar perfis de outros usuários.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID do usuário",
          },
        ],
        responses: {
          "200": {
            description: "Perfil retornado",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Sem permissão",
          },
          "404": {
            description: "Usuário não encontrado",
          },
        },
      },
    },
    "/api/usuario-perfil/{userId}-put": {
      put: {
        tags: ["Perfil"],
        summary: "Atualizar perfil de usuário",
        description: "Atualiza o perfil de um usuário específico. Apenas admins podem atualizar perfis de outros usuários.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID do usuário",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProfile" },
            },
          },
        },
        responses: {
          "200": {
            description: "Perfil atualizado",
          },
          "400": {
            description: "Dados inválidos",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Sem permissão",
          },
          "404": {
            description: "Usuário não encontrado",
          },
        },
      },
    },
    "/api/categorias": {
      get: {
        tags: ["Categorias"],
        summary: "Listar categorias",
        description: "Lista todas as categorias de produtos. Endpoint público.",
        responses: {
          "200": {
            description: "Categorias listadas",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },
    "/api/categorias-post": {
      post: {
        tags: ["Categorias"],
        summary: "Criar categoria",
        description: "Cria uma nova categoria. Requer role ADMIN ou STAFF.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CategoriaInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Categoria criada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Sem permissão",
          },
        },
      },
    },
    "/api/produtos": {
      get: {
        tags: ["Produtos"],
        summary: "Listar produtos",
        description: "Lista todos os produtos. Endpoint público.",
        responses: {
          "200": {
            description: "Produtos listados",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },
    "/api/produtos/{id}": {
      get: {
        tags: ["Produtos"],
        summary: "Obter produto",
        description: "Retorna os detalhes de um produto específico",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID do produto",
          },
        ],
        responses: {
          "200": {
            description: "Produto encontrado",
          },
          "404": {
            description: "Produto não encontrado",
          },
        },
      },
    },
    "/api/produtos-post": {
      post: {
        tags: ["Produtos"],
        summary: "Criar produto",
        description: "Cria um novo produto. Requer role ADMIN ou STAFF.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProdutoInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Produto criado",
          },
          "400": {
            description: "Dados inválidos",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Sem permissão",
          },
        },
      },
    },
    "/api/produtos/{id}-put": {
      put: {
        tags: ["Produtos"],
        summary: "Atualizar produto",
        description: "Atualiza um produto existente. Requer role ADMIN ou STAFF.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID do produto",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProdutoInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Produto atualizado",
          },
          "400": {
            description: "Dados inválidos",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Sem permissão",
          },
          "404": {
            description: "Produto não encontrado",
          },
        },
      },
    },
    "/api/produtos/{id}-delete": {
      delete: {
        tags: ["Produtos"],
        summary: "Deletar produto",
        description: "Remove um produto. Requer role ADMIN ou STAFF.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID do produto",
          },
        ],
        responses: {
          "200": {
            description: "Produto removido",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Sem permissão",
          },
          "404": {
            description: "Produto não encontrado",
          },
        },
      },
    },
    "/api/eventos": {
      get: {
        tags: ["Eventos", "Listagem Pública"],
        summary: "Listar eventos",
        description: "Lista todos os eventos. Endpoint público.",
        responses: {
          "200": {
            description: "Eventos listados",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },
    "/api/eventos/{id}": {
      get: {
        tags: ["Eventos"],
        summary: "Obter evento",
        description: "Retorna os detalhes de um evento específico",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID do evento",
          },
        ],
        responses: {
          "200": {
            description: "Evento encontrado",
          },
          "404": {
            description: "Evento não encontrado",
          },
        },
      },
    },
    "/api/eventos/proximo": {
      get: {
        tags: ["Eventos"],
        summary: "Obter próximo evento",
        description: "Retorna o próximo evento programado",
        responses: {
          "200": {
            description: "Próximo evento",
          },
          "404": {
            description: "Nenhum evento programado",
          },
        },
      },
    },
    "/api/eventos-post": {
      post: {
        tags: ["Eventos"],
        summary: "Criar evento",
        description: "Cria um novo evento. Requer role ADMIN.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/EventoInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Evento criado",
          },
          "400": {
            description: "Dados inválidos",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Apenas ADMIN",
          },
        },
      },
    },
    "/api/eventos/{id}-put": {
      put: {
        tags: ["Eventos"],
        summary: "Atualizar evento",
        description: "Atualiza um evento existente. Requer role ADMIN.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID do evento",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/EventoInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Evento atualizado",
          },
          "400": {
            description: "Dados inválidos",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Apenas ADMIN",
          },
          "404": {
            description: "Evento não encontrado",
          },
        },
      },
    },
    "/api/eventos/{id}-delete": {
      delete: {
        tags: ["Eventos"],
        summary: "Deletar evento",
        description: "Remove um evento. Requer role ADMIN.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID do evento",
          },
        ],
        responses: {
          "200": {
            description: "Evento removido",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Apenas ADMIN",
          },
          "404": {
            description: "Evento não encontrado",
          },
        },
      },
    },
    "/api/cursos": {
      get: {
        tags: ["Listagem Pública", "Turmas"],
        summary: "Listar cursos",
        description: "Lista todos os cursos/turmas. Endpoint público.",
        responses: {
          "200": {
            description: "Cursos listados",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },
    "/api/turmas": {
      get: {
        tags: ["Turmas"],
        summary: "Listar turmas",
        description: "Lista todas as turmas",
        responses: {
          "200": {
            description: "Turmas listadas",
          },
        },
      },
    },
    "/api/turmas/{id}": {
      get: {
        tags: ["Turmas"],
        summary: "Obter turma",
        description: "Retorna os detalhes de uma turma específica",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID da turma",
          },
        ],
        responses: {
          "200": {
            description: "Turma encontrada",
          },
          "404": {
            description: "Turma não encontrada",
          },
        },
      },
    },
    "/api/turmas/proxima": {
      get: {
        tags: ["Turmas"],
        summary: "Obter próxima turma",
        description: "Retorna a próxima turma programada",
        responses: {
          "200": {
            description: "Próxima turma",
          },
          "404": {
            description: "Nenhuma turma programada",
          },
        },
      },
    },
    "/api/turmas-post": {
      post: {
        tags: ["Turmas"],
        summary: "Criar turma",
        description: "Cria uma nova turma. Requer role ADMIN ou STAFF.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TurmaInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Turma criada",
          },
          "400": {
            description: "Dados inválidos",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Sem permissão",
          },
        },
      },
    },
    "/api/turmas/{id}-put": {
      put: {
        tags: ["Turmas"],
        summary: "Atualizar turma",
        description: "Atualiza uma turma existente. Requer role ADMIN ou STAFF.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID da turma",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TurmaInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Turma atualizada",
          },
          "400": {
            description: "Dados inválidos",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Sem permissão",
          },
          "404": {
            description: "Turma não encontrada",
          },
        },
      },
    },
    "/api/turmas/{id}-delete": {
      delete: {
        tags: ["Turmas"],
        summary: "Deletar turma",
        description: "Remove uma turma. Requer role ADMIN ou STAFF.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID da turma",
          },
        ],
        responses: {
          "200": {
            description: "Turma removida",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Sem permissão",
          },
          "404": {
            description: "Turma não encontrada",
          },
        },
      },
    },
    "/api/colaboradores": {
      get: {
        tags: ["Colaboradores"],
        summary: "Listar colaboradores",
        description: "Lista todos os colaboradores. Requer role ADMIN.",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Colaboradores listados",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Apenas ADMIN",
          },
        },
      },
    },
    "/api/colaboradores/me": {
      get: {
        tags: ["Colaboradores"],
        summary: "Obter meus dados como colaborador",
        description: "Retorna os dados do colaborador autenticado. Requer role ADMIN ou STAFF.",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Dados do colaborador",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Sem permissão",
          },
        },
      },
    },
    "/api/colaboradores-post": {
      post: {
        tags: ["Colaboradores"],
        summary: "Criar colaborador",
        description: "Cria um novo colaborador. Requer role ADMIN.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCollaborator" },
            },
          },
        },
        responses: {
          "201": {
            description: "Colaborador criado",
          },
          "400": {
            description: "Dados inválidos",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Apenas ADMIN",
          },
        },
      },
    },
    "/api/colaboradores/{id}-put": {
      put: {
        tags: ["Colaboradores"],
        summary: "Atualizar colaborador",
        description: "Atualiza um colaborador existente. Requer role ADMIN.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID do colaborador",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateCollaborator" },
            },
          },
        },
        responses: {
          "200": {
            description: "Colaborador atualizado",
          },
          "400": {
            description: "Dados inválidos",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Apenas ADMIN",
          },
          "404": {
            description: "Colaborador não encontrado",
          },
        },
      },
    },
    "/api/colaboradores/{id}-delete": {
      delete: {
        tags: ["Colaboradores"],
        summary: "Deletar colaborador",
        description: "Remove um colaborador. Requer role ADMIN.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID do colaborador",
          },
        ],
        responses: {
          "200": {
            description: "Colaborador removido",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Apenas ADMIN",
          },
          "404": {
            description: "Colaborador não encontrado",
          },
        },
      },
    },
    "/api/checkout/evento": {
      post: {
        tags: ["Checkout"],
        summary: "Comprar ingresso de evento",
        description: "Realiza o checkout para compra de ingresso de um evento",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CheckoutEventoInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Checkout realizado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CheckoutResponse" },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
          },
          "401": {
            description: "Não autenticado",
          },
        },
      },
    },
    "/api/checkout/curso": {
      post: {
        tags: ["Checkout"],
        summary: "Comprar inscrição de curso",
        description: "Realiza o checkout para compra de inscrição em um curso",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CheckoutCursoInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Checkout realizado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CheckoutCursoResponse" },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
          },
          "401": {
            description: "Não autenticado",
          },
        },
      },
    },
    "/api/ingresso/{id}/status": {
      put: {
        tags: ["Checkout"],
        summary: "Atualizar status do ingresso",
        description: "Atualiza o status de um ingresso. Requer role ADMIN ou STAFF.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID do ingresso",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateStatusInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Status atualizado",
          },
          "400": {
            description: "Dados inválidos",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Sem permissão",
          },
          "404": {
            description: "Ingresso não encontrado",
          },
        },
      },
    },
    "/api/inscricao/{id}/status": {
      put: {
        tags: ["Checkout"],
        summary: "Atualizar status da inscrição",
        description: "Atualiza o status de uma inscrição. Requer role ADMIN ou STAFF.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID da inscrição",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateStatusInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Status atualizado",
          },
          "400": {
            description: "Dados inválidos",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Sem permissão",
          },
          "404": {
            description: "Inscrição não encontrada",
          },
        },
      },
    },
    "/api/ingressos/me": {
      get: {
        tags: ["Ingressos"],
        summary: "Listar meus ingressos",
        description: "Lista todos os ingressos do usuário autenticado",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Ingressos listados",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "401": {
            description: "Não autenticado",
          },
        },
      },
    },
    "/api/ingressos/usuario/{userId}": {
      get: {
        tags: ["Ingressos"],
        summary: "Listar ingressos de um usuário",
        description: "Lista os ingressos de um usuário específico. Apenas o próprio usuário ou admins podem acessar.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID do usuário",
          },
        ],
        responses: {
          "200": {
            description: "Ingressos listados",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Sem permissão",
          },
        },
      },
    },
    "/api/ingresso/{id}": {
      get: {
        tags: ["Ingressos"],
        summary: "Obter ingresso por ID",
        description: "Retorna os detalhes de um ingresso específico",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID do ingresso",
          },
        ],
        responses: {
          "200": {
            description: "Ingresso encontrado",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Sem permissão",
          },
          "404": {
            description: "Ingresso não encontrado",
          },
        },
      },
    },
    "/api/inscricoes/me": {
      get: {
        tags: ["Inscrições"],
        summary: "Listar minhas inscrições",
        description: "Lista todas as inscrições do usuário autenticado",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Inscrições listadas",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "401": {
            description: "Não autenticado",
          },
        },
      },
    },
    "/api/inscricoes/{userId}": {
      get: {
        tags: ["Inscrições"],
        summary: "Listar inscrições de um usuário",
        description: "Lista as inscrições de um usuário específico. Apenas o próprio usuário ou admins podem acessar.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID do usuário",
          },
        ],
        responses: {
          "200": {
            description: "Inscrições listadas",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Sem permissão",
          },
        },
      },
    },
    "/api/inscricao/{id}": {
      get: {
        tags: ["Inscrições"],
        summary: "Obter inscrição por ID",
        description: "Retorna os detalhes de uma inscrição específica",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID da inscrição",
          },
        ],
        responses: {
          "200": {
            description: "Inscrição encontrada",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Sem permissão",
          },
          "404": {
            description: "Inscrição não encontrada",
          },
        },
      },
    },
    "/api/eventos-public": {
      get: {
        tags: ["Listagem Pública"],
        summary: "Listar eventos públicos",
        description: "Lista todos os eventos em formato público. Sem autenticação necessária.",
        responses: {
          "200": {
            description: "Eventos listados",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },
    "/api/dashboard": {
      get: {
        tags: ["Dashboard"],
        summary: "Obter indicadores do dashboard",
        description: "Retorna indicadores e métricas administrativas. Requer autenticação.",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Indicadores retornados",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "401": {
            description: "Não autenticado",
          },
        },
      },
    },
    "/api/upload/single": {
      post: {
        tags: ["Upload"],
        summary: "Upload de arquivo único",
        description: "Realiza o upload de um arquivo único. Requer role ADMIN ou STAFF.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "Arquivo a ser enviado",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Upload realizado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "400": {
            description: "Arquivo não enviado",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Sem permissão",
          },
        },
      },
    },
    "/api/upload/multiple": {
      post: {
        tags: ["Upload"],
        summary: "Upload de múltiplos arquivos",
        description: "Realiza o upload de múltiplos arquivos. Requer role ADMIN ou STAFF.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["files"],
                properties: {
                  files: {
                    type: "array",
                    items: {
                      type: "string",
                      format: "binary",
                    },
                    description: "Arquivos a serem enviados",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Uploads realizados com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "400": {
            description: "Nenhum arquivo enviado",
          },
          "401": {
            description: "Não autenticado",
          },
          "403": {
            description: "Sem permissão",
          },
        },
      },
    },
    "/api/payments/abacatepay/webhook": {
      post: {
        tags: ["AbacatePay"],
        summary: "Webhook do AbacatePay",
        description: "Endpoint para receber notificações de pagamento do AbacatePay. Requer webhookSecret como query parameter.",
        parameters: [
          {
            name: "webhookSecret",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Segredo do webhook configurado no AbacatePay",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                description: "Payload do webhook enviado pelo AbacatePay",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Webhook processado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "401": {
            description: "webhookSecret inválido ou assinatura inválida",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
} as const;
