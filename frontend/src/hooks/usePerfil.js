import { useState, useEffect, useCallback } from "react";
import { usuariosService } from "../services/usuariosService";

export function usePerfil() {

    // cada recarga incrementa a versão; enquanto a resposta da versão atual
    // não chega, o perfil está carregando
    const [versao, setVersao] = useState(0);
    const [resultado, setResultado] = useState({
        versao: -1,
        perfil: null,
        erro: "",
    });

    useEffect(() => {
        let ativo = true;

        usuariosService
            .obterPerfil()
            .then((perfil) => ativo && setResultado({ versao, perfil, erro: "" }))
            .catch((falha) =>
                ativo && setResultado({ versao, perfil: null, erro: falha.message })
            );

        return () => {
            ativo = false;
        };
    }, [versao]);

    const carregar = useCallback(() => setVersao((atual) => atual + 1), []);

    const carregando = resultado.versao !== versao;

    return {
        perfil: resultado.perfil,
        erro: carregando ? "" : resultado.erro,
        carregando,
        carregar,
    };
}
