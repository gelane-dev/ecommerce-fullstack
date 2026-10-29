from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError, OperationalError
from sqlalchemy.orm import Session

from app.core.security import hash_senha, verificar_senha
from app.dependencies import get_db, obter_usuario_atual
from app.models import Usuario
from app.schemas import AlterarSenha, AtualizarUsuario
from app.services.imagem_service import enviar_imagem

router = APIRouter(prefix="/usuarios", tags=["Usuários"])


def _buscar_usuario(db: Session, usuario_token: dict) -> Usuario:
    usuario = db.query(Usuario).filter(Usuario.id == usuario_token["id"]).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return usuario


def _dados_usuario(usuario: Usuario) -> dict:
    return {
        "id": usuario.id,
        "nome": usuario.name,
        "email": usuario.email,
        "tipo": usuario.role,
        "foto": usuario.foto_url,
        "data_criacao": usuario.data_criacao,
    }


@router.get("/me")
def buscar_meu_perfil(
    usuario_token: dict = Depends(obter_usuario_atual),
    db: Session = Depends(get_db),
):
    try:
        return _dados_usuario(_buscar_usuario(db, usuario_token))
    except HTTPException:
        raise
    except OperationalError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao consultar o banco de dados")


@router.put("/me")
def atualizar_meu_perfil(
    dados: AtualizarUsuario,
    usuario_token: dict = Depends(obter_usuario_atual),
    db: Session = Depends(get_db),
):
    try:
        usuario = _buscar_usuario(db, usuario_token)

        # lista branca: só nome e email chegam ao modelo (role nunca)
        if dados.nome is not None:
            usuario.name = dados.nome
        if dados.email is not None:
            em_uso = (
                db.query(Usuario)
                .filter(func.lower(Usuario.email) == dados.email, Usuario.id != usuario.id)
                .first()
            )
            if em_uso is not None:
                raise HTTPException(status_code=409, detail="E-mail já cadastrado")
            usuario.email = dados.email

        db.commit()
        db.refresh(usuario)
        return _dados_usuario(usuario)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="E-mail já cadastrado")
    except HTTPException:
        raise
    except OperationalError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao atualizar usuário no banco de dados")


@router.put("/me/senha")
def alterar_minha_senha(
    dados: AlterarSenha,
    usuario_token: dict = Depends(obter_usuario_atual),
    db: Session = Depends(get_db),
):
    try:
        usuario = _buscar_usuario(db, usuario_token)

        if not verificar_senha(dados.senha_atual, usuario.senha):
            raise HTTPException(status_code=401, detail="Senha atual incorreta")
        if dados.senha_nova == dados.senha_atual:
            raise HTTPException(status_code=400, detail="A nova senha deve ser diferente da atual")

        usuario.senha = hash_senha(dados.senha_nova)
        db.commit()
        return {"mensagem": "Senha alterada com sucesso"}
    except HTTPException:
        raise
    except OperationalError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao alterar senha no banco de dados")


@router.post("/me/foto")
def enviar_minha_foto(
    foto: UploadFile = File(...),
    usuario_token: dict = Depends(obter_usuario_atual),
    db: Session = Depends(get_db),
):
    try:
        usuario = _buscar_usuario(db, usuario_token)

        usuario.foto_url = enviar_imagem(foto, "ecommerce/usuarios")
        db.commit()
        db.refresh(usuario)
        return _dados_usuario(usuario)
    except HTTPException:
        raise
    except OperationalError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao salvar foto no banco de dados")
