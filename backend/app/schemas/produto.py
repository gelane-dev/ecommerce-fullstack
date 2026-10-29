from typing import Optional

from pydantic import BaseModel, ConfigDict


class CriarProduto(BaseModel):
    name: str
    categoria: str
    preco: float
    estoque: int
    descricao: Optional[str] = None


class AtualizarProduto(BaseModel):
    name: Optional[str] = None
    categoria: Optional[str] = None
    preco: Optional[float] = None
    estoque: Optional[int] = None
    descricao: Optional[str] = None


class ProdutoResponse(BaseModel):
    id: int
    name: str
    categoria: str
    preco: float
    estoque: int
    imagem_url: str | None = None
    descricao: str | None = None

    model_config = ConfigDict(from_attributes=True)