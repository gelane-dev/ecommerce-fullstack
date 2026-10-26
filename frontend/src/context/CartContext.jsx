import {
    createContext,
    useState,
    useEffect,
} from "react";

export const ContextoCarrinho = createContext(null);

const CHAVE_CARRINHO = "@WhitePony:carrinho";

function carregarCarrinho() {
    try {
        const salvo = localStorage.getItem(CHAVE_CARRINHO);

        return salvo ? JSON.parse(salvo) : [];
    } catch (erro) {
        return [];
    }
}

export function ProvedorCarrinho({ children }) {

    const [itens, setItens] = useState(carregarCarrinho);

    useEffect(() => {

        localStorage.setItem(
            CHAVE_CARRINHO,
            JSON.stringify(itens)
        );

    }, [itens]);

    const adicionarAoCarrinho = (produto) => {

        setItens((atuais) => {

            const existente = atuais.find(
                (item) => item.id === produto.id
            );

            if (existente) {
                return atuais.map((item) =>
                    item.id === produto.id
                        ? { ...item, quantidade: item.quantidade + 1 }
                        : item
                );
            }

            return [
                ...atuais,
                {
                    id: produto.id,
                    nome: produto.name,
                    preco: Number(produto.preco),
                    quantidade: 1,
                    imagem_url: produto.imagem_url,
                },
            ];
        });
    };

    const removerDoCarrinho = (id) => {
        setItens((atuais) =>
            atuais.filter((item) => item.id !== id)
        );
    };

    const alterarQuantidade = (id, novaQtd) => {

        if (novaQtd < 1) {
            removerDoCarrinho(id);
            return;
        }

        setItens((atuais) =>
            atuais.map((item) =>
                item.id === id
                    ? { ...item, quantidade: novaQtd }
                    : item
            )
        );
    };

    const limparCarrinho = () => {
        setItens([]);
    };

    const quantidadeTotal = itens.reduce(
        (soma, item) => soma + item.quantidade,
        0
    );

    const valorTotal = itens.reduce(
        (soma, item) => soma + item.preco * item.quantidade,
        0
    );

    return (
        <ContextoCarrinho.Provider
            value={{
                itens,
                quantidadeTotal,
                valorTotal,
                adicionarAoCarrinho,
                removerDoCarrinho,
                alterarQuantidade,
                limparCarrinho,
            }}
        >
            {children}
        </ContextoCarrinho.Provider>
    );
}
