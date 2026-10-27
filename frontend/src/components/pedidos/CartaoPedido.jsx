import "./CartaoPedido.css";
import { BadgeStatus } from "../comuns/BadgeStatus";
import { formatarPreco } from "../../utils/formatarPreco";

export const CartaoPedido = ({ pedido }) => (
    <li className="cartao-pedido">

        <div className="cartao-pedido-cabecalho">
            <strong>Pedido #{pedido.id}</strong>

            <BadgeStatus status={pedido.status} />
        </div>

        <span className="cartao-pedido-data">
            {new Date(pedido.data_criacao).toLocaleDateString("pt-BR")}
        </span>

        <ul className="cartao-pedido-itens">
            {pedido.itens.map((item) => (
                <li key={item.produto_id}>
                    {item.quantidade}x {item.nome} —{" "}
                    {formatarPreco(item.preco_unitario)}
                </li>
            ))}
        </ul>

        <strong className="cartao-pedido-total">
            Total: {formatarPreco(pedido.total)}
        </strong>

    </li>
);
