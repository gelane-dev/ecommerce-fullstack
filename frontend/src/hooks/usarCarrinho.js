import { useContext } from "react";
import { ContextoCarrinho } from "../context/CartContext";

export function usarCarrinho() {

    const contexto = useContext(
        ContextoCarrinho
    );

    if (!contexto) {
        throw new Error(
            "usarCarrinho deve ser utilizado dentro de um ProvedorCarrinho"
        );
    }

    return contexto;
}
