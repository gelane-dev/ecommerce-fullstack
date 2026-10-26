import { useState, useEffect } from "react";
import "./MeusPedidos.css";
import { Link } from "react-router-dom";
import { usarAutenticacao } from "../../hooks/usarAutenticacao";

const formatarPreco = (valor) =>
    Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

export const MeusPedidos = () => {
    const { estaAutenticado, carregando } = usarAutenticacao();

    const [pedidos, setPedidos] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [buscando, setBuscando] = useState(true);

    useEffect(() => {

        if (carregando || !estaAutenticado) {
            return;
        }

        fetch("http://localhost:8001/pedidos/meus", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "@WhitePony:token"
                )}`,
            },
        })
            .then((resposta) => resposta.json().then((dados) => ({
                ok: resposta.ok,
                dados,
            })))
            .then(({ ok, dados }) => {
                if (ok && Array.isArray(dados)) {
                    setPedidos(dados);
                } else {
                    setMensagem("Não foi possível carregar seus pedidos.");
                }
            })
            .catch(() => {
                setMensagem("Não foi possível conectar ao servidor.");
            })
            .finally(() => setBuscando(false));

    }, [carregando, estaAutenticado]);

    if (carregando) {
        return null;
    }

    if (!estaAutenticado) {
        return (
            <main className="pedidos">
                <h1>MEUS PEDIDOS</h1>

                <p>Faça login para ver seus pedidos.</p>

                <Link to="/login">ENTRAR</Link>
            </main>
        );
    }

    return (
        <main className="pedidos">

            <h1>MEUS PEDIDOS</h1>

            {mensagem && (
                <p className="pedidos-mensagem">{mensagem}</p>
            )}

            {!buscando && !mensagem && pedidos.length === 0 && (
                <p>Você ainda não fez nenhum pedido.</p>
            )}

            <ul className="pedidos-lista">
                {pedidos.map((pedido) => (
                    <li key={pedido.id} className="pedidos-item">

                        <div className="pedidos-cabecalho">
                            <strong>Pedido #{pedido.id}</strong>

                            <span
                                className={`pedidos-status pedidos-status-${pedido.status}`}
                            >
                                {pedido.status}
                            </span>
                        </div>

                        <span className="pedidos-data">
                            {new Date(pedido.data_criacao).toLocaleDateString("pt-BR")}
                        </span>

                        <ul className="pedidos-itens">
                            {pedido.itens.map((item) => (
                                <li key={item.produto_id}>
                                    {item.quantidade}x {item.nome} —{" "}
                                    {formatarPreco(item.preco_unitario)}
                                </li>
                            ))}
                        </ul>

                        <strong className="pedidos-total">
                            Total: {formatarPreco(pedido.total)}
                        </strong>

                    </li>
                ))}
            </ul>

        </main>
    );
};
