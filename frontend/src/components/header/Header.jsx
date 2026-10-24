import "./Header.css";
import { Link } from "react-router-dom";
import logoWhitePony from "../../assets/login-arte.png";

export const Header = () => {
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

                <Link to="/login">
                    CONTA
                </Link>

                <Link to="/carrinho">
                    SACOLA
                </Link>
            </nav>

        </header>
    );
};