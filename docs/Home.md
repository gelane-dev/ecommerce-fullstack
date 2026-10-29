# projeto_ecommerce — Home

E-commerce full stack de estudo/portfólio ("White Pony" no frontend): API REST em FastAPI + PostgreSQL e SPA em React + Vite.

> Ponto de entrada da documentação técnica. Pode ser lida no GitHub ou aberta como vault no [Obsidian](https://obsidian.md) (abra a pasta `docs/`).

## Notas

| Nota | Quando consultar |
|------|------------------|
| [Architecture](Architecture.md) | Estrutura de pastas, camadas, fluxo frontend → API → banco |
| [Database](Database.md) | Tabelas, colunas, relacionamentos, migrações Alembic |
| [API](API.md) | Endpoints, autenticação JWT, contratos de request/response |
| [Setup](Setup.md) | Instalar, configurar `.env`, rodar API, frontend e testes |
| [Decisions](Decisions/README.md) | Registros de decisões arquiteturais (ADR) |

## Resumo rápido

- **Backend:** `backend/app` — FastAPI, SQLAlchemy 2.x, Pydantic, JWT (python-jose), bcrypt (passlib), Cloudinary para imagens.
- **Banco:** PostgreSQL; migrações em `backend/alembic/versions`.
- **Frontend:** `frontend/src` — React 19, react-router-dom 7, Vite 8, Vitest.
- **Testes:** `backend/tests` (pytest, Postgres real) e `frontend/src/**/*.test.jsx` (Vitest).

## Convenções

- Código e mensagens em português; alguns campos herdados em inglês (`name`, `role`).
- Commits no padrão Conventional Commits em português (`feat(produtos): ...`).
- Informação não confirmada no código é marcada como **Not verified**.
