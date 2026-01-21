# Changelog

Todas as mudanças relevantes deste projeto serão documentadas neste arquivo.

O formato segue o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)
e o versionamento segue [SemVer](https://semver.org/lang/pt-BR/).

---

## [1.0.3] - 2026-01-21

### ✨ Added
- Geolocalização de cliques utilizando **MaxMind GeoLite2 City**.
- Identificação de **país e cidade** para cliques públicos.
- Normalização de países usando `Intl.DisplayNames`.
- Skeletons de carregamento no dashboard inicial.
- Feedback visual aprimorado para estados de loading em gráficos.

### 🔧 Changed
- Ajuste no Dockerfile para incluir a base GeoLite2 no runtime.
- Padronização de labels de localização:
  - País: “Não identificado”
  - Cidade: “Não identificada”
- Melhor tratamento de IP real atrás de proxy (Vercel + Railway).
- Melhorias visuais nos gráficos de pizza (Top 5 Países / Cidades).

### 🐛 Fixed
- Correção de cliques aparecendo como “desconhecidos” mesmo com IP público.
- Correção de erro silencioso por ausência do arquivo `.mmdb` em produção.
- Ajuste no schema de resposta para aceitar valores nulos antes da normalização.
- Correção de inconsistências entre ambiente local e produção.

---

## [1.0.2] - 2026-01-19

### ✨ Added
- Deploy completo em produção:
  - Frontend na Vercel
  - Backend no Railway
- Autenticação Google OAuth funcionando em produção.
- Domínios customizados configurados.
- Cookies HTTP-only cross-domain funcionando corretamente.

### 🔧 Changed
- Reorganização dos providers globais (Theme, React Query).
- Ajustes finais de middleware e fluxo de autenticação.
- Melhorias gerais de UX no dashboard.

### 🐛 Fixed
- Tela preta causada por múltiplos `QueryClientProvider`.
- Problemas de redirecionamento após login.
- Erros de Suspense com `useSearchParams`.
- Problemas de hidratação em produção.

---

## [1.0.1] - 2026-01-17

### ✨ Added
- Melhorias visuais no dashboard.
- Ajustes no Link Card:
  - Botão de detalhes.
  - Ocultação de ações redundantes em páginas de detalhe.

### 🔧 Changed
- Refinamentos de layout e espaçamento.
- Pequenos ajustes de UX.

---

## [1.0.0] - 2026-01-15

### 🎉 Initial Release

- Autenticação via Google OAuth.
- Gerenciamento de clientes e campanhas.
- Criação, edição e remoção de links.
- Redirecionamento público de shortlinks.
- Dashboard com métricas básicas.
- Backend em Fastify + Prisma.
- Frontend em Next.js + React Query.
