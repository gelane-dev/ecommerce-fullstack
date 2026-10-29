import { useContext } from "react";
import { ContextoAutenticacao } from "../context/AuthContext";

export function useAutenticacao() {

    const contexto = useContext(
        ContextoAutenticacao
    );

    if (!contexto) {
        throw new Error(
            "useAutenticacao deve ser utilizado dentro de um ProvedorAutenticacao"
        );
    }

    return contexto;
}