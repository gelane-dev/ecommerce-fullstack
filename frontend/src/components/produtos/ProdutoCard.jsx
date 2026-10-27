import { BotaoFavorito } from '../botoes/BotaoFavorito'
import { usarCarrinho } from '../../hooks/usarCarrinho'
import { formatarPreco } from '../../utils/formatarPreco'
import './ProdutoCard.css'

export function ProdutoCard({ produto }) {
    const { adicionarAoCarrinho } = usarCarrinho()

    if (!produto) return null

    return (
        <div className="card-produto">
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
            <div className="card-conteudo">
                <h2 className="card-titulo">{produto.name}</h2>
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
