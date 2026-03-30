# Arquitetura

## API

- A composição de dependências acontece em `api/src/plugins/app-services.ts`.
- Regras de negócio novas devem nascer por domínio primeiro, camada depois.
- Domínios já iniciados neste refactor:
  - `api/src/domains/links`
  - `api/src/domains/analytics`
- Schemas HTTP compartilhados ficam em `api/src/interfaces/http/schemas`.
- Erros de domínio HTTP-aware devem estender `AppError` em `api/src/errors/app-error.ts`.

## Frontend

- Hooks de dados vivem em `web/src/features/<feature>/hooks`.
- Query keys compartilhadas vivem em `web/src/features/shared/cache/query-keys.ts`.
- Helpers de invalidação vivem em `web/src/features/shared/cache/query-invalidation.ts`.
- Os arquivos em `web/src/hooks` e `web/src/lib/query-*.ts` permanecem como compatibilidade temporária e reexportam a implementação real.

## Convenções

- Novo código de negócio: domínio primeiro.
- Novo hook de dados: criar em `features/<feature>/hooks`.
- Nova chave de cache: registrar em `features/shared/cache/query-keys.ts`.
- Nova invalidação cruzada: centralizar em `features/shared/cache/query-invalidation.ts`.
