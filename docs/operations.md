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
  - `web`: `npm run lint`
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
- CRUD de cliente
- CRUD de campanha
- CRUD de link
- redirect de link curto

### API

- `GET /health`
- `GET /docs`
- validacao de conexao com banco

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

## Norte do Sprint 3

O proximo sprint deve focar em confiabilidade e escala, nao em novo refactor
estrutural amplo:

- paginacao e limites de listagem
- revisao de analytics para reduzir leituras pesadas
- smoke automatizado dos fluxos criticos
- checklist de deploy e rollback mantidos junto da documentacao
