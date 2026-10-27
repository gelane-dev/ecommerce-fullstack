import "./ItemCarrinho.css";
import { formatarPreco } from "../../utils/formatarPreco";

export const ItemCarrinho = ({ item, aoAlterarQuantidade, aoRemover }) => (
    <li className="item-carrinho">

        <img
            src={item.imagem_url}
            alt={item.nome}
            className="item-carrinho-imagem"
        />

        <div className="item-carrinho-info">
            <span className="item-carrinho-nome">
                {item.nome}
            </span>

            <span className="item-carrinho-preco">
                {formatarPreco(item.preco)}
            </span>
        </div>

        <div className="item-carrinho-quantidade">
            <button
                type="button"
                aria-label="Diminuir quantidade"
                onClick={() =>
                    aoAlterarQuantidade(item.id, item.quantidade - 1)
                }
            >
                −
            </button>

            <span>{item.quantidade}</span>

            <button
                type="button"
                aria-label="Aumentar quantidade"
                onClick={() =>
                    aoAlterarQuantidade(item.id, item.quantidade + 1)
                }
            >
                +
            </button>
        </div>

        <span className="item-carrinho-subtotal">
            {formatarPreco(item.preco * item.quantidade)}
        </span>

        <button
            type="button"
            className="item-carrinho-excluir"
            onClick={() => aoRemover(item.id)}
        >
            EXCLUIR
        </button>

    </li>
);
