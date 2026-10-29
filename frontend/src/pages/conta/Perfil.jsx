import { Link } from 'react-router-dom'
import { usePerfil } from '../../hooks/usePerfil'
import { Mensagem } from '../../components/comuns/Mensagem'
import './Perfil.css'

export const Perfil = () => {
    const { perfil, carregando, erro, carregar } = usePerfil()

    return (
        <main className="perfil">
            <h1 className="perfil-titulo">Minha conta</h1>

            {carregando ? (
                <p className="perfil-estado" role="status">
                    Carregando perfil…
                </p>
            ) : erro ? (
                <div className="perfil-erro">
                    <Mensagem texto={erro} />

                    <button
                        type="button"
                        className="perfil-botao"
                        onClick={carregar}
                    >
                        Tentar novamente
                    </button>
                </div>
            ) : (
                <>
                    <dl className="perfil-dados">
                        <div>
                            <dt>Nome</dt>
                            <dd>{perfil.nome}</dd>
                        </div>
                        <div>
                            <dt>E-mail</dt>
                            <dd>{perfil.email}</dd>
                        </div>
                        <div>
                            <dt>Cliente desde</dt>
                            <dd>
                                {new Date(perfil.data_criacao).toLocaleDateString('pt-BR')}
                            </dd>
                        </div>
                    </dl>

                    <nav className="perfil-acoes">
                        <Link to="/pedidos" className="perfil-botao">
                            Meus pedidos
                        </Link>
                        <Link to="/configuracoes" className="perfil-botao perfil-botao-claro">
                            Configurações
                        </Link>
                    </nav>
                </>
            )}
        </main>
    )
}
