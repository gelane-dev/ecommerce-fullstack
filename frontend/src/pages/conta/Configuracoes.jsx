import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePerfil } from '../../hooks/usePerfil'
import { useFormulario } from '../../hooks/useFormulario'
import { useEnvio } from '../../hooks/useEnvio'
import { useAutenticacao } from '../../hooks/useAutenticacao'
import { usuariosService } from '../../services/usuariosService'
import { Mensagem } from '../../components/comuns/Mensagem'
import { iniciaisDe } from '../../utils/iniciaisDe'
import './Configuracoes.css'

const FormularioDados = ({ perfil }) => {
    const { atualizarUsuario } = useAutenticacao()
    const { valores, alterar } = useFormulario({
        nome: perfil.nome,
        email: perfil.email,
    })
    const { enviar, carregando, mensagem } = useEnvio(
        usuariosService.atualizarPerfil
    )
    const [sucesso, setSucesso] = useState('')

    const aoEnviar = async (evento) => {
        evento.preventDefault()
        setSucesso('')

        const dados = { nome: valores.nome.trim(), email: valores.email.trim() }
        const { ok, resultado } = await enviar(dados)

        if (ok) {
            atualizarUsuario({
                nome: resultado?.nome ?? dados.nome,
                email: resultado?.email ?? dados.email,
            })
            setSucesso('Dados atualizados.')
        }
    }

    return (
        <form className="config-formulario" onSubmit={aoEnviar}>
            <h2>Dados da conta</h2>

            <div className="config-campo">
                <label htmlFor="config-nome">Nome</label>
                <input
                    id="config-nome"
                    name="nome"
                    type="text"
                    minLength={3}
                    maxLength={100}
                    value={valores.nome}
                    onChange={alterar}
                    required
                />
            </div>

            <div className="config-campo">
                <label htmlFor="config-email">E-mail</label>
                <input
                    id="config-email"
                    name="email"
                    type="email"
                    value={valores.email}
                    onChange={alterar}
                    required
                />
            </div>

            <button className="config-botao" type="submit" disabled={carregando}>
                {carregando ? 'Salvando…' : 'Salvar dados'}
            </button>

            <Mensagem texto={mensagem} />
            {sucesso && (
                <p className="config-sucesso" role="status">
                    {sucesso}
                </p>
            )}
        </form>
    )
}

const FormularioFoto = ({ perfil }) => {
    const { atualizarUsuario } = useAutenticacao()
    const { enviar, carregando, mensagem } = useEnvio(
        usuariosService.enviarFoto
    )
    const [foto, setFoto] = useState(perfil.foto)
    const [sucesso, setSucesso] = useState('')

    const aoEscolher = async (evento) => {
        const arquivo = evento.target.files[0]
        // limpa o input para o mesmo arquivo poder ser escolhido de novo
        evento.target.value = ''

        if (!arquivo) return

        setSucesso('')

        const { ok, resultado } = await enviar(arquivo)

        if (ok) {
            setFoto(resultado.foto)
            atualizarUsuario({ foto: resultado.foto })
            setSucesso('Foto atualizada.')
        }
    }

    return (
        <section className="config-formulario">
            <h2>Foto de perfil</h2>

            <div className="config-foto">
                <span className="config-foto-avatar" aria-hidden="true">
                    {foto ? (
                        <img src={foto} alt="" />
                    ) : (
                        iniciaisDe(perfil.nome)
                    )}
                </span>

                <label className="config-botao config-foto-botao">
                    {carregando ? 'Enviando…' : foto ? 'Trocar foto' : 'Enviar foto'}
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={aoEscolher}
                        disabled={carregando}
                    />
                </label>
            </div>

            <Mensagem texto={mensagem} />
            {sucesso && (
                <p className="config-sucesso" role="status">
                    {sucesso}
                </p>
            )}
        </section>
    )
}

const FormularioSenha = () => {
    const { valores, alterar, limpar } = useFormulario({
        senha_atual: '',
        senha_nova: '',
    })
    const { enviar, carregando, mensagem } = useEnvio(
        usuariosService.alterarSenha
    )
    const [sucesso, setSucesso] = useState('')

    const aoEnviar = async (evento) => {
        evento.preventDefault()
        setSucesso('')

        const { ok } = await enviar(valores)

        if (ok) {
            limpar()
            setSucesso('Senha alterada.')
        }
    }

    return (
        <form className="config-formulario" onSubmit={aoEnviar}>
            <h2>Trocar senha</h2>

            <div className="config-campo">
                <label htmlFor="config-senha-atual">Senha atual</label>
                <input
                    id="config-senha-atual"
                    name="senha_atual"
                    type="password"
                    autoComplete="current-password"
                    value={valores.senha_atual}
                    onChange={alterar}
                    required
                />
            </div>

            <div className="config-campo">
                <label htmlFor="config-senha-nova">Nova senha</label>
                <input
                    id="config-senha-nova"
                    name="senha_nova"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    value={valores.senha_nova}
                    onChange={alterar}
                    required
                />
            </div>

            <button className="config-botao" type="submit" disabled={carregando}>
                {carregando ? 'Salvando…' : 'Alterar senha'}
            </button>

            <Mensagem texto={mensagem} />
            {sucesso && (
                <p className="config-sucesso" role="status">
                    {sucesso}
                </p>
            )}
        </form>
    )
}

export const Configuracoes = () => {
    const { perfil, carregando, erro, carregar } = usePerfil()

    return (
        <main className="config">
            <h1 className="config-titulo">Configurações</h1>

            <Link to="/perfil" className="config-voltar">
                ← Minha conta
            </Link>

            {carregando ? (
                <p className="config-estado" role="status">
                    Carregando…
                </p>
            ) : erro ? (
                <div className="config-erro">
                    <Mensagem texto={erro} />

                    <button type="button" className="config-botao" onClick={carregar}>
                        Tentar novamente
                    </button>
                </div>
            ) : (
                <>
                    <FormularioFoto perfil={perfil} />
                    <FormularioDados perfil={perfil} />
                    <FormularioSenha />
                </>
            )}
        </main>
    )
}
