# Macondo Link Manager

Plataforma interna de gerenciamento de links, métricas e campanhas da
**Macondo Propaganda**.

O sistema evoluiu para uma arquitetura orientada a domínio, com backend
como fonte única de verdade e frontend declarativo, garantindo
consistência, previsibilidade e escalabilidade.

Este repositório contém **backend (API)** e **frontend (Web)**
organizados em um **monorepo**, facilitando desenvolvimento,
versionamento e deploy.

------------------------------------------------------------------------

## 📦 Estrutura do Repositório

    /
    ├── api/        # Backend (Fastify + Prisma)
    │ ├── src/
    │ ├── prisma/
    │ └── Dockerfile
    │
    ├── web/        # Frontend (Next.js 14 + App Router)
    │ ├── src/
    │ └── next.config.ts
    │
    └── README.md

------------------------------------------------------------------------

## 🔗 URLs em Produção

-   **Frontend:** https://app.mcd.ppg.br\
-   **API:** https://li.mcd.ppg.br\
-   **Swagger (API Docs):** https://li.mcd.ppg.br/docs

------------------------------------------------------------------------

# 🧠 Arquitetura Atual

## Modelo de Domínio

    Cliente
     └── Campanha
          └── Link
               ├── Tags (many-to-many)
               └── Cliques

### Princípios Arquiteturais

-   Links são globais à organização
-   Métricas utilizam estado persistido (sem heurísticas em tempo de
    leitura)
-   Agregações são responsabilidade do backend
-   Frontend consome read models estáveis
-   Operações críticas são transacionais
-   Create e Update seguem comportamento simétrico

------------------------------------------------------------------------

# ✨ Principais Funcionalidades

## 🔐 Autenticação

-   Login via **Google OAuth**
-   Restrição por domínio corporativo
-   JWT armazenado em cookie httpOnly

------------------------------------------------------------------------

## 🔗 Links

-   Criação e edição de links encurtados
-   Associação com clientes e campanhas
-   Sistema consolidado de **Tags**
-   Geração de QR Code
-   Compartilhamento simplificado
-   Página de detalhes do link

------------------------------------------------------------------------

## 🏷️ Sistema de Tags

-   Relacionamento many-to-many explícito
-   Tags enviadas como `string[]` (nomes)
-   Criação automática de tags inexistentes
-   Update substitui completamente o conjunto
-   Sincronização transacional
-   API retorna tags no formato:

``` ts
tags: { id: string; name: string }[]
```

### Garantias

-   Não há duplicação de tags
-   Não há relações residuais
-   Frontend não conhece a tabela intermediária
-   Contrato consistente entre backend e frontend

------------------------------------------------------------------------

## 📊 Dashboards & Métricas

-   Dashboard geral
-   Dashboard por campanha
-   Dashboard por cliente

### Métricas incluem:

-   Cliques por data
-   Navegadores
-   Países
-   Cidades

### 🔒 Filtragem de Bots

-   Detecção ocorre em **write-time**
-   Campo persistido `isBot`
-   Métricas consideram apenas cliques válidos
-   Backfill executado para dados históricos
-   Classificação reforçada por sinais de headers + ASN/datacenter (quando disponível)
-   Recomendado configurar `MAXMIND_LICENSE_KEY` para manter City + ASN atualizados
-   No boot da API:
    - tenta garantir GeoLite2 City + ASN (`GEOLITE_DOWNLOAD_ON_BOOT=true`)
    - por padrão não derruba a API se o download falhar (`GEOLITE_FAIL_FAST=false`)
    - modo estrito opcional: `GEOLITE_FAIL_FAST=true`
-   Auditoria persistida por clique: `botReason`, `botScore`, `botSignals`, `asnNumber`, `asnOrg`
-   Modo strict de datacenter para novos cliques (`BOT_STRICT_DATACENTER=true`)

Backfill manual:

    cd api
    npm run bot:backfill -- --days=90 --dry-run
    npm run bot:backfill -- --days=90 --strict-datacenter
    # Opcional: permitir rebaixar bot->humano (não recomendado no fluxo padrão)
    npm run bot:backfill -- --days=90 --strict-datacenter --allow-demotion

------------------------------------------------------------------------

## 🧮 Read Models

Listagens utilizam **modelos agregados no backend**:

-   Contagem de campanhas por cliente
-   Contagem de links por cliente
-   Contagem de links por campanha
-   Associação explícita de cliente na campanha

Frontend não realiza cálculos de domínio.

------------------------------------------------------------------------

## 🛠️ Ferramentas

### WhatsApp Link Generator

Rota:

    /dashboard/tools/whatsapp-generator

Permite gerar links oficiais no padrão:

    https://wa.me/<number>?text=<encoded_message>

-   Client-side
-   Validação com React Hook Form + Zod
-   Preview em tempo real
-   Copiar com feedback visual

------------------------------------------------------------------------

# 🖥️ Stack Tecnológica

## Frontend

-   Next.js (App Router)
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   TanStack Query
-   Axios
-   React Hook Form + Zod

## Backend

-   Node.js
-   Fastify
-   Prisma ORM
-   PostgreSQL
-   Zod
-   JWT
-   Google OAuth 2.0

## Infraestrutura

-   Vercel (Frontend)
-   Railway (Backend + DB)
-   Docker
-   Domínios personalizados

------------------------------------------------------------------------

# 🧪 Health Check

    GET /health

Resposta esperada:

``` json
{
  "status": "ok",
  "dbConnection": "healthy"
}
```

------------------------------------------------------------------------

# 📦 Versionamento

O projeto segue **Semantic Versioning (MAJOR.MINOR.PATCH)**.

### v1.0.0 (Release)
- Primeira versão funcional

### v1.2.0
- Revisão do modelo de ownership de links que agora passam a ser globais. 
- Atualização de métricas para serem também globais da organização.

### v1.3.0

-   Métricas confiáveis com filtragem persistente de bots
-   Introdução de read models agregados no backend

### v1.4.0

-   Consolidação completa do sistema de Tags
-   WhatsApp Link Generator
-   Padronização de retornos de Link
-   Correção de cache no detalhe de links

📄 Histórico completo: ➡️ [CHANGELOG.md](./CHANGELOG.md)

------------------------------------------------------------------------

# 🚧 Roadmap

Próximas evoluções possíveis:

-   Filtro por tags
-   CRUD dedicado de tags
-   Relatórios exportáveis
-   Paginação server-side completa
-   RBAC / múltiplas organizações
-   Testes automatizados

------------------------------------------------------------------------

# 👥 Autoria

Projeto interno desenvolvido pelo setor de tecnologia da **Macondo Propaganda**, com foco em
evolução contínua e potencial produto futuro.

------------------------------------------------------------------------

# 📄 Licença

Projeto interno -- uso exclusivo da Macondo Propaganda. **Todos os direitos reservados.**
