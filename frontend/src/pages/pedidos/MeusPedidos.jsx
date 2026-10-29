import "./MeusPedidos.css";
import { useMeusPedidos } from "../../hooks/useMeusPedidos";
import { CartaoPedido } from "../../components/pedidos/CartaoPedido";
import { Mensagem } from "../../components/comuns/Mensagem";

export const MeusPedidos = () => {
    const { pedidos, erro, carregando } = useMeusPedidos();

    return (
        <main className="pedidos">

            <h1>MEUS PEDIDOS</h1>

            <Mensagem texto={erro} />

            {!carregando && !erro && pedidos.length === 0 && (
                <p>Você ainda não fez nenhum pedido.</p>
            )}

            <ul className="pedidos-lista">
                {pedidos.map((pedido) => (
                    <CartaoPedido key={pedido.id} pedido={pedido} />
                ))}
            </ul>

        </main>
    );
};
