# Changelog

Todas as mudanças relevantes deste projeto serão documentadas neste arquivo.

O formato segue o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)
e o versionamento segue [SemVer](https://semver.org/lang/pt-BR/).

---

## [1.4.4] - 2026-03-11
### 🔧 Changed
- API:
  - Novo bootstrap de inicialização (`scripts/start-with-geolite.sh`) para controlar o download do GeoLite no boot sem depender de comando manual no Railway.
  - `npm run start` e `Dockerfile` passam a usar o bootstrap único de produção.
  - Comportamento padrão de boot fica resiliente:
    - `GEOLITE_DOWNLOAD_ON_BOOT=true` tenta preparar City + ASN.
    - `GEOLITE_FAIL_FAST=false` evita downtime se houver falha temporária no download.
  - Modo estrito continua disponível via `GEOLITE_FAIL_FAST=true`.

---

## [1.4.3] - 2026-03-11
### ✨ Added
- API:
  - Persistência de auditoria da classificação de bot por clique:
    - `botScore`
    - `botSignals`
    - `asnNumber`
    - `asnOrg`
  - Script de backfill atualizado para também preencher campos de auditoria.

### 🔧 Changed
- API:
  - Endurecimento da classificação com modo strict de datacenter para cliques novos:
    - `BOT_STRICT_DATACENTER=true` (default)
    - ASN de datacenter passa a pesar decisivamente na classificação.
  - Backfill aceita `--strict-datacenter` (mantendo compatibilidade com `--aggressive-datacenter`).
  - Backfill passou a não rebaixar bot para humano por padrão (safe mode).
    - Flag opcional para permitir demotion explícito: `--allow-demotion`.
  - Inclusão de índice em `clicks.isBot` para acelerar consultas de métricas.
  - Inicialização da API em modo fail-fast para GeoLite2 (City + ASN):
    - Removido fallback silencioso no boot do container.
    - Download agora falha explicitamente quando `MAXMIND_LICENSE_KEY` está ausente e a base não está completa.

---

## [1.4.2] - 2026-02-20
### 🔧 Changed
API:
- Adição do campo nome aos links para facilitar identificação.
- Funcionalidade de alterar e adicionar nome nos links novos e existentes.
- Funcionalidade de search pelo nome do link, além da URL original.
- Nova variável de ambiente para Google Callback URL, permitindo configuração flexível entre ambientes.

WEB:
- Exibição do nome do link no LinkCard, com fallback para URL original.
- Adição de campo de nome no formulário de criação e edição de links.
- Ajustes visuais para acomodar o nome do link sem comprometer a legibilidade.
- Nomeação automática do arquivo de QR Code para `<nome-do-link-qr-code>.svg` durante download.

---

## [1.4.1] - 2026-02-20

### 🔧 Changed
API:
- Detecção de bots com score e sinais adicionais (headers + heurísticas).
- Burst/rate por IP+UA para marcar tráfego suspeito.
- Suporte opcional a ASN/datacenter (GeoLite2-ASN).
- Download automático do GeoLite (City + ASN) no boot do container.

WEB:
- Melhoria na quebra de linha do link gerado no WhatsApp Generator (break-all) para evitar overflow.
- Ajustes no LinkCard:
  - Reorganização da exibição de tags.
  - Inclusão de ícone para identificar tags.
  - Ajustes de espaçamento/estilo para melhor leitura.


---

## [1.4.0] - 2026-02-13

### ✨ Added
- Ferramenta de geração de link oficial do WhatsApp:
  - Rota dedicada em `/dashboard/tools/whatsapp-generator`.
  - Geração dinâmica de URL no padrão `https://wa.me/`.
  - Validação com React Hook Form + Zod.
  - Preview em tempo real com encoding correto da mensagem.
  - Botão de cópia com feedback visual.
- Consolidação completa do sistema de Tags:
  - Suporte a edição de tags no fluxo de update de links.
  - Sincronização transacional de relações many-to-many.
  - Criação automática de tags inexistentes.

### 🔧 Changed
- Update de link passa a sincronizar completamente o conjunto de tags.
- Backend retorna tags normalizadas no formato `{ id, name }[]`.
- Padronização do tipo de retorno para `LinkWithRelations`.
- Fluxo de criação e edição de links agora é simétrico.
- Frontend passa a exibir e editar tags de forma consistente.

### 🧹 Removed
- Remoção da exposição da tabela intermediária `LinkTag` nos retornos da API.
- Remoção de inconsistências no contrato de retorno entre listagem, detalhe e update.

### 🐛 Fixed
- Correção de cache no detalhe de link após update (invalidando query específica).
- Correção de inconsistência onde tags não eram atualizadas no modo edição.


---

## [1.3.1] - 2026-02-07

### 🔧 Changed
- API:
  - Ampliação das regras de detecção de bots, incluindo mais assinaturas conhecidas de crawlers, previews de redes sociais e ferramentas de SEO (Google, Bing, Meta/Facebook, WhatsApp, Slack, Twitter/X, LinkedIn, Discord, Telegram, AppleBot, Ahrefs, Semrush e clientes HTTP genéricos).
  - Melhoria na classificação de tráfego não humano sem alterações na estrutura de dados ou contratos existentes.
  - Expansão da identificação de navegadores a partir do User-Agent, reduzindo significativamente a categoria “Outros”.
  - Melhor distinção entre navegadores desktop e mobile, aumentando a precisão das métricas de browser.
  - Melhoria na injeção de versão da Github Action para Vercel.

- WEB:
  - Ajustes visuais no layout das tabelas de campanhas.

--- 

## [1.3.0] - 2026-02-06

### ✨ Added
- Detecção persistente de bots no registro de cliques:
  - Classificação de cliques em write-time (`isBot`, `botReason`).
  - Script de backfill para classificação de cliques históricos.
- Agregações de domínio no backend para listagens:
  - Contagem de campanhas e links por cliente.
  - Contagem de links por campanha.
  - Inclusão explícita do nome do cliente nas listagens de campanhas.
- Introdução de **read models** dedicados para consumo da UI.

### 🔧 Changed
- Métricas e dashboards passam a utilizar exclusivamente o estado persistido de cliques (`isBot`) como fonte de verdade.
- Refatoração das rotas de listagem de clientes e campanhas para consumir dados agregados diretamente do backend.
- Separação clara entre services de leitura (read models) e services de escrita (CRUD).
- Frontend passa a consumir contratos estáveis, sem cálculos ou transformações locais.

### 🧹 Removed
- Remoção de heurísticas de detecção de bots baseadas em `user_agent` em tempo de leitura.
- Remoção de cálculos de agregação e joins indiretos no frontend.
- Remoção de métodos legados de listagem nos services e repositórios CRUD.


---

## [1.2.3] - 2026-02-05

### ✨ Added
- Botão para limpar todos os filtros na página de links.

### 🔧 Changed
- Melhoria de ux na criação de links:
  - Persistencia dos valores selecionados de cliente e campanha após criação de link.

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
