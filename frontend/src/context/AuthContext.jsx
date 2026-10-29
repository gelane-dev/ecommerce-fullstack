import { useState } from "react";
import { ContextoAutenticacao } from "./contextos";

// lido na criação do estado: a sessão já existe no primeiro render,
// sem um efeito extra só para copiar o localStorage
function carregarUsuarioSalvo() {

    const tokenSalvo = localStorage.getItem(
        "@WhitePony:token"
    );

    const usuarioSalvo = localStorage.getItem(
        "@WhitePony:usuario"
    );

    if (!tokenSalvo || !usuarioSalvo) {
        return null;
    }

    try {

        return JSON.parse(usuarioSalvo);

    } catch (erro) {

        console.error(
            "Erro ao carregar dados do usuário:",
            erro
        );

        localStorage.removeItem(
            "@WhitePony:token"
        );

        localStorage.removeItem(
            "@WhitePony:usuario"
        );

        return null;
    }
}

export function ProvedorAutenticacao({ children }) {

    const [usuario, setUsuario] = useState(carregarUsuarioSalvo);

    const entrar = (token, dadosUsuario) => {

        localStorage.setItem(
            "@WhitePony:token",
            token
        );

        localStorage.setItem(
            "@WhitePony:usuario",
            JSON.stringify(dadosUsuario)
        );

        setUsuario(dadosUsuario);
    };

    const sair = () => {

        localStorage.removeItem(
            "@WhitePony:token"
        );

        localStorage.removeItem(
            "@WhitePony:usuario"
        );

        setUsuario(null);
    };

    // mantém memória e localStorage alinhados com o que a API gravou
    const atualizarUsuario = (dadosParciais) => {

        const atualizado = { ...usuario, ...dadosParciais };

        localStorage.setItem(
            "@WhitePony:usuario",
            JSON.stringify(atualizado)
        );

        setUsuario(atualizado);
    };

    return (
        <ContextoAutenticacao.Provider
            value={{
                usuario,
                estaAutenticado: !!usuario,
                // a sessão é lida de forma síncrona; mantido para quem já consome o campo
                carregando: false,
                entrar,
                sair,
                atualizarUsuario,
            }}
        >
            {children}
        </ContextoAutenticacao.Provider>
    );
}