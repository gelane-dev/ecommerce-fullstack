import { Navigate } from "react-router-dom";
import { usarAutenticacao } from "../../hooks/usarAutenticacao";

export const RotaProtegida = ({ children, somenteAdmin = false }) => {
    const { usuario, estaAutenticado, carregando } = usarAutenticacao();

    if (carregando) {
        return null;
    }

    if (!estaAutenticado) {
        return <Navigate to="/login" replace />;
    }

    if (somenteAdmin && usuario.tipo !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};
