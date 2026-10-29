import { requisitar } from "./api";

export const usuariosService = {
    obterPerfil: () =>
        requisitar("/usuarios/me", { autenticado: true }),

    atualizarPerfil: (dados) =>
        requisitar("/usuarios/me", {
            metodo: "PUT",
            corpo: dados,
            autenticado: true,
        }),

    alterarSenha: ({ senha_atual, senha_nova }) =>
        requisitar("/usuarios/me/senha", {
            metodo: "PUT",
            corpo: { senha_atual, senha_nova },
            autenticado: true,
        }),

    enviarFoto: (arquivo) => {
        const formulario = new FormData();
        formulario.append("foto", arquivo);

        return requisitar("/usuarios/me/foto", {
            metodo: "POST",
            corpo: formulario,
            autenticado: true,
        });
    },
};
