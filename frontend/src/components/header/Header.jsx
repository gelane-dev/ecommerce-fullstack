import { useState } from "react";
import "./Header.css";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import logoWhitePony from "../../assets/login-arte.png";
import { useAutenticacao } from "../../hooks/useAutenticacao";
import { useCarrinho } from "../../hooks/useCarrinho";

const FormBusca = ({ valorInicial, aoBuscar }) => {
    const [termo, setTermo] = useState(valorInicial);
    const [anterior, setAnterior] = useState(valorInicial);

    // a URL mudou por fora (voltar, link): ajusta durante o render, sem remontar o input
    if (valorInicial !== anterior) {
        setAnterior(valorInicial);
        setTermo(valorInicial);
    }

    const mudar = (valor) => {
        setTermo(valor);

        // limpar o campo volta ao catálogo completo sem exigir novo submit
        if (valor === "" && valorInicial) aoBuscar("");
    };

    return (
        <form
            className="header-busca"
            role="search"
            onSubmit={(evento) => {
                evento.preventDefault();
                aoBuscar(termo.trim());
            }}
        >
            <label htmlFor="header-busca-campo">BUSCAR</label>
            <input
                id="header-busca-campo"
                type="search"
                value={termo}
                onChange={(e) => mudar(e.target.value)}
            />
        </form>
    );
};

const iniciaisDe = (nome = "") => {
    const partes = nome.trim().split(/\s+/).filter(Boolean);

    if (partes.length === 0) return "?";
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();

    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
};

export const Header = () => {
    const navigate = useNavigate();
    const [parametros] = useSearchParams();
    const buscaAtual = parametros.get("busca") ?? "";
    const naHome = useLocation().pathname === "/";

    // a busca vive na URL da Home; de outras páginas ela navega para lá
    const buscar = (termo) => {
        const proximos = new URLSearchParams(naHome ? parametros : undefined);

        if (termo) proximos.set("busca", termo);
        else proximos.delete("busca");

        const consulta = proximos.toString();

        navigate({ pathname: "/", search: consulta ? `?${consulta}` : "" });
    };

    const { usuario, estaAutenticado, sair } = useAutenticacao();
    const { quantidadeTotal } = useCarrinho();

    return (
        <header className="header">

            <nav className="header-esquerda">
                <Link to="/#colecao">
                    COLEÇÃO
                </Link>
            </nav>

            <Link
                to="/"
                className="header-logo"
                aria-label="White Pony — início"
            >
                <img
                    src={logoWhitePony}
                    alt="White Pony"
                />
            </Link>

            <nav className="header-direita">
                <FormBusca
                    valorInicial={buscaAtual}
                    aoBuscar={buscar}
                />

                {estaAutenticado ? (
                    <>
                        {usuario.tipo === "admin" && (
                            <Link to="/admin">
                                ADMIN
                            </Link>
                        )}

                        <Link to="/pedidos">
                            PEDIDOS
                        </Link>

                        <button
                            type="button"
                            className="header-sair"
                            onClick={sair}
                        >
                            SAIR
                        </button>
                    </>
                ) : (
                    <Link to="/login">
                        LOGIN
                    </Link>
                )}

                <Link to="/carrinho">
                    SACOLA ({quantidadeTotal})
                </Link>

                {estaAutenticado && (
                    <Link
                        to="/perfil"
                        className="header-avatar"
                        title={usuario.nome}
                        aria-label={`Meu perfil — ${usuario.nome}`}
                    >
                        {usuario.foto ? (
                            <img
                                src={usuario.foto}
                                alt=""
                                className="header-avatar-foto"
                            />
                        ) : (
                            <span aria-hidden="true">
                                {iniciaisDe(usuario.nome)}
                            </span>
                        )}
                    </Link>
                )}
            </nav>

        </header>
    );
};