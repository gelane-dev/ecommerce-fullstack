import { Navigate } from "react-router-dom";
import { useAutenticacao } from "../../hooks/useAutenticacao";

export const RotaProtegida = ({ children, somenteAdmin = false }) => {
    const { usuario, estaAutenticado, carregando } = useAutenticacao();

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
