import { useContext } from "react";
import { ContextoAutenticacao } from "../context/AuthContext";

export function usarAutenticacao() {

    const contexto = useContext(
        ContextoAutenticacao
    );

    if (!contexto) {
        throw new Error(
            "usarAutenticacao deve ser utilizado dentro de um ProvedorAutenticacao"
        );
    }

    return contexto;
}