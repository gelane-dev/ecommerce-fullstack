import "./Header.css";
import { Link } from "react-router-dom";
import logoWhitePony from "../../assets/login-arte.png";
import { usarAutenticacao } from "../../hooks/usarAutenticacao";

export const Header = () => {
    const { usuario, estaAutenticado, sair } = usarAutenticacao();

    return (
        <header className="header">

            <nav className="header-esquerda">
                <Link to="/#colecao">
                    COLEÇÃO
                </Link>

                <Link to="/#indice">
                    CATEGORIAS
                </Link>

                <Link to="/#oferta">
                    EDIÇÃO LIMITADA
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
                <Link to="/buscar">
                    BUSCAR
                </Link>

                {estaAutenticado ? (
                    <>
                        <span className="header-usuario">
                            Olá, {usuario.nome}
                        </span>

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
                    SACOLA
                </Link>
            </nav>

        </header>
    );
};