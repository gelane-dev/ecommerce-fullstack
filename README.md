# E-commerce Full Stack

Aplicação de e-commerce desenvolvida como projeto de estudo e portfólio, com uma API REST em Python e FastAPI, banco de dados PostgreSQL e uma interface web em React.

O projeto tem como objetivo aplicar conceitos de desenvolvimento backend, autenticação, autorização, modelagem de dados, regras de negócio, gerenciamento de estoque e integração entre frontend e backend.

> **Status:** em desenvolvimento. O backend possui autenticação, perfil de usuário, produtos e pedidos implementados e cobertos por testes. O frontend integra catálogo, detalhes do produto, carrinho, pedidos, perfil e área administrativa. A execução com Docker Compose ainda precisa ser validada.

## Tecnologias

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn
- python-jose (JWT)
- Passlib e bcrypt

### Banco de dados
- PostgreSQL
- Alembic para migrações

### Frontend
- React
- React Router
- JavaScript
- Vite
- CSS
- ESLint
- Vitest e Testing Library

### Ferramentas e serviços
- Git e GitHub
- Docker e Docker Compose
- pytest
- Cloudinary para imagens de produtos

## Funcionalidades implementadas na API

### Usuários e autenticação
- Cadastro de usuários.
- Login com autenticação baseada em JWT.
- Senhas armazenadas com hash.
- Diferenciação de permissões entre usuários e administradores.
- Proteção de operações administrativas.
- Consulta e edição do próprio perfil e troca de senha.

### Produtos
- Listagem pública de produtos com busca por nome, filtro por categoria e ordenação.
- Página de detalhes do produto e listagem de categorias.
- Criação, atualização e exclusão de produtos com acesso administrativo (produtos que já têm pedidos não podem ser excluídos).
- Integração com o Cloudinary para imagens de produtos.

### Pedidos e estoque
- Criação de pedidos com um ou mais itens.
- Validação da disponibilidade de estoque, com bloqueio da linha do produto durante a compra.
- Cálculo do total do pedido.
- Validação de transições de status.
- Cancelamento com devolução do estoque, conforme as regras implementadas.

### Banco de dados
- Modelagem de usuários, produtos e pedidos.
- Persistência com SQLAlchemy.
- Migrações de esquema com Alembic.

## Frontend

O frontend ("White Pony") utiliza React, React Router e Vite e consome a API. Telas disponíveis:
- Vitrine com busca, filtro por categoria e ordenação.
- Detalhes do produto com produtos relacionados.
- Login e cadastro.
- Carrinho e finalização do pedido.
- Meus pedidos, perfil e configurações da conta.
- Área administrativa para produtos (incluindo imagens) e status dos pedidos.

## Estrutura do projeto

```text
.
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── dependencies.py
│   │   └── main.py
│   ├── alembic/
│   ├── tests/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
├── docs/
├── .gitignore
├── LICENSE
└── README.md
```

## Como executar localmente

### Pré-requisitos
- Python instalado e compatível com as dependências do backend.
- Node.js e npm para o frontend.
- PostgreSQL local ou Docker.
- Credenciais do Cloudinary para utilizar o serviço de imagens.

### 1. Clonar o repositório

```bash
git clone https://github.com/gelane-dev/ecommerce-fullstack.git
cd ecommerce-fullstack
```

### 2. Configurar o backend

```bash
cd backend
python -m venv .venv
```

No Windows PowerShell:

```powershell
.venv\\Scripts\\Activate.ps1
```

No Linux/macOS:

```bash
source .venv/bin/activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

### 3. Configurar as variáveis de ambiente

Copie o arquivo de exemplo para criar seu arquivo local:

```bash
cp .env.example .env
```

No Windows, você também pode copiar o arquivo pelo Explorador de Arquivos. Edite o `.env` e informe os valores do seu ambiente. As variáveis esperadas incluem:

```env
DB_HOST=localhost
DB_NAME=primeiro_api
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_PORT=5432

SECRET_KEY=gere_uma_chave_secreta
ALGORITHM=HS256

DATABASE_URL_TESTE=postgresql+psycopg2://postgres:sua_senha@localhost:5432/ecommerce_test

CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
```

Use credenciais próprias e não envie o arquivo `.env` para o GitHub. A `SECRET_KEY` é obrigatória: sem ela a API não inicia.

### 4. Preparar o banco de dados

Com o PostgreSQL em execução e o banco indicado em `DB_NAME` criado, aplique as migrações:

```bash
alembic upgrade head
```

Repita esse comando sempre que atualizar o código, para aplicar migrações novas.

### 5. Iniciar a API

```bash
uvicorn app.main:app --reload --port 8001
```

A configuração local do Docker Compose publica a API na porta `8001`. Ao executar a API diretamente, o parâmetro `--port 8001` mantém o mesmo endereço esperado pelo frontend.

- Documentação Swagger: http://127.0.0.1:8001/docs
- Esquema OpenAPI: http://127.0.0.1:8001/openapi.json

Esses endereços estarão disponíveis apenas enquanto a API estiver em execução.

### 6. Iniciar o frontend

Em outro terminal, a partir da raiz do repositório:

```bash
cd frontend
npm install
npm run dev
```

O Vite mostrará no terminal o endereço local da interface. A página inicial consulta a API em `http://localhost:8001`; caso a API esteja em outro endereço, ajuste a URL usada pelo frontend.

### Alternativa: Docker Compose

A configuração Docker fica dentro de `backend/`. Com o arquivo `backend/.env` devidamente configurado:

```bash
cd backend
docker compose up --build
```

O Compose publica o PostgreSQL na porta `5433` do host e a API na porta `8001`. A execução completa ainda precisa ser validada no ambiente local.

## Testes

O backend tem testes de autenticação, usuários, produtos, pedidos e estrutura da API. Eles usam um banco PostgreSQL separado, indicado em `DATABASE_URL_TESTE` (o nome deve terminar em `_test`):

```bash
cd backend
pytest
```

O frontend tem testes com Vitest e Testing Library:

```bash
cd frontend
npm test
npm run lint
```

## Documentação

A pasta [`docs/`](docs/Home.md) reúne a documentação técnica: arquitetura, endpoints da API, modelo do banco, setup e decisões. Ela pode ser lida no GitHub ou aberta como vault no Obsidian.

## Próximas etapas

- [x] Executar a suíte de testes e corrigir eventuais falhas.
- [x] Completar a integração do frontend com os recursos da API.
- [x] Desenvolver os fluxos de autenticação, carrinho e pedidos na interface.
- [ ] Validar a inicialização da API e do PostgreSQL com Docker Compose.
- [ ] Implementar recuperação de senha.
- [ ] Continuar revisando tratamento de erros, configurações e segurança.
- [ ] Adicionar capturas de tela da aplicação funcionando.
- [ ] Configurar e validar uma demonstração publicada.
- [ ] Atualizar a documentação conforme as funcionalidades forem concluídas.

## Objetivos de aprendizado

Este projeto faz parte dos meus estudos em Análise e Desenvolvimento de Sistemas e permite praticar:
- Construção de APIs REST.
- Organização de aplicações backend.
- Autenticação e autorização.
- Modelagem relacional e migrações de banco de dados.
- Aplicação de regras de negócio.
- Testes automatizados.
- Integração entre frontend e backend.
- Containerização com Docker.

## Autor

**Leonardo Gelane dos Santos**

- GitHub: https://github.com/gelane-dev
- Repositório: https://github.com/gelane-dev/ecommerce-fullstack

Projeto desenvolvido para fins de aprendizado, prática e construção de portfólio.

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
