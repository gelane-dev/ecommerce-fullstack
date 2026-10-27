import { usarProdutos } from '../hooks/usarProdutos'
import { ProdutoCard } from '../components/produtos/ProdutoCard'

export const Home = () => {
    const { produtos } = usarProdutos()

    return (
        <main className="card-container">
            {produtos.map((produto) => (
                <ProdutoCard key={produto.id} produto={produto} />
            ))}
        </main>
    )
}
