import { useState } from "react";
import "./Carrinho.css";
import { Link, useNavigate } from "react-router-dom";
import { usarCarrinho } from "../../hooks/usarCarrinho";
import { usarAutenticacao } from "../../hooks/usarAutenticacao";

const formatarPreco = (valor) =>
    valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

export const Carrinho = () => {
    const navigate = useNavigate();

    const {
        itens,
        valorTotal,
        removerDoCarrinho,
        alterarQuantidade,
        limparCarrinho,
    } = usarCarrinho();

    const { estaAutenticado } = usarAutenticacao();

    const [mensagem, setMensagem] = useState("");
    const [enviando, setEnviando] = useState(false);

    const finalizarPedido = async () => {

        if (!estaAutenticado) {
            navigate("/login");
            return;
        }

        setEnviando(true);
        setMensagem("");

        try {
            const resposta = await fetch(
                "http://localhost:8001/pedidos/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "@WhitePony:token"
                        )}`,
                    },
                    body: JSON.stringify({
                        itens: itens.map((item) => ({
                            produto_id: item.id,
                            quantidade: item.quantidade,
                        })),
                    }),
                }
            );

            const dados = await resposta.json();

            if (resposta.ok) {
                limparCarrinho();
                navigate("/pedidos");
            } else {
                setMensagem(
                    typeof dados.detail === "string"
                        ? dados.detail
                        : "Não foi possível finalizar o pedido."
                );
            }
        } catch (erro) {
            setMensagem(
                "Não foi possível conectar ao servidor."
            );
        } finally {
            setEnviando(false);
        }
    };

    if (itens.length === 0) {
        return (
            <main className="carrinho">
                <h1>SACOLA</h1>

                <p className="carrinho-vazio">
                    Sua sacola está vazia.
                </p>

                <Link to="/" className="carrinho-voltar">
                    CONTINUAR COMPRANDO
                </Link>
            </main>
        );
    }

    return (
        <main className="carrinho">

            <h1>SACOLA</h1>

            <ul className="carrinho-lista">
                {itens.map((item) => (
                    <li key={item.id} className="carrinho-item">

                        <img
                            src={item.imagem_url}
                            alt={item.nome}
                            className="carrinho-imagem"
                        />

                        <div className="carrinho-info">
                            <span className="carrinho-nome">
                                {item.nome}
                            </span>

                            <span className="carrinho-preco">
                                {formatarPreco(item.preco)}
                            </span>
                        </div>

                        <div className="carrinho-quantidade">
                            <button
                                type="button"
                                aria-label="Diminuir quantidade"
                                onClick={() =>
                                    alterarQuantidade(
                                        item.id,
                                        item.quantidade - 1
                                    )
                                }
                            >
                                −
                            </button>

                            <span>{item.quantidade}</span>

                            <button
                                type="button"
                                aria-label="Aumentar quantidade"
                                onClick={() =>
                                    alterarQuantidade(
                                        item.id,
                                        item.quantidade + 1
                                    )
                                }
                            >
                                +
                            </button>
                        </div>

                        <span className="carrinho-subtotal">
                            {formatarPreco(item.preco * item.quantidade)}
                        </span>

                        <button
                            type="button"
                            className="carrinho-excluir"
                            onClick={() => removerDoCarrinho(item.id)}
                        >
                            EXCLUIR
                        </button>

                    </li>
                ))}
            </ul>

            <div className="carrinho-resumo">

                <div className="carrinho-total">
                    <span>TOTAL</span>
                    <strong>{formatarPreco(valorTotal)}</strong>
                </div>

                <button
                    type="button"
                    className="carrinho-finalizar"
                    onClick={finalizarPedido}
                    disabled={enviando}
                >
                    {enviando ? "ENVIANDO..." : "FINALIZAR PEDIDO"}
                </button>

                {mensagem && (
                    <p className="carrinho-mensagem">
                        {mensagem}
                    </p>
                )}

            </div>

        </main>
    );
};
