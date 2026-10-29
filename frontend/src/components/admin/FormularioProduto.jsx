import { useEffect } from "react";
import "./FormularioProduto.css";
import { useFormulario } from "../../hooks/useFormulario";

const VAZIO = {
    name: "",
    categoria: "",
    preco: "",
    estoque: "",
    descricao: "",
};

export const FormularioProduto = ({
    produtoEditando,
    aoSalvar,
    aoCancelar,
}) => {
    const { valores, alterar, definir, limpar } = useFormulario(VAZIO);

    useEffect(() => {
        if (produtoEditando) {
            definir({
                name: produtoEditando.name,
                categoria: produtoEditando.categoria,
                preco: String(produtoEditando.preco),
                estoque: String(produtoEditando.estoque),
                descricao: produtoEditando.descricao ?? "",
            });
        } else {
            limpar();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [produtoEditando]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const salvou = await aoSalvar({
            name: valores.name,
            categoria: valores.categoria,
            preco: Number(valores.preco),
            estoque: Number(valores.estoque),
            descricao: valores.descricao,
        });

        if (salvou) {
            limpar();
        }
    };

    return (
        <form className="formulario-produto" onSubmit={handleSubmit}>

            <h2>
                {produtoEditando ? "EDITAR PRODUTO" : "NOVO PRODUTO"}
            </h2>

            <input
                name="name"
                placeholder="Nome"
                value={valores.name}
                onChange={alterar}
                required
            />

            <input
                name="categoria"
                placeholder="Categoria"
                value={valores.categoria}
                onChange={alterar}
                required
            />

            <input
                name="preco"
                type="number"
                min="0"
                step="0.01"
                placeholder="Preço"
                value={valores.preco}
                onChange={alterar}
                required
            />

            <input
                name="estoque"
                type="number"
                min="0"
                max="1000"
                step="1"
                placeholder="Estoque"
                value={valores.estoque}
                onChange={alterar}
                required
            />

            <textarea
                name="descricao"
                placeholder="Descrição (opcional)"
                rows={4}
                value={valores.descricao}
                onChange={alterar}
            />

            <div className="formulario-produto-acoes">
                <button type="submit" className="formulario-produto-salvar">
                    {produtoEditando ? "SALVAR" : "CADASTRAR"}
                </button>

                {produtoEditando && (
                    <button
                        type="button"
                        className="formulario-produto-cancelar"
                        onClick={aoCancelar}
                    >
                        CANCELAR
                    </button>
                )}
            </div>

        </form>
    );
};
