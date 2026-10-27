import { requisitar, ErroApi } from "./api";

export const produtosService = {
    // a API responde 404 quando não há produtos; para a vitrine isso é lista vazia
    listar: async () => {
        try {
            const dados = await requisitar("/produtos/");

            return Array.isArray(dados) ? dados : [];
        } catch (erro) {
            if (erro instanceof ErroApi && erro.status === 404) {
                return [];
            }

            throw erro;
        }
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
