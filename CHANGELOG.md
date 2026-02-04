# Changelog

Todas as mudanças relevantes deste projeto serão documentadas neste arquivo.

O formato segue o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)
e o versionamento segue [SemVer](https://semver.org/lang/pt-BR/).

---

## [1.2.2] - 2026-02-04
### 🔧 Changed
- Adicionado link completo com protocolo HTTP/HTTPS na cópia do link curto para o clipboard.
- Adicionado word wrapping na URL original no componente LinkCard.
- Melhorado o layout da exibição da URL original no componente LinkCard.

---

## [1.2.1] - 2026-02-04

### ✨ Added
- Estados de loading nos botões de compartilhamento de links:
  - Feedback visual ao copiar QR Code como imagem (PNG).
  - Feedback visual ao baixar QR Code em formato SVG.
  - Prevenção de múltiplos cliques durante ações assíncronas.

### 🔧 Changed
- Melhoria na navegação das tabelas:
  - Nomes de clientes agora funcionam como links para seus respectivos dashboards.
  - Nomes de campanhas agora funcionam como links para seus respectivos dashboards.
- Ajustes nos breadcrumbs e rotas internas das páginas de campanhas e dashboards.

### 🐛 Fixed
- Correção de inconsistência no dashboard global após exclusão de clientes:
  - Invalidação adequada das queries relacionadas a dashboards e métricas.
  - Remoção de dados obsoletos exibidos em gráficos (ex: Top 5 Clientes).

---

## [1.2.0] - 2026-02-02

### 🔧 Changed
- Revisão do modelo de **ownership de links**:
  - Links passam a pertencer à **organização**, não mais ao usuário.
  - Todos os usuários autenticados passam a ter **visualização e gerenciamento global** dos links.
- Atualização das regras de acesso nas rotas de links:
  - Remoção da validação de ownership por usuário.
  - Acesso baseado exclusivamente em autenticação.
- Revisão completa das **métricas e dashboards**:
  - Métricas agora consideram **todos os links da organização**.
  - Remoção de filtros por usuário nas agregações de cliques.
  - Garantia de consistência dos dados entre diferentes usuários.

### 🧹 Refactored
- Simplificação da lógica de autorização relacionada a links.
- Centralização do escopo de métricas exclusivamente nos repositórios.
- Adequação semântica do `userId` como metadado de criação (sem função de ownership).

### 🐛 Fixed
- Correção de dashboards exibindo métricas incompletas dependendo do usuário autenticado.
- Correção de inconsistências entre listagem de links e dados de analytics.

---

## [1.1.2] - 2026-01-30

### ✨ Added
- Componente **DeleteLinkDialog** para confirmação de exclusão de links.
- Integração do fluxo de exclusão diretamente no **LinkCard**.
- Componente **NotFound** para tratamento de páginas 404 com mensagem amigável e navegação orientada.
- Exibição da **quantidade de campanhas por cliente** na página de clientes.

### 🔧 Changed
- Melhoria na **CampaignDashboardPage**:
  - Estado de loading mais claro.
  - Prompt visual para criação de links quando não há dados.
- Refatoração do **AppSidebar**:
  - Uso de `SidebarFooter` para exibição da versão do app.
  - Melhor organização visual e responsividade.
- Ajustes de responsividade:
  - Visibilidade condicional da data de criação de clientes em tabelas.
  - Substituição de ícone de seta por ícone de adicionar no botão de criação de links.
- Integração do hook **useSidebar** para controle adequado do menu mobile.

### 🐛 Fixed
- Remoção de logs de debug remanescentes em produção.
- Correção de inconsistências visuais em layouts responsivos.
- Ajustes finos de espaçamento e alinhamento em componentes do dashboard.

---

## [1.1.1] - 2026-01-29

### ✨ Added
- Modal de **compartilhamento de links** acessível a partir do Link Card.
- Geração de **QR Code dinâmico** para links curtos.
- Ações de compartilhamento:
  - Copiar link para a área de transferência.
  - Copiar QR Code como imagem (PNG).
  - Download do QR Code em formato SVG.
  - Compartilhamento direto via **WhatsApp**.
  - Compartilhamento via **Email**.

### 🔧 Changed
- Centralização da lógica de compartilhamento em helper dedicado (`lib/link-share.ts`).
- Geração de QR Code realizada exclusivamente no frontend (sem chamadas adicionais à API).
- Ajuste nos hooks de invalidação de cache para manter filtros de campanhas sincronizados após exclusão.

### 🐛 Fixed
- Correção de QR Codes inválidos gerados sem protocolo HTTP/HTTPS.
- Correção de estado desatualizado no select de campanhas da página de links após exclusão.
- Ajustes na serialização SVG para cópia correta do QR Code para o clipboard.

---

## [1.1.0] - 2026-01-27

### ✨ Added
- CRUD completo de **Clientes** (criar, listar, editar e excluir).
- CRUD completo de **Campanhas**, vinculadas a clientes.
- Página dedicada para gerenciamento de clientes.
- Página dedicada para gerenciamento de campanhas.
- Filtro por cliente na listagem de campanhas.
- Visualização global de campanhas com identificação do cliente associado.

### 🔧 Changed
- Clientes e campanhas passam a ser **entidades globais da agência**.
- Melhor organização do fluxo de criação de links com clientes e campanhas.
- Filtros interdependentes na listagem de links:
  - Campanhas filtradas automaticamente pelo cliente selecionado.
- Breadcrumbs dinâmicos padronizados em todo o dashboard.
- Melhorias gerais de UX em formulários, tabelas e diálogos modais.

### 🐛 Fixed
- Correção de inconsistências de cache após criação, edição ou exclusão de clientes e campanhas.
- Correção de filtros exibindo campanhas incorretas ao trocar cliente.
- Ajuste no comportamento de breadcrumbs que causavam reload de página.
- Correção de estados desatualizados em selects após exclusão de campanhas.


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
