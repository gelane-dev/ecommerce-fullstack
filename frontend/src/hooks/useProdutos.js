import { useState, useEffect, useCallback, useRef } from "react";
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

    const [produto, setProduto] = useState(null);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        let ativo = true;

        setProduto(null);
        setErro("");
        setCarregando(true);

        produtosService
            .buscar(id)
            .then((dados) => ativo && setProduto(dados))
            .catch((falha) => ativo && setErro(falha.message))
            .finally(() => ativo && setCarregando(false));

        return () => {
            ativo = false;
        };
    }, [id]);

    return { produto, erro, carregando };
}

export function useProdutos({ busca, categoria, ordenar } = {}) {

    const [produtos, setProdutos] = useState([]);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(true);

    // a requisição mais recente é a única que pode atualizar o estado
    const ultimaRequisicao = useRef(0);

    const carregar = useCallback(async () => {
        const requisicao = ++ultimaRequisicao.current;

        setErro("");
        setCarregando(true);

        try {
            const lista = await produtosService.listar({
                busca,
                categoria,
                ordenar,
            });

            if (requisicao !== ultimaRequisicao.current) return;

            setProdutos(lista);
        } catch (falha) {
            if (requisicao !== ultimaRequisicao.current) return;

            setProdutos([]);
            setErro(falha.message);
        } finally {
            if (requisicao === ultimaRequisicao.current) {
                setCarregando(false);
            }
        }
    }, [busca, categoria, ordenar]);

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
        carregando,
        carregar,
        salvar,
        excluir,
        enviarImagem,
    };
}
