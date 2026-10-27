import { requisitar } from "./api";

export const produtosService = {
    listar: async ({ busca, categoria, ordenar } = {}) => {
        const parametros = new URLSearchParams();

        if (busca) parametros.set("busca", busca);
        if (categoria) parametros.set("categoria", categoria);
        if (ordenar) parametros.set("ordenar", ordenar);

        const consulta = parametros.toString();
        const dados = await requisitar(
            consulta ? `/produtos/?${consulta}` : "/produtos/"
        );

        return Array.isArray(dados) ? dados : [];
    },

    listarCategorias: async () => {
        const dados = await requisitar("/produtos/categorias");

        return Array.isArray(dados) ? dados : [];
    },

    criar: (produto) =>
        requisitar("/produtos/", {
            metodo: "POST",
            corpo: produto,
            autenticado: true,
        }),

    atualizar: (id, produto) =>
        requisitar(`/produtos/${id}`, {
            metodo: "PUT",
            corpo: produto,
            autenticado: true,
        }),

    excluir: (id) =>
        requisitar(`/produtos/${id}`, {
            metodo: "DELETE",
            autenticado: true,
        }),

    enviarImagem: (id, arquivo) => {
        const formulario = new FormData();
        formulario.append("imagem", arquivo);

        return requisitar(`/produtos/${id}/imagem`, {
            metodo: "POST",
            corpo: formulario,
            autenticado: true,
        });
    },
};
