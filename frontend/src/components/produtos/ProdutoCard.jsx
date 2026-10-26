import { BotaoFavorito } from '../botoes/BotaoFavorito'
import { usarCarrinho } from '../../hooks/usarCarrinho'
import './ProdutoCard.css'

export function ProdutoCard({ produto }) {
    const { adicionarAoCarrinho } = usarCarrinho()

    if (!produto) return null

    return (
        <div className="card-produto">
            <img 
                src={produto.imagem_url} 
                alt={produto.name} 
                className="card-imagem"
            />
            <div className="card-conteudo">
                <h2 className="card-titulo">{produto.name}</h2>
                <p className="card-preco">R$ {produto.preco}</p>
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


