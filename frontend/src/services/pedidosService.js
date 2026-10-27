import { requisitar } from "./api";

export const pedidosService = {
    criar: (itens) =>
        requisitar("/pedidos/", {
            metodo: "POST",
            corpo: {
                itens: itens.map((item) => ({
                    produto_id: item.id,
                    quantidade: item.quantidade,
                })),
            },
            autenticado: true,
        }),

    listarMeus: () =>
        requisitar("/pedidos/meus", { autenticado: true }),

    listarTodos: () =>
        requisitar("/pedidos/", { autenticado: true }),

    mudarStatus: (id, status) =>
        requisitar(`/pedidos/${id}/status`, {
            metodo: "PUT",
            corpo: { status },
            autenticado: true,
        }),
};
