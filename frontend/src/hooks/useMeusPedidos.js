import { useState, useEffect } from "react";
import { pedidosService } from "../services/pedidosService";

export function useMeusPedidos() {

    const [pedidos, setPedidos] = useState([]);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        pedidosService
            .listarMeus()
            .then(setPedidos)
            .catch((falha) => setErro(falha.message))
            .finally(() => setCarregando(false));
    }, []);

    return { pedidos, erro, carregando };
}
