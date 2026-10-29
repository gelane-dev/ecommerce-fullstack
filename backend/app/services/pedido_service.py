from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import ItemPedido, Pedido, Produto, StatusPedido
from app.schemas import CriarPedido

TRANSICOES_VALIDAS = {
    StatusPedido.PENDENTE: [StatusPedido.PAGO, StatusPedido.CANCELADO],
    StatusPedido.PAGO: [StatusPedido.ENVIADO, StatusPedido.CANCELADO],
    StatusPedido.ENVIADO: [],
    StatusPedido.CANCELADO: [],
}


def criar_pedido(db: Session, usuario_id: int, dados: CriarPedido) -> dict:
    # o mesmo produto repetido na lista vira um item só; senão cada linha passaria
    # na checagem de estoque isoladamente e a soma poderia deixar o estoque negativo
    quantidades: dict[int, int] = {}
    for item in dados.itens:
        quantidades[item.produto_id] = quantidades.get(item.produto_id, 0) + item.quantidade

    itens_calculados = []
    for produto_id, quantidade in quantidades.items():
        # with_for_update trava a linha até o commit para pedidos simultâneos não venderem o mesmo estoque
        produto_db = (
            db.query(Produto).filter(Produto.id == produto_id).with_for_update().first()
        )
        if produto_db is None:
            raise HTTPException(status_code=404, detail="produto não encontrado")
        if produto_db.estoque < quantidade:
            raise HTTPException(status_code=400, detail="estoque menor que quantidade pedida")
        valor = produto_db.preco * quantidade
        itens_calculados.append(
            {
                "produto": produto_db,
                "quantidade": quantidade,
                "preco": produto_db.preco,
                "valor": valor,
            }
        )

    total = sum(item_calculado["valor"] for item_calculado in itens_calculados)
    novo_pedido = Pedido(usuario_id=usuario_id, total=total)
    db.add(novo_pedido)
    db.flush()

    for item_calculado in itens_calculados:
        db.add(
            ItemPedido(
                pedidos_id=novo_pedido.id,
                produto_id=item_calculado["produto"].id,
                quantidade=item_calculado["quantidade"],
                preco_unitario=item_calculado["preco"],
            )
        )
        item_calculado["produto"].estoque -= item_calculado["quantidade"]

    db.commit()
    return {
        "mensagem": "Pedido criado com sucesso",
        "pedido_id": novo_pedido.id,
        "total": total,
    }


def _serializar_pedido(pedido: Pedido) -> dict:
    return {
        "id": pedido.id,
        "total": pedido.total,
        "status": pedido.status,
        "data_criacao": pedido.data_criacao,
        "cliente": {
            "nome": pedido.usuario.name,
            "email": pedido.usuario.email,
        },
        "itens": [
            {
                "produto_id": item.produto_id,
                "nome": item.produto.name,
                "quantidade": item.quantidade,
                "preco_unitario": item.preco_unitario,
            }
            for item in pedido.itens
        ],
    }


def listar_pedidos_do_usuario(db: Session, usuario_id: int) -> list[dict]:
    pedidos = (
        db.query(Pedido)
        .filter(Pedido.usuario_id == usuario_id)
        .order_by(Pedido.data_criacao.desc())
        .all()
    )
    return [_serializar_pedido(pedido) for pedido in pedidos]


def listar_todos_pedidos(db: Session) -> list[dict]:
    pedidos = db.query(Pedido).order_by(Pedido.data_criacao.desc()).all()
    return [_serializar_pedido(pedido) for pedido in pedidos]


def mudar_status(db: Session, pedido_id: int, novo_status: StatusPedido) -> dict:
    pedido_db = db.query(Pedido).filter(Pedido.id == pedido_id).first()
    if pedido_db is None:
        raise HTTPException(status_code=404, detail="pedido não encontrado")
    if novo_status not in TRANSICOES_VALIDAS[pedido_db.status]:
        raise HTTPException(
            status_code=400,
            detail=(
                "Não é possível mudar de "
                f"'statuspedido.{pedido_db.status.name}' para "
                f"'statuspedido.{novo_status.name}'"
            ),
        )

    pedido_db.status = novo_status
    if novo_status == StatusPedido.CANCELADO:
        for item in pedido_db.itens:
            item.produto.estoque += item.quantidade

    db.commit()
    return {"mensagem": "status atualizado com sucesso!"}