import { useState, useEffect, useCallback } from "react";
import { pedidosService } from "../services/pedidosService";

export function usarPedidosAdmin() {

    const [pedidos, setPedidos] = useState([]);
    const [erro, setErro] = useState("");

    const carregar = useCallback(async () => {
        try {
            setPedidos(await pedidosService.listarTodos());
        } catch (falha) {
            setErro(falha.message);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    const mudarStatus = async (id, status) => {
        setErro("");

        try {
            await pedidosService.mudarStatus(id, status);
            await carregar();

            return true;
        } catch (falha) {
            setErro(falha.message);

            return false;
        }
    };

    return { pedidos, erro, mudarStatus };
}
