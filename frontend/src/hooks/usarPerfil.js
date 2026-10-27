import { useState, useEffect, useCallback } from "react";
import { usuariosService } from "../services/usuariosService";

export function usarPerfil() {

    const [perfil, setPerfil] = useState(null);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(true);

    const carregar = useCallback(async () => {
        setErro("");
        setCarregando(true);

        try {
            setPerfil(await usuariosService.obterPerfil());
        } catch (falha) {
            setPerfil(null);
            setErro(falha.message);
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    return { perfil, erro, carregando, carregar };
}
