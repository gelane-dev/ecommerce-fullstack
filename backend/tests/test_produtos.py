from datetime import datetime

import pytest

from app.models import Produto

def  test_cliente_nao_pode_criar_produto(cliente, headers_cliente, db):
    resp = cliente.post("/produtos/", 
    headers=headers_cliente, 
    json={  
        "name": "panela",
        "categoria": "cozinha",
        "preco": 100,
        "estoque": 10,
    })

    verificar = db.query(Produto).count()
    
    assert resp.status_code == 403
    assert verificar == 0 


def test_cliente_nao_pode_atualizar_produto(cliente, headers_cliente, produto):
    resp = cliente.put(f"/produtos/{produto.id}", 
    headers=headers_cliente, 
    json={  
        "name": "panela inox",
        "categoria": "cozinha",
        "preco": 150,
        "estoque": 20,
    })

    assert resp.status_code == 403


def test_cliente_nao_pode_deletar_produto(cliente, headers_cliente, produto, db):
    resp = cliente.delete(f"/produtos/{produto.id}",
    headers=headers_cliente 
    )

    verificar = db.query(Produto).filter(
    Produto.id == produto.id
    ).first()
    
    assert resp.status_code == 403
    assert verificar is not None


def test_admin_pode_criar_produto(cliente, headers_admin, db):
    resp = cliente.post("/produtos/", 
    headers=headers_admin, 
    json={  
        "name": "panela",
        "categoria": "cozinha",
        "preco": 100,
        "estoque": 10,
    })

    verificar = db.query(Produto).filter(
    Produto.name == "panela"
    ).first()

    assert resp.status_code == 201
    assert verificar is not None
    assert verificar.name == "panela"
    assert verificar.categoria == "cozinha"
    assert verificar.preco == 100
    assert verificar.estoque == 10


def test_admin_pode_atualizar_produto(cliente, headers_admin, produto, db):
    resp = cliente.put(f"/produtos/{produto.id}", 
    headers=headers_admin, 
    json={  
        "name": "panela inox",
        "categoria": "cozinha",
        "preco": 150,
        "estoque": 20,
    })

    verificar = db.query(Produto).filter(
    Produto.id == produto.id
    ).first()
        
    assert resp.status_code == 200
    assert verificar is not None
    assert verificar.name == "panela inox"
    assert verificar.categoria == "cozinha"
    assert verificar.preco == 150
    assert verificar.estoque == 20


def test_admin_pode_deletar_produto(cliente, headers_admin, produto, db):
    resp = cliente.delete(f"/produtos/{produto.id}",
    headers=headers_admin 
    )

    verificar = db.query(Produto).filter(
    Produto.id == produto.id
    ).first()
    
    assert resp.status_code == 200
    assert verificar is None


def test_admin_nao_pode_atualizar_produto_inexistente(cliente, headers_admin):
    resp = cliente.put("/produtos/999", 
    headers=headers_admin, 
    json={  
        "name": "panela inox",
        "categoria": "cozinha",
        "preco": 150,
        "estoque": 20,
    })

    assert resp.status_code == 404


def test_admin_nao_pode_deletar_produto_inexistente(cliente, headers_admin):
    resp = cliente.delete("/produtos/999",
    headers=headers_admin
    )

    assert resp.status_code == 404


def test_usuario_nao_autenticado_nao_pode_criar_produto(cliente):
    resp = cliente.post("/produtos/", 
    json={  
        "name": "panela",
        "categoria": "cozinha",
        "preco": 100,
        "estoque": 10,
    })

    assert resp.status_code == 401
 

def test_usuario_nao_autenticado_nao_pode_atualizar_produto(cliente,produto, db):
    resp = cliente.put(f"/produtos/{produto.id}", 
    json={  
        "name": "panela inox",
        "categoria": "cozinha",
        "preco": 150,
        "estoque": 20,
    })

    verificar = db.query(Produto).filter(
    Produto.id == produto.id
    ).first()
    
    assert resp.status_code == 401
    assert verificar is not None
    assert verificar.name == "panela"
    assert verificar.categoria == "cozinha"
    assert verificar.preco == 100
    assert verificar.estoque == 10


def test_usuario_nao_autenticado_nao_pode_deletar_produto(cliente, produto, db):
    resp = cliente.delete(f"/produtos/{produto.id}",
    )

    verificar = db.query(Produto).filter(
    Produto.id == produto.id
    ).first()
    
    assert resp.status_code == 401
    assert verificar is not None

def _criar_produtos(db, itens):
    for indice, (name, categoria, preco) in enumerate(itens):
        db.add(Produto(
            name=name,
            categoria=categoria,
            preco=preco,
            estoque=10,
            data_criacao=datetime(2026, 1, 1 + indice),
        ))
    db.commit()


@pytest.fixture
def catalogo(db):
    _criar_produtos(db, [
        ("White Pony Camiseta", "Roupas", 50),
        ("Fone Bluetooth", "Eletronicos", 200),
        ("Capa Pony", "Acessorios", 20),
        ("Notebook", "Eletronicos", 3000),
    ])


def test_listar_produtos_catalogo_vazio_devolve_200_lista_vazia(cliente):
    resp = cliente.get("/produtos/")

    assert resp.status_code == 200
    assert resp.json() == []


def test_listar_produtos_sem_filtros_devolve_todos(cliente, catalogo):
    resp = cliente.get("/produtos/")

    assert resp.status_code == 200
    assert len(resp.json()) == 4


def test_busca_casa_parcial_e_ignora_caixa(cliente, catalogo):
    resp = cliente.get("/produtos/", params={"busca": "PoNy"})

    nomes = {p["name"] for p in resp.json()}
    assert resp.status_code == 200
    assert nomes == {"White Pony Camiseta", "Capa Pony"}


def test_busca_sem_resultado_devolve_200_lista_vazia(cliente, catalogo):
    resp = cliente.get("/produtos/", params={"busca": "inexistente"})

    assert resp.status_code == 200
    assert resp.json() == []


def test_busca_vazia_ou_so_espacos_e_ignorada(cliente, catalogo):
    vazia = cliente.get("/produtos/", params={"busca": ""})
    espacos = cliente.get("/produtos/", params={"busca": "   "})

    assert len(vazia.json()) == 4
    assert len(espacos.json()) == 4


def test_busca_trata_percentual_como_literal(cliente, catalogo):
    resp = cliente.get("/produtos/", params={"busca": "%"})

    assert resp.status_code == 200
    assert resp.json() == []


def test_filtro_por_categoria(cliente, catalogo):
    resp = cliente.get("/produtos/", params={"categoria": "Eletronicos"})

    nomes = {p["name"] for p in resp.json()}
    assert resp.status_code == 200
    assert nomes == {"Fone Bluetooth", "Notebook"}


def test_filtro_por_categoria_sem_resultado_devolve_200_lista_vazia(cliente, catalogo):
    resp = cliente.get("/produtos/", params={"categoria": "Jardim"})

    assert resp.status_code == 200
    assert resp.json() == []


def test_busca_e_categoria_combinados(cliente, catalogo):
    resp = cliente.get(
        "/produtos/", params={"busca": "pony", "categoria": "Acessorios"}
    )

    nomes = [p["name"] for p in resp.json()]
    assert resp.status_code == 200
    assert nomes == ["Capa Pony"]


def test_ordenar_preco_asc(cliente, catalogo):
    resp = cliente.get("/produtos/", params={"ordenar": "preco_asc"})

    assert resp.status_code == 200
    assert [p["preco"] for p in resp.json()] == [20, 50, 200, 3000]


def test_ordenar_preco_desc(cliente, catalogo):
    resp = cliente.get("/produtos/", params={"ordenar": "preco_desc"})

    assert resp.status_code == 200
    assert [p["preco"] for p in resp.json()] == [3000, 200, 50, 20]


def test_ordenar_recentes(cliente, catalogo):
    resp = cliente.get("/produtos/", params={"ordenar": "recentes"})

    assert resp.status_code == 200
    assert [p["name"] for p in resp.json()] == [
        "Notebook",
        "Capa Pony",
        "Fone Bluetooth",
        "White Pony Camiseta",
    ]


def test_ordenar_combinado_com_filtro(cliente, catalogo):
    resp = cliente.get(
        "/produtos/", params={"categoria": "Eletronicos", "ordenar": "preco_desc"}
    )

    assert [p["name"] for p in resp.json()] == ["Notebook", "Fone Bluetooth"]


def test_ordenar_invalido_devolve_422(cliente, catalogo):
    resp = cliente.get("/produtos/", params={"ordenar": "lixo"})

    assert resp.status_code == 422


def test_categorias_sem_duplicatas_e_em_ordem_alfabetica(cliente, catalogo):
    resp = cliente.get("/produtos/categorias")

    assert resp.status_code == 200
    assert resp.json() == ["Acessorios", "Eletronicos", "Roupas"]


def test_categorias_catalogo_vazio_devolve_200_lista_vazia(cliente):
    resp = cliente.get("/produtos/categorias")

    assert resp.status_code == 200
    assert resp.json() == []


# --- detalhe do produto e descricao ---

CAMPOS_PRODUTO = {"id", "name", "categoria", "preco", "estoque", "imagem_url", "descricao"}


@pytest.fixture
def produto_com_descricao(db):
    produto = Produto(
        name="Camiseta Pony",
        categoria="Roupas",
        preco=79.9,
        estoque=7,
        imagem_url="https://exemplo.com/camiseta.png",
        descricao="Algodao 100%.\nModelagem reta.",
    )
    db.add(produto)
    db.commit()
    return produto


def test_buscar_produto_devolve_200_com_todos_os_campos(cliente, produto_com_descricao):
    resp = cliente.get(f"/produtos/{produto_com_descricao.id}")

    assert resp.status_code == 200
    corpo = resp.json()
    assert CAMPOS_PRODUTO <= set(corpo)
    assert corpo["id"] == produto_com_descricao.id
    assert corpo["name"] == "Camiseta Pony"
    assert corpo["categoria"] == "Roupas"
    assert corpo["preco"] == 79.9
    assert corpo["estoque"] == 7
    assert corpo["imagem_url"] == "https://exemplo.com/camiseta.png"
    assert corpo["descricao"] == "Algodao 100%.\nModelagem reta."


def test_buscar_produto_inexistente_devolve_404(cliente, produto):
    resp = cliente.get(f"/produtos/{produto.id + 999}")

    assert resp.status_code == 404
    assert resp.json()["detail"] == "Produto não encontrado"


def test_buscar_produto_id_nao_numerico_devolve_422(cliente):
    resp = cliente.get("/produtos/abc")

    assert resp.status_code == 422


def test_buscar_produto_nao_exige_autenticacao(cliente, produto):
    resp = cliente.get(f"/produtos/{produto.id}")

    assert resp.status_code == 200


def test_buscar_produto_sem_descricao_devolve_null(cliente, produto):
    resp = cliente.get(f"/produtos/{produto.id}")

    assert resp.status_code == 200
    assert "descricao" in resp.json()
    assert resp.json()["descricao"] is None


def test_categorias_nao_e_capturada_pela_rota_de_id(cliente, produto):
    resp = cliente.get("/produtos/categorias")

    assert resp.status_code == 200
    assert resp.json() == ["cozinha"]


def test_admin_cria_produto_com_descricao(cliente, headers_admin, db):
    resp = cliente.post("/produtos/", headers=headers_admin, json={
        "name": "panela",
        "categoria": "cozinha",
        "preco": 100,
        "estoque": 10,
        "descricao": "Panela de inox",
    })

    assert resp.status_code == 201
    criado = db.query(Produto).filter(Produto.name == "panela").one()
    assert criado.descricao == "Panela de inox"
    assert cliente.get(f"/produtos/{criado.id}").json()["descricao"] == "Panela de inox"


def test_admin_cria_produto_sem_descricao(cliente, headers_admin, db):
    resp = cliente.post("/produtos/", headers=headers_admin, json={
        "name": "panela",
        "categoria": "cozinha",
        "preco": 100,
        "estoque": 10,
    })

    assert resp.status_code == 201
    criado = db.query(Produto).filter(Produto.name == "panela").one()
    assert criado.descricao is None


def test_admin_atualiza_descricao(cliente, headers_admin, produto_com_descricao, db):
    resp = cliente.put(f"/produtos/{produto_com_descricao.id}", headers=headers_admin, json={
        "descricao": "Nova descricao",
    })

    assert resp.status_code == 200
    db.refresh(produto_com_descricao)
    assert produto_com_descricao.descricao == "Nova descricao"
    assert produto_com_descricao.name == "Camiseta Pony"
    assert cliente.get(f"/produtos/{produto_com_descricao.id}").json()["descricao"] == "Nova descricao"


def test_atualizar_sem_enviar_descricao_preserva_a_existente(
    cliente, headers_admin, produto_com_descricao, db
):
    resp = cliente.put(f"/produtos/{produto_com_descricao.id}", headers=headers_admin, json={
        "preco": 99,
    })

    assert resp.status_code == 200
    db.refresh(produto_com_descricao)
    assert produto_com_descricao.descricao == "Algodao 100%.\nModelagem reta."
    assert float(produto_com_descricao.preco) == 99


def test_admin_limpa_descricao_com_string_vazia(cliente, headers_admin, produto_com_descricao, db):
    resp = cliente.put(f"/produtos/{produto_com_descricao.id}", headers=headers_admin, json={
        "descricao": "",
    })

    assert resp.status_code == 200
    db.refresh(produto_com_descricao)
    assert not produto_com_descricao.descricao


def test_listar_produtos_inclui_descricao(cliente, produto_com_descricao, produto):
    resp = cliente.get("/produtos/")

    assert resp.status_code == 200
    por_nome = {item["name"]: item for item in resp.json()}
    assert por_nome["Camiseta Pony"]["descricao"] == "Algodao 100%.\nModelagem reta."
    assert por_nome["panela"]["descricao"] is None
