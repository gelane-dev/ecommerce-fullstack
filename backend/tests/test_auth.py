import pytest
from app.models import Usuario

def test_cadastro_sucesso(cliente, db):
    resp = cliente.post("/cadastro/", json={
        "name": "leonardo",
        "email": "leo@gmail.com",
        "senha": "senha123",
    })

    assert resp.status_code == 201
    assert resp.json()["mensagem"] == "Usuário criado com sucesso"
    assert db.query(Usuario).count() == 1


def test_cadastro_email_duplicado(cliente, usuario_cliente, db):
    resp = cliente.post("/cadastro/", json={
        "name": "leonardo",
        "email": "leo@gmail.com",
        "senha": "senha123",
    })

    contagem = db.query(Usuario).count()

    assert resp.status_code == 409
    assert contagem == 1


@pytest.mark.parametrize("name, email, senha", [
    ("le", "leo@gmail.com", "senha123"),
    ("leonardo", "leo", "senha123"),
    ("leonardo", "leo@gmail.com", "123"),
], ids=["nome_curto", "email_invalido", "senha_curta"])


def test_cadastro_dados_invalidos(cliente, name, email, senha):
    resp = cliente.post("/cadastro/", json={
        "name": name,
        "email": email,
        "senha": senha,
    })

    assert resp.status_code == 422


def test_login_sucesso(cliente, usuario_cliente):
    resp = cliente.post("/login/", json={
        "email": "leo@gmail.com",
        "senha": "senha123",
    })

    assert resp.status_code == 200
    assert resp.json()["token_type"] == "bearer"
    assert resp.json()["access_token"]


def test_login_senha_errada(cliente, usuario_cliente):
    resp = cliente.post("/login/", json={
        "email": "leo@gmail.com",
        "senha": "errada",
    })

    assert resp.status_code == 401


def test_login_usuario_inexistente(cliente, db):
    resp = cliente.post("/login/", json={
        "email": "naoexiste@gmail.com",
        "senha": "senha123",
    })

    usuario = db.query(Usuario).filter(Usuario.email == "naoexiste@gmail.com").first()

    assert resp.status_code == 401
    assert usuario is None
    assert resp.json()["detail"] == "Credenciais inválidas"

def test_cadastro_email_difere_so_na_caixa_devolve_409(cliente, usuario_cliente, db):
    resp = cliente.post("/cadastro/", json={
        "name": "leonardo",
        "email": "LEO@GMAIL.COM",
        "senha": "senha123",
    })

    assert resp.status_code == 409
    assert db.query(Usuario).count() == 1


def test_cadastro_grava_email_normalizado(cliente, db):
    resp = cliente.post("/cadastro/", json={
        "name": "leonardo",
        "email": "  Leo@Gmail.COM ",
        "senha": "senha123",
    })

    assert resp.status_code == 201
    assert db.query(Usuario).one().email == "leo@gmail.com"


def test_cadastro_nome_so_de_espacos_devolve_422(cliente, db):
    resp = cliente.post("/cadastro/", json={
        "name": "      ",
        "email": "leo@gmail.com",
        "senha": "senha123",
    })

    assert resp.status_code == 422
    assert db.query(Usuario).count() == 0


def test_login_com_email_em_caixa_diferente(cliente, usuario_cliente):
    resp = cliente.post("/login/", json={"email": " LEO@Gmail.com ", "senha": "senha123"})

    assert resp.status_code == 200
    assert resp.json()["usuario"]["email"] == "leo@gmail.com"


def test_login_de_linha_antiga_com_email_em_maiuscula(cliente, db):
    from app.core.security import hash_senha

    db.add(Usuario(name="antigo", email="Antigo@Gmail.com", senha=hash_senha("senha123")))
    db.commit()

    resp = cliente.post("/login/", json={"email": "antigo@gmail.com", "senha": "senha123"})
    resp_maiuscula = cliente.post("/login/", json={"email": "ANTIGO@GMAIL.COM", "senha": "senha123"})

    assert resp.status_code == 200
    assert resp_maiuscula.status_code == 200
    assert resp.json()["usuario"]["email"] == "Antigo@Gmail.com"


def test_cadastro_nao_cria_sosia_de_linha_antiga_em_maiuscula(cliente, db):
    from app.core.security import hash_senha

    db.add(Usuario(name="antigo", email="Antigo@Gmail.com", senha=hash_senha("senha123")))
    db.commit()

    resp = cliente.post("/cadastro/", json={
        "name": "outro",
        "email": "antigo@gmail.com",
        "senha": "senha123",
    })

    assert resp.status_code == 409


def _contem_chave_senha(valor):
    if isinstance(valor, dict):
        return any(
            "senha" in chave.lower() or _contem_chave_senha(item)
            for chave, item in valor.items()
        )
    if isinstance(valor, list):
        return any(_contem_chave_senha(item) for item in valor)
    return False


def test_login_mantem_chaves_de_primeiro_nivel(cliente, usuario_cliente):
    resp = cliente.post("/login/", json={"email": "leo@gmail.com", "senha": "senha123"})

    assert resp.status_code == 200
    assert set(resp.json()) == {"access_token", "token_type", "usuario"}


def test_login_mantem_chaves_do_usuario(cliente, usuario_cliente):
    resp = cliente.post("/login/", json={"email": "leo@gmail.com", "senha": "senha123"})

    assert set(resp.json()["usuario"]) == {"id", "nome", "email", "tipo"}


def test_login_cliente_devolve_id_nome_e_tipo(cliente, usuario_cliente):
    resp = cliente.post("/login/", json={"email": "leo@gmail.com", "senha": "senha123"})

    usuario = resp.json()["usuario"]
    assert usuario["id"] == usuario_cliente.id
    assert usuario["nome"] == "leonardo"
    assert usuario["tipo"] == "cliente"


def test_login_admin_devolve_id_nome_e_tipo(cliente, usuario_admin):
    resp = cliente.post("/login/", json={"email": "admin@gmail.com", "senha": "admin123"})

    usuario = resp.json()["usuario"]
    assert usuario["id"] == usuario_admin.id
    assert usuario["nome"] == "Admin Teste"
    assert usuario["tipo"] == "admin"


def test_login_nao_devolve_senha_em_nenhum_nivel(cliente, usuario_cliente):
    resp = cliente.post("/login/", json={"email": "leo@gmail.com", "senha": "senha123"})

    assert not _contem_chave_senha(resp.json())
    assert "senha123" not in resp.text
    assert usuario_cliente.senha not in resp.text
