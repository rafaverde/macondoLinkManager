# Macondo Link Manager

Plataforma interna de gerenciamento de links, métricas e campanhas da **Macondo Propaganda**.

Este repositório contém **backend (API)** e **frontend (Web)** organizados em um **monorepo**, facilitando o desenvolvimento, versionamento e deploy.

---

## 📦 Estrutura do Repositório
```
/
├── api/ # Backend (Fastify + Prisma)
│ ├── src/
│ ├── prisma/
│ └── Dockerfile
│
├── web/ # Frontend (Next.js 14 + App Router)
│ ├── src/
│ └── next.config.ts
│
└── README.md
```

> ℹ️ **Decisão de arquitetura**  
> O projeto utiliza **monorepo por escolha**, pois API e Web evoluem juntas, compartilham o mesmo domínio e ciclo de deploy.  
> A separação em repositórios distintos pode ser considerada futuramente, mas **não é necessária para a v1**.

---

## 🚀 Release v1.0.0 — Primeira versão funcional

A **v1.0.0** marca a primeira versão completa e utilizável do sistema.

### ✅ Autenticação
- Login via **Google OAuth**
- Restrição de acesso por domínio
- JWT armazenado em cookie httpOnly
- Logout seguro

### 🔗 Gestão de Links
- Criar, listar, editar e deletar links
- Associação com **clientes** e **campanhas**
- Redirecionamento público por short URL
- Registro de cliques em tempo real

### 📊 Analytics & Dashboards
- Dashboard geral do usuário
- Dashboard por campanha
- Métricas por link
- Métricas agregadas:
  - Cliques por data
  - Top navegadores
  - Top países
  - Top cidades

### 🧠 Arquitetura
- Clean Architecture (Services + Repositories)
- Fastify + Zod
- Prisma ORM + PostgreSQL
- Error handling centralizado
- Controle de acesso por ownership
- Documentação via Swagger

---

## ✨ Release v1.0.1 — UX & Polimento

A **v1.0.1** foca em melhorias visuais e de experiência do usuário.

### Melhorias incluídas
- Ajustes de layout nos dashboards
- Melhoria no **Link Card**
  - Remoção de ações sem uso
  - Novo botão “Detalhes”
  - Comportamento condicional com `isDetails`
- Navegação mais clara entre páginas

> Esta versão existe para **documentar melhorias incrementais**, mantendo histórico claro de evolução.

---

## 🖥️ Stack Tecnológica

### Backend (API)
- Node.js
- Fastify
- Prisma ORM
- PostgreSQL
- Zod
- JWT
- Swagger (OpenAPI)
- Docker

### Frontend (Web)
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Recharts
- TanStack Query
- Axios
- Sonner (toasts)

---

## ⚠️ Limitações conhecidas (Backlog)

Funcionalidades planejadas, mas fora do escopo da v1:

- Feedback visual completo para erros de OAuth (`DOMAIN_NOT_ALLOWED`)
- Compartilhamento de links
- Geração de QR Code
- CRUD completo de clientes e campanhas
- Testes automatizados

Esses pontos estão documentados para próximas sprints.

---

## 🧪 Status de Qualidade

- ✅ Testes manuais end-to-end
- ⏳ Testes automatizados planejados
- 🔍 Logs básicos implementados

---

## 🏷️ Versionamento

O projeto segue **Semantic Versioning (SemVer)**:

- `v1.0.0` — Primeira versão funcional
- `v1.0.1` — Ajustes de UX e layout

---

## 👥 Autoria

Projeto interno desenvolvido pela **Macondo Propaganda**, com foco em evolução contínua e possível produto futuro.
