import { useState } from "react";
import "./Admin.css";
import { usarProdutos } from "../../hooks/usarProdutos";
import { usarPedidosAdmin } from "../../hooks/usarPedidosAdmin";
import { FormularioProduto } from "../../components/admin/FormularioProduto";
import { TabelaProdutos } from "../../components/admin/TabelaProdutos";
import { ListaPedidosAdmin } from "../../components/admin/ListaPedidosAdmin";
import { Mensagem } from "../../components/comuns/Mensagem";

export const Admin = () => {
    const [produtoEditando, setProdutoEditando] = useState(null);

    const {
        produtos,
        erro: erroProdutos,
        carregar: recarregarProdutos,
        salvar,
        excluir,
        enviarImagem,
    } = usarProdutos();

    const {
        pedidos,
        erro: erroPedidos,
        mudarStatus,
    } = usarPedidosAdmin();

    const salvarProduto = async (dados) => {
        const salvou = await salvar(produtoEditando?.id, dados);

        if (salvou) {
            setProdutoEditando(null);
        }

        return salvou;
    };

    const excluirProduto = (produto) => {
        if (window.confirm(`Excluir "${produto.name}"?`)) {
            excluir(produto.id);
        }
    };

    const mudarStatusPedido = async (id, status) => {
        const mudou = await mudarStatus(id, status);

        // cancelar um pedido devolve o estoque dos produtos
        if (mudou) {
            recarregarProdutos();
        }
    };

    return (
        <main className="admin">

            <h1>ÁREA ADMIN</h1>

            <Mensagem texto={erroProdutos || erroPedidos} />

            <section>
                <FormularioProduto
                    produtoEditando={produtoEditando}
                    aoSalvar={salvarProduto}
                    aoCancelar={() => setProdutoEditando(null)}
                />
            </section>

            <section>
                <h2>PRODUTOS</h2>

                <TabelaProdutos
                    produtos={produtos}
                    aoEditar={setProdutoEditando}
                    aoExcluir={excluirProduto}
                    aoEnviarImagem={enviarImagem}
                />
            </section>

            <section>
                <h2>PEDIDOS</h2>

                <ListaPedidosAdmin
                    pedidos={pedidos}
                    aoMudarStatus={mudarStatusPedido}
                />
            </section>

        </main>
    );
};
