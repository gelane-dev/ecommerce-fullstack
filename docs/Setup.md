# Setup local

Voltar: [Home](Home.md) · Ver também: [Database](Database.md), [Architecture](Architecture.md)

Instruções passo a passo estão no `README.md` da raiz. Aqui fica o resumo.

## Requisitos

- Python (Dockerfile usa 3.13), Node.js + npm, PostgreSQL local ou Docker.
- Credenciais Cloudinary apenas para upload de imagem.

## Variáveis de ambiente (`backend/.env`)

Copie `backend/.env.example` para `backend/.env` e preencha. **Nunca** copie valores reais para a documentação ou para commits.

| Variável | Uso |
|----------|-----|
| `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT` | Montam `DATABASE_URL` da aplicação |
| `SECRET_KEY`, `ALGORITHM` | Assinatura JWT. `SECRET_KEY` é obrigatória: sem ela a API não inicia |
| `DATABASE_URL_TESTE` | Banco de testes; deve terminar em `_test` |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Upload de imagens |

Frontend: `VITE_API_URL` opcional (padrão `http://localhost:8001`).

## Backend

```bash
cd backend
python -m venv .venv          # ou reutilize um venv existente
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8001
```

- Após cada atualização do código, rode `alembic upgrade head` de novo.
- Porta 8001 é a esperada pelo frontend e pelo CORS (origens `:5173`).

## Frontend

```bash
cd frontend
npm install
npm run dev     # Vite em http://localhost:5173
npm run lint
npm test        # vitest run
npm run build
```

## Testes do backend

```bash
cd backend
pytest
```

Requer `DATABASE_URL_TESTE` no ambiente ou no `.env` e um Postgres acessível. Os testes criam/apagam tabelas — use só o banco `_test`.

## Docker (opcional)

```bash
cd backend
docker compose up --build   # Postgres no host :5433, API no host :8001
```

Execução: **Not verified**. As migrações não rodam automaticamente no container (**Not verified** como o schema é criado nesse cenário).
