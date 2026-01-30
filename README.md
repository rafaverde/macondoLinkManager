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

---

## 🔗 URLs em Produção

- **Frontend:** https://li.mcd.ppg.br  
- **API:** https://api.mcd.ppg.br  
- **Swagger (API Docs):** https://api.mcd.ppg.br/docs  

---

## ✨ Principais Funcionalidades

### Autenticação
- Login via **Google OAuth**
- Restrição por domínio corporativo
- Autenticação baseada em **JWT armazenado em cookie httpOnly**

### Links
- Criação e edição de links encurtados
- Associação com **clientes** e **campanhas**
- Contagem de cliques
- Página de detalhes do link

### Dashboards
- Dashboard geral
- Dashboard por campanha
- Dashboard por cliente
- Métricas por:
  - Datas
  - Navegadores
  - Países
  - Cidades

### UX / UI
- Sidebar colapsável
- Breadcrumbs dinâmicos
- Modo **Light / Dark**
- Layout responsivo

---

## 🖥️ Stack Tecnológica

### Frontend
- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **TanStack Query**
- **Axios**
- **Sonner (toasts)**

### Backend
- **Node.js**
- **Fastify**
- **Prisma ORM**
- **PostgreSQL**
- **Zod**
- **JWT**
- **Google OAuth 2.0**

### Infraestrutura
- **Vercel** (Frontend)
- **Railway** (Backend + Database)
- **Docker**
- **Domínios personalizados**

---

## 🔐 Autenticação (Visão Geral)

1. Usuário faz login via Google
2. Backend valida domínio
3. JWT é gerado
4. Token é armazenado em cookie:
   - `httpOnly`
   - `secure`
   - `sameSite=none`
5. Frontend consome `/me` para obter o usuário autenticado

---

## 🧪 Health Check

A API expõe um endpoint para verificação de status:
```
GET /health
```
Resposta esperada:
```json
{
  "status": "ok",
  "dbConnection": "healthy"
}
```

---

## 📦 Versões e Changelog

O projeto segue Semantic Versioning (MAJOR.MINOR.PATCH).

v1.0.0 – Primeira versão funcional

v1.0.1 – Ajustes de layout e UX

v1.0.2 – Deploy em produção, OAuth, domínios e dashboards completos

v1.1.0 - Novas funcionalidades de gerenciamento de campanhas e clientes. Bugs corrigidos.

📄 Consulte o histórico completo em
➡️ [CHANGELOG.md](./CHANGELOG.md) 

---

## 🚧 Roadmap

### As próximas evoluções estão organizadas via GitHub Milestones.

Principais ideias futuras:
- CRUD completo de clientes e campanhas
- Compartilhamento de links
- Geração de QR Code
- Exportação de relatórios
- Testes automatizados

---

## 👥 Autoria

Projeto interno desenvolvido por **Macondo Propaganda**, com foco em evolução contínua e possível produto futuro.

--- 

## 📄 Licença

Projeto interno – uso exclusivo da Macondo Propaganda.


---