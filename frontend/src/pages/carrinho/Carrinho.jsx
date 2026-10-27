import "./Carrinho.css";
import { Link, useNavigate } from "react-router-dom";
import { usarCarrinho } from "../../hooks/usarCarrinho";
import { usarAutenticacao } from "../../hooks/usarAutenticacao";
import { usarEnvio } from "../../hooks/usarEnvio";
import { pedidosService } from "../../services/pedidosService";
import { ItemCarrinho } from "../../components/carrinho/ItemCarrinho";
import { ResumoCarrinho } from "../../components/carrinho/ResumoCarrinho";

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

    const { enviar, carregando, mensagem } = usarEnvio(
        pedidosService.criar
    );

    const finalizarPedido = async () => {

        if (!estaAutenticado) {
            navigate("/login");
            return;
        }

        const { ok } = await enviar(itens);

        if (ok) {
            limparCarrinho();
            navigate("/pedidos");
        }
    };

    return (
        <main className="carrinho">

            <h1>SACOLA</h1>

            {itens.length === 0 ? (
                <>
                    <p className="carrinho-vazio">
                        Sua sacola está vazia.
                    </p>

                    <Link to="/" className="carrinho-voltar">
                        CONTINUAR COMPRANDO
                    </Link>
                </>
            ) : (
                <>
                    <ul className="carrinho-lista">
                        {itens.map((item) => (
                            <ItemCarrinho
                                key={item.id}
                                item={item}
                                aoAlterarQuantidade={alterarQuantidade}
                                aoRemover={removerDoCarrinho}
                            />
                        ))}
                    </ul>

                    <ResumoCarrinho
                        valorTotal={valorTotal}
                        enviando={carregando}
                        mensagem={mensagem}
                        aoFinalizar={finalizarPedido}
                    />
                </>
            )}

        </main>
    );
};
