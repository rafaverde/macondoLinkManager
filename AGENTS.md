# AGENTS.md

Guia de referencia para agentes que atuarem neste repositorio.
Objetivo: manter consistencia tecnica, previsibilidade de entrega e
continuidade entre sprints.

## 1) Contexto do produto

Macondo Link Manager e uma plataforma interna para:
- encurtamento e gestao de links
- associacao por cliente/campanha
- analytics de cliques
- dashboards por organizacao, cliente, campanha e link

Regra de negocio vigente:
- recursos de negocio e analytics operam em escopo global da organizacao autenticada

## 2) Stack e estrutura

- Monorepo com:
  - `api/` (Fastify + Prisma + Zod + TypeScript)
  - `web/` (Next.js App Router + React Query + TypeScript)
- Documentacao principal:
  - `README.md`
  - `docs/architecture.md`
  - `docs/operations.md`
  - `CHANGELOG.md`

## 3) Arquitetura e convencoes

- API com composition root central:
  - `api/src/plugins/app-services.ts`
- Organizacao por dominio iniciada e obrigatoria para novas regras:
  - `api/src/domains/links`
  - `api/src/domains/analytics`
- Schemas HTTP reutilizaveis em:
  - `api/src/interfaces/http/schemas`
- Frontend com camada de dados por feature:
  - `web/src/features/*/hooks`
  - `web/src/features/shared/cache`

## 4) Contratos obrigatorios atuais

### 4.1 Semantica de cliques (critico)

Todo numero user-facing de "cliques" deve usar cliques validos:
- filtro por `isBot = false`
- dashboards, cards-resumo e detalhe de link devem ser consistentes

Contrato de link:
- `rawClicks`: contagem bruta
- `validClicks`: contagem oficial para exibicao

### 4.2 Paginacao server-side

Endpoints:
- `GET /links`
- `GET /clients`
- `GET /campaigns`

Query params:
- `page` default `1`
- `pageSize` default `20`
- `pageSize` maximo `100`

Resposta:
```ts
{
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}
```

## 5) Qualidade e gates

Executar sempre antes de PR:

```bash
cd api && npm test && npm run build
cd web && npm run lint && npm test && npm run build
```

CI no GitHub Actions (`.github/workflows/ci.yml`) valida:
- API build + test
- WEB lint + test + build

## 6) Fluxo de trabalho adotado

- Branches com prefixo `codex/`
- Commits pequenos e tematicos
- Changelog atualizado por versao
- Release por tag semver (`vX.Y.Z`)

Padrao de entrega recente:
- `v1.5.0`: hardening funcional + arquitetura incremental
- `v1.5.1`: micro-fix de consistencia/cache e limpeza de legado
- `v1.5.2`: hardening operacional (CI + ambiente)
- `v1.6.0` (em andamento nesta branch): escala, qualidade e confiabilidade

## 7) Docker dev e lockfile (importante)

Contexto conhecido:
- divergencia de lockfile com versoes de npm pode quebrar `npm ci`

Pontos aplicados no projeto:
- `api/Dockerfile.dev` fixado em `node:20-alpine`
- `api/start.sh` tenta `npm ci` e possui fallback seguro para dev

Se CI falhar com lockfile em API:
- regenerar `api/package-lock.json` com Node 20 + npm 10
- validar `cd api && npm ci` localmente antes de push

## 8) Boas praticas para novos agentes

- Nao mudar contratos publicos sem documentar e atualizar frontend junto
- Nao introduzir contagens de cliques brutos em UI sem justificativa explicita
- Preservar organizacao por dominio na API e por feature no frontend
- Evitar duplicacao de query keys e invalidacoes no frontend
- Priorizar erros de dominio explicitos em vez de depender de erro implicito de banco
- Em mudancas de release, atualizar `README.md`, `docs/operations.md` e `CHANGELOG.md`

## 9) Checklist rapido de PR

- [ ] Contratos HTTP e tipos frontend alinhados
- [ ] Semantica de cliques validos preservada
- [ ] Paginacao mantida nas listagens principais
- [ ] Testes/build/lint verdes localmente
- [ ] CI verde
- [ ] Changelog/documentacao atualizados

