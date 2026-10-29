import { Link } from 'react-router-dom'
import { BotaoFavorito } from '../botoes/BotaoFavorito'
import { useCarrinho } from '../../hooks/useCarrinho'
import { formatarPreco } from '../../utils/formatarPreco'
import './ProdutoCard.css'

export function ProdutoCard({ produto }) {
    const { adicionarAoCarrinho } = useCarrinho()

    if (!produto) return null

    return (
        <div className="card-produto">
            <Link
                to={`/produto/${produto.id}`}
                className="card-link"
                aria-label={`Ver detalhes de ${produto.name}`}
            >
                <div className="card-moldura">
                    {produto.imagem_url ? (
                        <img
                            src={produto.imagem_url}
                            alt={produto.name}
                            className="card-imagem"
                            loading="lazy"
                        />
                    ) : (
                        <div className="card-placeholder" role="img" aria-label="Sem imagem">
                            <span>WP</span>
                        </div>
                    )}
                </div>
            </Link>
            <div className="card-conteudo">
                <Link to={`/produto/${produto.id}`} className="card-link">
                    <h2 className="card-titulo">{produto.name}</h2>
                </Link>
                <p className="card-preco">{formatarPreco(produto.preco)}</p>
                <button
                    type="button"
                    className="card-botao-sacola"
                    onClick={() => adicionarAoCarrinho(produto)}
                >
                    Adicionar à Sacola
                </button>
            </div>
            <div className="card-favorito-posicionador">
                <BotaoFavorito />
            </div>
        </div>
    )
}
