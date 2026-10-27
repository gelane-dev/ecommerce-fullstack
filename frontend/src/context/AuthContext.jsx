import {
    createContext,
    useState,
    useEffect,
} from "react";

export const ContextoAutenticacao = createContext(null);

export function ProvedorAutenticacao({ children }) {

    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {

        const tokenSalvo = localStorage.getItem(
            "@WhitePony:token"
        );

        const usuarioSalvo = localStorage.getItem(
            "@WhitePony:usuario"
        );

        if (tokenSalvo && usuarioSalvo) {

            try {

                const dadosUsuario = JSON.parse(usuarioSalvo);

                setUsuario(dadosUsuario);

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
            }
        }

        setCarregando(false);

    }, []);

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
                carregando,
                entrar,
                sair,
                atualizarUsuario,
            }}
        >
            {children}
        </ContextoAutenticacao.Provider>
    );
}