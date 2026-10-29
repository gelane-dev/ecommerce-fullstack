import { useState, useEffect, useCallback } from "react";
import { produtosService } from "../services/produtosService";

export function useCategorias() {

    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        let ativo = true;

        // sem categorias o filtro simplesmente não aparece; a vitrine segue funcionando
        produtosService
            .listarCategorias()
            .then((lista) => ativo && setCategorias(lista))
            .catch(() => ativo && setCategorias([]));

        return () => {
            ativo = false;
        };
    }, []);

    return { categorias };
}

export function useProduto(id) {

    // guarda de qual id é o resultado: se o id mudou e a resposta nova
    // ainda não chegou, o produto está carregando
    const [resultado, setResultado] = useState({
        id: null,
        produto: null,
        erro: "",
    });

    useEffect(() => {
        let ativo = true;

        produtosService
            .buscar(id)
            .then((produto) => ativo && setResultado({ id, produto, erro: "" }))
            .catch((falha) =>
                ativo && setResultado({ id, produto: null, erro: falha.message })
            );

        return () => {
            ativo = false;
        };
    }, [id]);

    const carregando = resultado.id !== id;

    return {
        produto: carregando ? null : resultado.produto,
        erro: carregando ? "" : resultado.erro,
        carregando,
    };
}

export function useProdutos({ busca, categoria, ordenar } = {}) {

    // cada recarga incrementa a versão; junto com os filtros ela identifica
    // a busca atual, e só a resposta dessa busca encerra o carregamento
    const [versao, setVersao] = useState(0);
    const chave = JSON.stringify([busca, categoria, ordenar, versao]);

    const [resultado, setResultado] = useState({
        chave: null,
        produtos: [],
        erro: "",
    });
    const [erroAcao, setErroAcao] = useState("");

    useEffect(() => {
        let ativo = true;

        produtosService
            .listar({ busca, categoria, ordenar })
            .then((lista) =>
                ativo && setResultado({ chave, produtos: lista, erro: "" })
            )
            .catch((falha) =>
                ativo && setResultado({ chave, produtos: [], erro: falha.message })
            );

        return () => {
            ativo = false;
        };
    }, [chave, busca, categoria, ordenar]);

    const carregar = useCallback(() => {
        setErroAcao("");
        setVersao((atual) => atual + 1);
    }, []);

    const carregando = resultado.chave !== chave;

    // executa uma mudança, pede a lista de novo e informa se deu certo
    const executar = async (acao) => {
        setErroAcao("");

        try {
            await acao();
            carregar();

            return true;
        } catch (falha) {
            setErroAcao(falha.message);

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
        produtos: resultado.produtos,
        erro: erroAcao || (carregando ? "" : resultado.erro),
        carregando,
        carregar,
        salvar,
        excluir,
        enviarImagem,
    };
}
