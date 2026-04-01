# Operacoes de Release e Deploy

Este documento fecha o ciclo operacional iniciado na `v1.5.0` e deixa claro
o que hoje acontece automaticamente, o que continua manual e qual checklist
devemos seguir antes e depois de cada release.

## Estado atual da entrega

- O workflow de release do frontend vive em
  `.github/workflows/release.yml`.
- Ele roda em push de tags `v*`.
- Ele faz deploy de producao do frontend na Vercel.
- Ele nao publica a API.
- O workflow de CI vive em `.github/workflows/ci.yml`.
- O CI valida:
  - `api`: `npm run build`
  - `api`: `npm test`
  - `web`: `npm run lint`
  - `web`: `npm test`
  - `web`: `npm run build`

## Fluxo recomendado de release

1. Validar o PR em CI.
2. Fazer merge da branch aprovada.
3. Rodar smoke local ou em homologacao, se disponivel.
4. Criar a tag da release (`vX.Y.Z`).
5. Fazer push da tag.
6. Confirmar a execucao do workflow de release do frontend.
7. Fazer deploy da API pelo processo proprio do backend.
8. Rodar smoke em producao.

## Responsabilidades por plataforma

### Frontend

- Deploy automatico na Vercel via tag `v*`.
- Versionamento publico pode ser injetado pela propria action de release.

### API

- Nao existe hoje workflow equivalente no GitHub Actions.
- O deploy continua separado do frontend e deve ser tratado explicitamente.
- Antes de publicar a API, validar no minimo:
  - variaveis de ambiente
  - conectividade com banco
  - schema Prisma atualizado
  - endpoint `GET /health`

## Smoke pos-release

### Fluxos obrigatorios

- login/logout
- dashboard geral
- dashboard por cliente
- dashboard por campanha
- detalhe de link com total filtrado de bots
- CRUD de cliente
- CRUD de campanha
- CRUD de link
- redirect de link curto
- paginacao de clientes, campanhas e links

### API

- `GET /health`
- `GET /docs`
- validacao de conexao com banco
- `GET /links?page=1&pageSize=20`
- `GET /clients?page=1&pageSize=20`
- `GET /campaigns?page=1&pageSize=20`

## Rollback rapido

### Frontend

1. Reimplantar a tag/commit estavel anterior na Vercel.
2. Confirmar se a variavel publica de versao voltou ao valor esperado.
3. Reexecutar o smoke do frontend.

### API

1. Restaurar a versao estavel anterior no provedor do backend.
2. Confirmar compatibilidade com o schema atual do banco.
3. Reexecutar `GET /health` e o smoke basico de auth + dashboard + redirect.

## Ambiente local de desenvolvimento

O ambiente Docker dev da API foi endurecido para reduzir ruido de tooling:

- `node_modules` vive em volume dedicado do container.
- `npm ci` so roda quando o lockfile muda ou quando o volume ainda nao foi preparado.
- o boot nao depende mais de `sleep` fixo para esperar o banco.
- o schema Prisma sincroniza com retry controlado.

Isso reduz churn em `package-lock.json` e deixa o boot local mais previsivel.

## Norte pos-v1.6.0

Com a `v1.6.0`, a base passa a contar com paginacao, semantica unificada de
cliques validos e camada minima de testes automatizados. Os proximos ganhos
mais naturais tendem a estar em:

- ampliacao da cobertura de testes
- evolucao de analytics para agregacoes ainda mais baratas no banco
- observabilidade e healthchecks mais ricos
- refinamentos de UX nas listagens paginadas

## Politicas operacionais da v1.6.0

### Cliques validos

- Todo numero user-facing de "cliques" deve ignorar bots por padrao.
- O campo persistido `isBot` e a fonte de verdade para filtros analiticos.
- Cards, totais e dashboards devem refletir o mesmo universo filtrado.

### Paginacao

- `GET /links`, `GET /clients` e `GET /campaigns` usam resposta paginada.
- Parametros padrao:
  - `page=1`
  - `pageSize=20`
- Limite maximo de `pageSize`: `100`

Shape esperado:

```ts
{
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}
```
