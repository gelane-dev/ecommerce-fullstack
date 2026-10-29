import "./TabelaAdmin.css";
import { formatarPreco } from "../../utils/formatarPreco";

export const TabelaProdutos = ({
    produtos,
    aoEditar,
    aoExcluir,
    aoEnviarImagem,
}) => {
    if (produtos.length === 0) {
        return <p>Nenhum produto cadastrado.</p>;
    }

    return (
        <div className="tabela-admin-scroll">
            <table className="tabela-admin">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Preço</th>
                        <th>Estoque</th>
                        <th>Imagem</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {produtos.map((produto) => (
                        <tr key={produto.id}>
                            <td>{produto.id}</td>
                            <td>{produto.name}</td>
                            <td>{produto.categoria}</td>
                            <td>{formatarPreco(produto.preco)}</td>
                            <td>{produto.estoque}</td>

                            <td>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(event) =>
                                        aoEnviarImagem(
                                            produto.id,
                                            event.target.files[0]
                                        )
                                    }
                                />
                            </td>

                            <td className="tabela-admin-acoes">
                                <button
                                    type="button"
                                    onClick={() => aoEditar(produto)}
                                >
                                    EDITAR
                                </button>

                                <button
                                    type="button"
                                    className="tabela-admin-excluir"
                                    onClick={() => aoExcluir(produto)}
                                >
                                    EXCLUIR
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
