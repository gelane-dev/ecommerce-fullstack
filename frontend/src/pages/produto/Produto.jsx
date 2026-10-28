import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usarProduto, usarProdutos } from '../../hooks/usarProdutos'
import { usarCarrinho } from '../../hooks/usarCarrinho'
import { formatarPreco } from '../../utils/formatarPreco'
import { Mensagem } from '../../components/comuns/Mensagem'
import { ProdutoCard } from '../../components/produtos/ProdutoCard'
import './Produto.css'

const LIMITE_ULTIMAS_UNIDADES = 5
const MAXIMO_RELACIONADOS = 4
const ERRO_CONEXAO = 'Não foi possível conectar ao servidor.'
const ID_VALIDO = /^[1-9]\d*$/

const rotuloEstoque = (estoque) => {
    if (estoque <= 0) return 'Esgotado'
    if (estoque <= LIMITE_ULTIMAS_UNIDADES) {
        return `Últimas ${estoque} ${estoque === 1 ? 'unidade' : 'unidades'}`
    }
    return 'Em estoque'
}

const Relacionados = ({ produto }) => {
    const { produtos } = usarProdutos({ categoria: produto.categoria })

    const relacionados = produtos
        .filter((item) => item.id !== produto.id)
        .slice(0, MAXIMO_RELACIONADOS)

    if (relacionados.length === 0) return null

    return (
        <section className="produto-secao" aria-labelledby="produto-relacionados">
            <h2 id="produto-relacionados" className="produto-subtitulo">
                Você também pode gostar
            </h2>

            <div className="produto-relacionados">
                {relacionados.map((item) => (
                    <ProdutoCard key={item.id} produto={item} />
                ))}
            </div>
        </section>
    )
}

const Detalhe = ({ produto }) => {
    const { itens, adicionarAoCarrinho, alterarQuantidade } = usarCarrinho()
    const [quantidade, setQuantidade] = useState(1)
    const [aviso, setAviso] = useState(null)
    const [imagemQuebrada, setImagemQuebrada] = useState(false)

    useEffect(() => {
        const anterior = document.title
        document.title = `${produto.name} | White Pony`
        return () => {
            document.title = anterior
        }
    }, [produto.name])

    const semEstoque = produto.estoque <= 0
    const rotulo = rotuloEstoque(produto.estoque)
    const linkCategoria = `/?categoria=${encodeURIComponent(produto.categoria)}#colecao`

    const mudarQuantidade = (nova) => {
        setQuantidade(Math.min(Math.max(nova, 1), Math.max(produto.estoque, 1)))
        setAviso(null)
    }

    // usa a API de quantidade do carrinho em vez de somar um a um
    const adicionar = () => {
        const noCarrinho = itens.find((item) => item.id === produto.id)
        const atual = noCarrinho?.quantidade ?? 0
        const total = Math.min(atual + quantidade, produto.estoque)

        if (total <= atual) {
            setAviso('limite')
            return
        }

        if (noCarrinho) {
            alterarQuantidade(produto.id, total)
        } else {
            adicionarAoCarrinho(produto)
            if (total > 1) alterarQuantidade(produto.id, total)
        }

        setAviso('adicionado')
    }

    return (
        <main className="produto">
            <nav className="produto-breadcrumb" aria-label="Você está em">
                <ol>
                    <li>
                        <Link to="/">Início</Link>
                    </li>
                    <li>
                        <Link to={linkCategoria}>{produto.categoria}</Link>
                    </li>
                    <li aria-current="page">{produto.name}</li>
                </ol>
            </nav>

            <div className="produto-layout">
                <div className="produto-galeria">
                    {produto.imagem_url && !imagemQuebrada ? (
                        <img
                            src={produto.imagem_url}
                            alt={produto.name}
                            className="produto-imagem"
                            onError={() => setImagemQuebrada(true)}
                        />
                    ) : (
                        <div
                            className="produto-placeholder"
                            role="img"
                            aria-label="Produto sem imagem"
                        >
                            <span>WP</span>
                        </div>
                    )}
                </div>

                <section className="produto-compra" aria-label="Comprar">
                    <p className="produto-categoria">{produto.categoria}</p>
                    <h1 className="produto-nome">{produto.name}</h1>
                    <p className="produto-preco">{formatarPreco(produto.preco)}</p>

                    <p
                        className={`produto-estoque${semEstoque ? ' produto-estoque-esgotado' : ''}`}
                    >
                        {rotulo}
                    </p>

                    {!semEstoque && (
                        <div className="produto-quantidade" role="group" aria-label="Quantidade">
                            <button
                                type="button"
                                aria-label="Diminuir quantidade"
                                onClick={() => mudarQuantidade(quantidade - 1)}
                                disabled={quantidade <= 1}
                            >
                                −
                            </button>
                            <output aria-label="Quantidade selecionada">
                                {quantidade}
                            </output>
                            <button
                                type="button"
                                aria-label="Aumentar quantidade"
                                onClick={() => mudarQuantidade(quantidade + 1)}
                                disabled={quantidade >= produto.estoque}
                            >
                                +
                            </button>
                        </div>
                    )}

                    <button
                        type="button"
                        className="produto-botao"
                        onClick={adicionar}
                        disabled={semEstoque}
                    >
                        {semEstoque ? 'Esgotado' : 'Adicionar à Sacola'}
                    </button>

                    {aviso && (
                        <p className="produto-aviso" role="status">
                            {aviso === 'limite'
                                ? 'Você já tem todas as unidades disponíveis na sacola.'
                                : 'Adicionado à sacola.'}{' '}
                            <Link to="/carrinho">Ver sacola</Link>
                        </p>
                    )}
                </section>
            </div>

            <section className="produto-secao" aria-labelledby="produto-descricao">
                <h2 id="produto-descricao" className="produto-subtitulo">
                    Descrição
                </h2>
                {produto.descricao ? (
                    <p className="produto-texto">{produto.descricao}</p>
                ) : (
                    <p className="produto-texto produto-texto-vazio">
                        Esta peça ainda não tem uma descrição.
                    </p>
                )}
            </section>

            <section className="produto-secao" aria-labelledby="produto-detalhes">
                <h2 id="produto-detalhes" className="produto-subtitulo">
                    Detalhes
                </h2>
                <dl className="produto-detalhes">
                    <div>
                        <dt>Categoria</dt>
                        <dd>{produto.categoria}</dd>
                    </div>
                    <div>
                        <dt>Disponibilidade</dt>
                        <dd>{rotulo}</dd>
                    </div>
                    <div>
                        <dt>Código</dt>
                        <dd>#{produto.id}</dd>
                    </div>
                </dl>
            </section>

            <Relacionados produto={produto} />
        </main>
    )
}

export const Produto = () => {
    const { id } = useParams()
    const { produto, carregando, erro } = usarProduto(id)

    if (carregando) {
        return (
            <main className="produto" aria-busy="true">
                <p className="produto-estado" role="status">
                    Carregando peça…
                </p>
                <div className="produto-layout" aria-hidden="true">
                    <div className="produto-galeria produto-esqueleto" />
                    <div className="produto-compra produto-esqueleto-bloco" />
                </div>
            </main>
        )
    }

    if (erro || !produto || !ID_VALIDO.test(id)) {
        // só a falha de conexão mantém a mensagem própria; o resto vira "não encontrado"
        const texto =
            ID_VALIDO.test(id) && erro === ERRO_CONEXAO ? erro : 'Produto não encontrado'

        return (
            <main className="produto">
                <div className="produto-erro">
                    <Mensagem texto={texto} />
                    <Link to="/#colecao" className="produto-voltar">
                        Voltar à coleção
                    </Link>
                </div>
            </main>
        )
    }

    // key reinicia quantidade e aviso ao navegar entre produtos
    return <Detalhe key={produto.id} produto={produto} />
}
