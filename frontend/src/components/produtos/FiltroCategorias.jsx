import './FiltroCategorias.css'

const ORDENACOES = [
    { valor: 'recentes', rotulo: 'Mais recentes' },
    { valor: 'preco_asc', rotulo: 'Menor preço' },
    { valor: 'preco_desc', rotulo: 'Maior preço' },
]

export function FiltroCategorias({ categorias, categoria, ordenar, aoMudar }) {
    return (
        <div className="filtro">
            {categorias.length > 0 && (
                <label className="filtro-campo">
                    <span>Categoria</span>
                    <select
                        value={categoria}
                        onChange={(e) => aoMudar('categoria', e.target.value)}
                    >
                        <option value="">Todas</option>
                        {categorias.map((nome) => (
                            <option key={nome} value={nome}>
                                {nome}
                            </option>
                        ))}
                    </select>
                </label>
            )}

            <label className="filtro-campo">
                <span>Ordenar</span>
                <select
                    value={ordenar}
                    onChange={(e) => aoMudar('ordenar', e.target.value)}
                >
                    <option value="">Padrão</option>
                    {ORDENACOES.map(({ valor, rotulo }) => (
                        <option key={valor} value={valor}>
                            {rotulo}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    )
}
