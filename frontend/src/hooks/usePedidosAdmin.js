import { useState, useEffect } from "react";
import { pedidosService } from "../services/pedidosService";

export function usePedidosAdmin() {

    const [pedidos, setPedidos] = useState([]);
    const [erro, setErro] = useState("");
    // incrementada para buscar a lista de novo depois de uma mudança de status
    const [versao, setVersao] = useState(0);

    useEffect(() => {
        let ativo = true;

        pedidosService
            .listarTodos()
            .then((lista) => ativo && setPedidos(lista))
            .catch((falha) => ativo && setErro(falha.message));

        return () => {
            ativo = false;
        };
    }, [versao]);

    const mudarStatus = async (id, status) => {
        setErro("");

        try {
            await pedidosService.mudarStatus(id, status);
            setVersao((atual) => atual + 1);

            return true;
        } catch (falha) {
            setErro(falha.message);

            return false;
        }
    };

    return { pedidos, erro, mudarStatus };
}
