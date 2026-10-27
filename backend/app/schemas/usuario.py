from pydantic import BaseModel, EmailStr, Field, field_validator


def _sem_espacos_nas_bordas(valor):
    return valor.strip() if isinstance(valor, str) else valor


def _email_normalizado(valor):
    return valor.strip().lower() if isinstance(valor, str) else valor


class CriarUsuario(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    email: EmailStr
    senha: str = Field(min_length=6)

    _normalizar_name = field_validator("name", mode="before")(_sem_espacos_nas_bordas)
    _normalizar_email = field_validator("email", mode="before")(_email_normalizado)


class Login(BaseModel):
    email: EmailStr
    senha: str

    _normalizar_email = field_validator("email", mode="before")(_email_normalizado)


class AtualizarUsuario(BaseModel):
    nome: str | None = Field(default=None, min_length=3, max_length=100)
    email: EmailStr | None = None

    _normalizar_nome = field_validator("nome", mode="before")(_sem_espacos_nas_bordas)
    _normalizar_email = field_validator("email", mode="before")(_email_normalizado)


class AlterarSenha(BaseModel):
    senha_atual: str
    senha_nova: str = Field(min_length=6)
