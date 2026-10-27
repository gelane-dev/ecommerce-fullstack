import { useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { usarProdutos, usarCategorias } from '../hooks/usarProdutos'
import { ProdutoCard } from '../components/produtos/ProdutoCard'
import { FiltroCategorias } from '../components/produtos/FiltroCategorias'
import { Mensagem } from '../components/comuns/Mensagem'
import './Home.css'

const ORDENACOES_VALIDAS = ['preco_asc', 'preco_desc', 'recentes']

export const Home = () => {
    const [parametros, setParametros] = useSearchParams()
    const busca = parametros.get('busca') ?? ''
    const categoriaUrl = parametros.get('categoria') ?? ''
    const ordenarUrl = parametros.get('ordenar') ?? ''

    const { categorias } = usarCategorias()

    // valor desconhecido conta como ausente; sem lista de categorias não há como validar
    const categoria =
        categorias.length === 0 || categorias.includes(categoriaUrl)
            ? categoriaUrl
            : ''
    const ordenar = ORDENACOES_VALIDAS.includes(ordenarUrl) ? ordenarUrl : ''

    const { produtos, carregando, erro, carregar } = usarProdutos({
        busca,
        categoria,
        ordenar,
    })
    const { hash } = useLocation()
    const temFiltro = Boolean(busca || categoria)

    const mudarFiltro = (nome, valor) => {
        const proximos = new URLSearchParams(parametros)

        if (valor) proximos.set(nome, valor)
        else proximos.delete(nome)

        setParametros(proximos)
    }

    const limparFiltros = () => {
        const proximos = new URLSearchParams(parametros)

        proximos.delete('busca')
        proximos.delete('categoria')

        setParametros(proximos)
    }

    // a URL passa a refletir só o que está de fato aplicado
    useEffect(() => {
        if (categoria === categoriaUrl && ordenar === ordenarUrl) return

        const proximos = new URLSearchParams(parametros)

        if (categoria !== categoriaUrl) proximos.delete('categoria')
        if (ordenar !== ordenarUrl) proximos.delete('ordenar')

        setParametros(proximos, { replace: true })
    }, [categoria, categoriaUrl, ordenar, ordenarUrl, parametros, setParametros])

    // o BrowserRouter não rola até a âncora sozinho
    useEffect(() => {
        if (hash) {
            document.getElementById(hash.slice(1))?.scrollIntoView()
        }
    }, [hash])

    return (
        <main className="home">
            <section id="colecao" className="home-colecao">
                <h1 className="home-titulo">Coleção</h1>

                <FiltroCategorias
                    categorias={categorias}
                    categoria={categoria}
                    ordenar={ordenar}
                    aoMudar={mudarFiltro}
                />

                {carregando ? (
                    <p className="home-estado" role="status">
                        Carregando coleção…
                    </p>
                ) : erro ? (
                    <div className="home-erro">
                        <Mensagem texto={erro} />

                        <button
                            type="button"
                            className="home-tentar-novamente"
                            onClick={carregar}
                        >
                            Tentar novamente
                        </button>
                    </div>
                ) : produtos.length === 0 ? (
                    <div className="home-vazio">
                        <p className="home-estado">
                            {temFiltro
                                ? 'Nenhuma peça encontrada para esta busca.'
                                : 'Nenhuma peça disponível por enquanto.'}
                        </p>

                        {temFiltro && (
                            <button
                                type="button"
                                className="home-tentar-novamente"
                                onClick={limparFiltros}
                            >
                                Limpar filtros
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="card-container">
                        {produtos.map((produto) => (
                            <ProdutoCard key={produto.id} produto={produto} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}
