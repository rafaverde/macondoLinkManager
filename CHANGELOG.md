# Changelog

Todas as mudanças relevantes deste projeto serão documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o versionamento segue [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [1.0.2] - 2026-01-19

### Added
- Deploy em produção (Frontend na Vercel, Backend no Railway)
- Domínios personalizados:
  - Frontend: `li.mcd.ppg.br`
  - API: `api.mcd.ppg.br`
- Autenticação via Google OAuth em produção
- Dashboards de campanha e cliente
- Breadcrumbs dinâmicos
- Página de health check da API

### Changed
- Fluxo de autenticação baseado em cookie httpOnly
- Estrutura de layouts do App Router
- UX do Link Card (ações contextuais e botão de detalhes)
- Organização de cache e invalidação no React Query

### Fixed
- Redirecionamento pós-login para `/dashboard`
- Problemas de CORS e cookies cross-domain
- Erros de hidratação no App Router
- Quebra de contexto por múltiplos `QueryClientProvider`
- Swagger em ambiente de produção
- Middleware causando redirects indevidos (307)

---

## [1.0.1] - 2026-01-18

### Changed
- Ajustes visuais nos dashboards
- Melhorias de UX no card de links

---

## [1.0.0] - 2026-01-17

### Added
- Primeira versão funcional do Macondo Link Manager
- CRUD de links
- Dashboard geral de métricas
- Autenticação via Google OAuth (ambiente local)
