import "./TabelaAdmin.css";
import { BadgeStatus } from "../comuns/BadgeStatus";
import { TRANSICOES_STATUS } from "../../constants/statusPedido";
import { formatarPreco } from "../../utils/formatarPreco";

export const ListaPedidosAdmin = ({ pedidos, aoMudarStatus }) => {
    if (pedidos.length === 0) {
        return <p>Nenhum pedido realizado.</p>;
    }

    return (
        <table className="tabela-admin">
            <thead>
                <tr>
                    <th>Pedido</th>
                    <th>Cliente</th>
                    <th>Itens</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Alterar status</th>
                </tr>
            </thead>

            <tbody>
                {pedidos.map((pedido) => {
                    const proximos = TRANSICOES_STATUS[pedido.status] ?? [];

                    return (
                        <tr key={pedido.id}>
                            <td>#{pedido.id}</td>

                            <td>
                                {pedido.cliente.nome}
                                <br />
                                <small>{pedido.cliente.email}</small>
                            </td>

                            <td>
                                {pedido.itens.map((item) => (
                                    <div key={item.produto_id}>
                                        {item.quantidade}x {item.nome}
                                    </div>
                                ))}
                            </td>

                            <td>{formatarPreco(pedido.total)}</td>

                            <td>
                                <BadgeStatus status={pedido.status} />
                            </td>

                            <td>
                                {proximos.length === 0 ? (
                                    "—"
                                ) : (
                                    <select
                                        value=""
                                        onChange={(event) =>
                                            aoMudarStatus(
                                                pedido.id,
                                                event.target.value
                                            )
                                        }
                                    >
                                        <option value="" disabled>
                                            Selecionar...
                                        </option>

                                        {proximos.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
