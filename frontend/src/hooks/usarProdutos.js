import { useState, useEffect, useCallback } from "react";
import { produtosService } from "../services/produtosService";

export function usarProdutos() {

    const [produtos, setProdutos] = useState([]);
    const [erro, setErro] = useState("");

    const carregar = useCallback(async () => {
        try {
            setProdutos(await produtosService.listar());
        } catch (falha) {
            setProdutos([]);
            setErro(falha.message);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    // executa uma mudança, recarrega a lista e informa se deu certo
    const executar = async (acao) => {
        setErro("");

        try {
            await acao();
            await carregar();

            return true;
        } catch (falha) {
            setErro(falha.message);

            return false;
        }
    };

    const salvar = (id, dados) =>
        executar(() =>
            id
                ? produtosService.atualizar(id, dados)
                : produtosService.criar(dados)
        );

    const excluir = (id) =>
        executar(() => produtosService.excluir(id));

    const enviarImagem = (id, arquivo) =>
        executar(() => produtosService.enviarImagem(id, arquivo));

    return {
        produtos,
        erro,
        carregar,
        salvar,
        excluir,
        enviarImagem,
    };
}
