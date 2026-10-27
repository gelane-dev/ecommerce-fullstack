def _login(cliente, email, senha):
    return cliente.post("/login/", json={"email": email, "senha": senha})


def test_perfil_sem_token_e_negado(cliente):
    resp = cliente.get("/usuarios/me")

    assert resp.status_code == 401


def test_perfil_devolve_dados_sem_senha(cliente, headers_cliente, usuario_cliente):
    resp = cliente.get("/usuarios/me", headers=headers_cliente)

    corpo = resp.json()
    assert resp.status_code == 200
    assert corpo["id"] == usuario_cliente.id
    assert corpo["nome"] == "leonardo"
    assert corpo["email"] == "leo@gmail.com"
    assert corpo["tipo"] == "cliente"
    assert "data_criacao" in corpo
    assert "senha" not in corpo


def test_perfil_de_usuario_removido_devolve_404(cliente, headers_cliente, usuario_cliente, db):
    db.delete(usuario_cliente)
    db.commit()

    resp = cliente.get("/usuarios/me", headers=headers_cliente)

    assert resp.status_code == 404


def test_atualizar_nome(cliente, headers_cliente, usuario_cliente, db):
    resp = cliente.put("/usuarios/me", headers=headers_cliente, json={"nome": "Novo Nome"})

    db.refresh(usuario_cliente)
    assert resp.status_code == 200
    assert resp.json()["nome"] == "Novo Nome"
    assert usuario_cliente.name == "Novo Nome"
    assert usuario_cliente.email == "leo@gmail.com"


def test_atualizar_email(cliente, headers_cliente, usuario_cliente, db):
    resp = cliente.put("/usuarios/me", headers=headers_cliente, json={"email": "novo@gmail.com"})

    db.refresh(usuario_cliente)
    assert resp.status_code == 200
    assert usuario_cliente.email == "novo@gmail.com"
    assert usuario_cliente.name == "leonardo"


def test_atualizar_nome_e_email(cliente, headers_cliente, usuario_cliente, db):
    resp = cliente.put(
        "/usuarios/me",
        headers=headers_cliente,
        json={"nome": "Outro Nome", "email": "outro@gmail.com"},
    )

    db.refresh(usuario_cliente)
    assert resp.status_code == 200
    assert usuario_cliente.name == "Outro Nome"
    assert usuario_cliente.email == "outro@gmail.com"


def test_atualizar_email_de_outro_usuario_devolve_409(
    cliente, headers_cliente, usuario_cliente, usuario_admin, db
):
    resp = cliente.put("/usuarios/me", headers=headers_cliente, json={"email": "admin@gmail.com"})

    db.refresh(usuario_cliente)
    assert resp.status_code == 409
    assert usuario_cliente.email == "leo@gmail.com"


def test_atualizar_perfil_nao_permite_promover_a_admin(
    cliente, headers_cliente, usuario_cliente, db
):
    resp = cliente.put(
        "/usuarios/me",
        headers=headers_cliente,
        json={"nome": "Novo Nome", "role": "admin", "tipo": "admin"},
    )

    db.refresh(usuario_cliente)
    assert resp.status_code == 200
    assert usuario_cliente.role == "cliente"
    assert resp.json()["tipo"] == "cliente"


def test_atualizar_nome_curto_devolve_422(cliente, headers_cliente):
    resp = cliente.put("/usuarios/me", headers=headers_cliente, json={"nome": "ab"})

    assert resp.status_code == 422


def test_atualizar_email_invalido_devolve_422(cliente, headers_cliente):
    resp = cliente.put("/usuarios/me", headers=headers_cliente, json={"email": "nao-e-email"})

    assert resp.status_code == 422


def test_atualizar_perfil_sem_token_e_negado(cliente):
    resp = cliente.put("/usuarios/me", json={"nome": "Novo Nome"})

    assert resp.status_code == 401


def test_alterar_senha_com_senha_atual_correta(cliente, headers_cliente, usuario_cliente):
    resp = cliente.put(
        "/usuarios/me/senha",
        headers=headers_cliente,
        json={"senha_atual": "senha123", "senha_nova": "novasenha456"},
    )

    assert resp.status_code == 200
    assert _login(cliente, "leo@gmail.com", "novasenha456").status_code == 200
    assert _login(cliente, "leo@gmail.com", "senha123").status_code == 401


def test_alterar_senha_grava_hash_e_nao_texto_puro(
    cliente, headers_cliente, usuario_cliente, db
):
    cliente.put(
        "/usuarios/me/senha",
        headers=headers_cliente,
        json={"senha_atual": "senha123", "senha_nova": "novasenha456"},
    )

    db.refresh(usuario_cliente)
    assert usuario_cliente.senha != "novasenha456"


def test_alterar_senha_com_senha_atual_errada_devolve_401(
    cliente, headers_cliente, usuario_cliente
):
    resp = cliente.put(
        "/usuarios/me/senha",
        headers=headers_cliente,
        json={"senha_atual": "errada123", "senha_nova": "novasenha456"},
    )

    assert resp.status_code == 401
    assert _login(cliente, "leo@gmail.com", "senha123").status_code == 200
    assert _login(cliente, "leo@gmail.com", "novasenha456").status_code == 401


def test_alterar_senha_nova_curta_devolve_422(cliente, headers_cliente):
    resp = cliente.put(
        "/usuarios/me/senha",
        headers=headers_cliente,
        json={"senha_atual": "senha123", "senha_nova": "123"},
    )

    assert resp.status_code == 422


def test_alterar_senha_nova_igual_a_atual_devolve_400(cliente, headers_cliente):
    resp = cliente.put(
        "/usuarios/me/senha",
        headers=headers_cliente,
        json={"senha_atual": "senha123", "senha_nova": "senha123"},
    )

    assert resp.status_code == 400


def test_alterar_senha_sem_token_e_negado(cliente):
    resp = cliente.put(
        "/usuarios/me/senha",
        json={"senha_atual": "senha123", "senha_nova": "novasenha456"},
    )

    assert resp.status_code == 401


def test_atualizar_perfil_nao_devolve_senha(cliente, headers_cliente):
    resp = cliente.put("/usuarios/me", headers=headers_cliente, json={"nome": "Novo Nome"})

    assert resp.status_code == 200
    assert "senha" not in resp.json()


def test_alterar_senha_nao_devolve_senha(cliente, headers_cliente):
    resp = cliente.put(
        "/usuarios/me/senha",
        headers=headers_cliente,
        json={"senha_atual": "senha123", "senha_nova": "novasenha456"},
    )

    assert resp.status_code == 200
    assert "senha" not in resp.json()


def test_id_no_corpo_e_ignorado(cliente, headers_cliente, usuario_cliente, usuario_admin, db):
    resp = cliente.put(
        "/usuarios/me",
        headers=headers_cliente,
        json={"id": usuario_admin.id, "nome": "Novo Nome"},
    )

    db.refresh(usuario_cliente)
    db.refresh(usuario_admin)
    assert resp.status_code == 200
    assert usuario_cliente.name == "Novo Nome"
    assert usuario_admin.name == "Admin Teste"


def test_atualizar_email_difere_so_na_caixa_de_outro_usuario_devolve_409(
    cliente, headers_cliente, usuario_cliente, usuario_admin, db
):
    resp = cliente.put("/usuarios/me", headers=headers_cliente, json={"email": "ADMIN@gmail.com"})

    db.refresh(usuario_cliente)
    assert resp.status_code == 409
    assert usuario_cliente.email == "leo@gmail.com"


def test_atualizar_email_e_gravado_normalizado(cliente, headers_cliente, usuario_cliente, db):
    resp = cliente.put("/usuarios/me", headers=headers_cliente, json={"email": "  Novo@Gmail.COM "})

    db.refresh(usuario_cliente)
    assert resp.status_code == 200
    assert usuario_cliente.email == "novo@gmail.com"


def test_atualizar_proprio_email_so_trocando_caixa_e_permitido(
    cliente, headers_cliente, usuario_cliente, db
):
    resp = cliente.put("/usuarios/me", headers=headers_cliente, json={"email": "LEO@gmail.com"})

    db.refresh(usuario_cliente)
    assert resp.status_code == 200
    assert usuario_cliente.email == "leo@gmail.com"


def test_atualizar_nome_so_de_espacos_devolve_422(cliente, headers_cliente, usuario_cliente, db):
    resp = cliente.put("/usuarios/me", headers=headers_cliente, json={"nome": "     "})

    db.refresh(usuario_cliente)
    assert resp.status_code == 422
    assert usuario_cliente.name == "leonardo"


def test_atualizar_nome_remove_espacos_das_bordas(cliente, headers_cliente, usuario_cliente, db):
    resp = cliente.put("/usuarios/me", headers=headers_cliente, json={"nome": "  Novo Nome  "})

    db.refresh(usuario_cliente)
    assert resp.status_code == 200
    assert usuario_cliente.name == "Novo Nome"


def test_atualizar_com_nome_e_email_nulos_nao_altera_nada(
    cliente, headers_cliente, usuario_cliente, db
):
    resp = cliente.put("/usuarios/me", headers=headers_cliente, json={"nome": None, "email": None})

    db.refresh(usuario_cliente)
    assert resp.status_code == 200
    assert usuario_cliente.name == "leonardo"
    assert usuario_cliente.email == "leo@gmail.com"
