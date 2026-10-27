import "./ResumoCarrinho.css";
import { Mensagem } from "../comuns/Mensagem";
import { formatarPreco } from "../../utils/formatarPreco";

export const ResumoCarrinho = ({
    valorTotal,
    enviando,
    mensagem,
    aoFinalizar,
}) => (
    <div className="resumo-carrinho">

        <div className="resumo-carrinho-total">
            <span>TOTAL</span>
            <strong>{formatarPreco(valorTotal)}</strong>
        </div>

        <button
            type="button"
            className="resumo-carrinho-finalizar"
            onClick={aoFinalizar}
            disabled={enviando}
        >
            {enviando ? "ENVIANDO..." : "FINALIZAR PEDIDO"}
        </button>

        <Mensagem texto={mensagem} />

    </div>
);
