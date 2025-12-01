# 🔗 Macondo Link Manager (API)

> **Uma plataforma robusta de gerenciamento e encurtamento de links com analytics integrado.**

O **Macondo Link Manager** é uma solução interna desenvolvida para a agência _Macondo Propaganda_, permitindo que a equipe crie links curtos personalizados, gerencie campanhas de marketing e acompanhe métricas de engajamento em tempo real.

Este repositório contém o **Back-end (API RESTful)** da aplicação, construído com foco em performance, tipagem estrita e escalabilidade.

---

## 🚀 Tecnologias & Ferramentas

O projeto foi desenvolvido utilizando as melhores práticas do ecossistema Node.js moderno:

- **Runtime:** [Node.js](https://nodejs.org/) (LTS)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Framework:** [Fastify](https://www.fastify.io/) (Alta performance e baixo overhead)
- **ORM:** [Prisma](https://www.prisma.io/) (PostgreSQL)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **Infraestrutura:** [Docker](https://www.docker.com/) & Docker Compose
- **Validação:** [Zod](https://zod.dev/) (Schema validation & Type inference)
- **Documentação:** [Swagger / OpenAPI](https://swagger.io/) (Gerada automaticamente via Zod)
- **Autenticação:** OAuth 2.0 (Google) & JWT (Cookies httpOnly)

---

## 🏛️ Arquitetura & Design Patterns

A aplicação segue uma arquitetura limpa e desacoplada para garantir manutenibilidade e testabilidade:

- **Repository Pattern:** Abstração da camada de dados (Prisma), permitindo a troca de ORM ou banco de dados com impacto mínimo.
- **Service Pattern:** Isolamento total das regras de negócio (Business Logic), independente de rotas ou frameworks HTTP.
- **Dependency Injection:** Injeção de dependências nos serviços para facilitar testes unitários.
- **SOLID:** Aplicação dos princípios, especialmente _Single Responsibility_ e _Dependency Inversion_.
- **Type Safety:** Tipagem estática de ponta a ponta, do banco de dados (Prisma) à validação de entrada (Zod) e resposta da API.

---

## ✨ Funcionalidades Principais

### 🔐 Autenticação & Segurança

- Login via **Google OAuth 2.0** (Restrito aos domínios da organização).
- Gestão de sessão via **JWT** armazenado em cookies seguros (`httpOnly`, `Secure`, `SameSite`).
- **Hooks de Proteção** globais para rotas privadas.

### 🔗 Gerenciamento de Links

- Criação de links encurtados com **ShortCode** único (geração automática e colisão tratada).
- Associação de links a **Clientes** e **Campanhas**.
- Sistema de **Tags** (Relacionamento N-N).
- CRUD completo (Criar, Listar, Editar, Deletar) com verificação de propriedade (usuário dono).

### 📊 Analytics & Dashboard

- **Rastreamento de Cliques:** Captura de Timestamp, IP e User Agent no momento do redirecionamento.
- **Dashboard Executivo:** Métricas gerais (Total de Cliques, Links Ativos, Top Clientes).
- **Métricas Detalhadas por Link:**
  - Histograma de cliques (últimos 30 dias).
  - Ranking de Navegadores/Dispositivos.
  - Ranking de Localização (agrupamento por IP).

---

## 🛠️ Como Rodar o Projeto

Graças ao Docker, o ambiente é padronizado e simples de iniciar.

### Pré-requisitos

- Docker e Docker Compose instalados.
- Credenciais do Google Cloud Platform (Client ID e Secret).

### Passo a Passo

1.  **Clone o repositório:**

    ```bash
    git clone [https://github.com/seu-usuario/macondo-link-manager.git](https://github.com/seu-usuario/macondo-link-manager.git)
    cd macondo-link-manager
    ```

2.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz baseado no exemplo:

    ```bash
    cp .env.example .env
    ```

    _Preencha o `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `JWT_SECRET`._

3.  **Suba o Ambiente:**

    ```bash
    docker-compose up -d
    ```

    _Isso iniciará o container do PostgreSQL e da API._

4.  **Acesse a Documentação:**
    Abra seu navegador em: `http://localhost:3333/docs`
    _O Swagger UI estará disponível com todos os endpoints documentados e prontos para teste._

---

## 📚 Documentação da API (Swagger)

A API é auto-documentada utilizando OpenAPI 3.0. Ao rodar o projeto, você tem acesso a schemas detalhados de requisição e resposta.

| Recurso                  | Descrição                                        |
| :----------------------- | :----------------------------------------------- |
| `POST /auth/google`      | Inicia o fluxo de login OAuth.                   |
| `GET /links`             | Lista links com filtros (Cliente, Campanha).     |
| `POST /links`            | Cria um novo link encurtado.                     |
| `GET /:shortCode`        | Rota pública de redirecionamento (com tracking). |
| `GET /links/:id/metrics` | Retorna dados agregados para gráficos.           |

---

## 🛣️ Próximos Passos (Roadmap)

- [ ] Desenvolvimento do Front-end (React/Next.js).
- [ ] Implementação de testes unitários e de integração (Vitest).
- [ ] Integração com serviço de GeoIP para localização precisa.
- [ ] Pipeline de CI/CD.

---

Developed with 💜 by [Rafael Valverde](https://github.com/rafaverde)
