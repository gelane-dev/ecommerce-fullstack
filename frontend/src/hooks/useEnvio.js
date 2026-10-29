import { useState } from "react";

// envolve uma ação assíncrona (chamada à API) com estado de carregando e mensagem de erro
export function useEnvio(acao) {

    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const enviar = async (...argumentos) => {

        setCarregando(true);
        setMensagem("");

        try {
            const resultado = await acao(...argumentos);

            return { ok: true, resultado };
        } catch (erro) {
            setMensagem(erro.message);

            return { ok: false };
        } finally {
            setCarregando(false);
        }
    };

    return { enviar, carregando, mensagem };
}
