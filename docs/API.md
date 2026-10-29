# API

Voltar: [Home](Home.md) · Ver também: [Architecture](Architecture.md), [Database](Database.md)

Base local: `http://localhost:8001` (Swagger em `/docs`, OpenAPI em `/openapi.json` com a API rodando). Contratos abaixo extraídos de `backend/app/routers/` e `backend/app/schemas/`; o Swagger é a fonte mais precisa.

## Autenticação

- `POST /login/` retorna um JWT HS256 com `sub` (e-mail), `id`, `role` e `exp` (60 min).
- Rotas protegidas exigem `Authorization: Bearer <token>` (`HTTPBearer`). Token inválido/expirado → 401; sem header → 401 `{"detail": "Not authenticated"}` (verificado em 2026-10-29).
- `exigir_admin`: `role != "admin"` → 403.
- E-mails são normalizados (`strip().lower()`) nos schemas.

Legenda: 🌐 público · 🔑 usuário autenticado · 🛡️ admin

## Autenticação (`routers/auth.py`)

| Método | Rota | Acesso | Corpo | Resposta |
|--------|------|--------|-------|----------|
| POST | `/login/` | 🌐 | `{email, senha}` | `{access_token, token_type: "bearer", usuario: {id, nome, email, tipo, foto}}`; 401 credenciais inválidas |
| POST | `/cadastro/` | 🌐 | `{name (3–100), email, senha (≥6)}` | 201 `{mensagem}`; 409 e-mail já cadastrado |

## Produtos (`routers/produtos.py`)

| Método | Rota | Acesso | Detalhes |
|--------|------|--------|----------|
| GET | `/produtos/` | 🌐 | Query: `busca` (ilike no nome), `categoria` (igualdade), `ordenar` = `preco_asc` \| `preco_desc` \| `recentes`. Retorna lista de produtos |
| GET | `/produtos/categorias` | 🌐 | Lista de categorias distintas, ordenadas |
| GET | `/produtos/{id}` | 🌐 | Produto; 404 se não existe |
| POST | `/produtos/` | 🛡️ | `{name, categoria, preco, estoque, descricao?}`; 201; 400 se preço/estoque < 0 |
| POST | `/produtos/{id}/imagem` | 🛡️ | `multipart/form-data`, campo `imagem` (jpeg/png/webp); envia ao Cloudinary e grava `imagem_url`; 400 formato; 404; 502 se o Cloudinary falhar |
| PUT | `/produtos/{id}` | 🛡️ | Campos opcionais; 400 se estoque < 0 ou preço < 0 (sem limite máximo de estoque, igual ao POST); 404 |
| DELETE | `/produtos/{id}` | 🛡️ | 404 se não existe; 409 se o produto já aparece em pedidos |

Produto retornado: `id, name, categoria, preco, estoque, imagem_url, descricao, data_criacao`.

## Pedidos (`routers/pedidos.py` + `services/pedido_service.py`)

| Método | Rota | Acesso | Detalhes |
|--------|------|--------|----------|
| POST | `/pedidos/` | 🔑 | `{itens: [{produto_id, quantidade > 0}]}` (mín. 1 item; itens do mesmo produto são somados); 201 `{mensagem, pedido_id, total}`; 404 produto; 400 estoque |
| GET | `/pedidos/` | 🛡️ | Todos os pedidos, mais recentes primeiro |
| GET | `/pedidos/meus` | 🔑 | Pedidos do usuário do token |
| PUT | `/pedidos/{id}/status` | 🛡️ | `{status}` ∈ `pendente, pago, enviado, cancelado`; 400 transição inválida; 404 |

Pedido serializado: `{id, total, status, data_criacao, cliente: {nome, email}, itens: [{produto_id, nome, quantidade, preco_unitario}]}`. Transições em [Architecture](Architecture.md).

## Usuários (`routers/usuarios.py`)

| Método | Rota | Acesso | Detalhes |
|--------|------|--------|----------|
| GET | `/usuarios/me` | 🔑 | `{id, nome, email, tipo, foto, data_criacao}` (`foto` é URL ou `null`) |
| PUT | `/usuarios/me` | 🔑 | `{nome?, email?}` (lista branca; `role` nunca é alterado); 409 e-mail em uso |
| PUT | `/usuarios/me/senha` | 🔑 | `{senha_atual, senha_nova (≥6)}`; 401 senha atual errada; 400 se igual à atual |
| POST | `/usuarios/me/foto` | 🔑 | `multipart/form-data`, campo `foto` (jpeg/png/webp); envia ao Cloudinary e devolve o perfil atualizado; 400 formato; 502 se o Cloudinary falhar |

## Exemplo

```http
POST /login/
Content-Type: application/json

{"email": "usuario@exemplo.com", "senha": "******"}
```

Validação (422) segue o formato padrão do FastAPI; `frontend/src/services/api.js` converte em mensagens amigáveis.

## Notas

- Inconsistência de nomes: entrada de cadastro usa `name`, perfil usa `nome`; resposta de login/perfil usa `nome`/`tipo`.
- Contratos derivados do código e cobertos pelos testes em `backend/tests`.
