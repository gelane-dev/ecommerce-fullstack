import { requisitar } from "./api";

export const autenticacaoService = {
    login: ({ email, senha }) =>
        requisitar("/login/", {
            metodo: "POST",
            corpo: { email, senha },
        }),

    cadastrar: ({ name, email, senha }) =>
        requisitar("/cadastro/", {
            metodo: "POST",
            corpo: { name, email, senha },
        }),
};
