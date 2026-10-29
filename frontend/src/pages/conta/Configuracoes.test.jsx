import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Configuracoes } from './Configuracoes'
import { usePerfil } from '../../hooks/usePerfil'
import { useAutenticacao } from '../../hooks/useAutenticacao'
import { usuariosService } from '../../services/usuariosService'

vi.mock('../../hooks/usePerfil', () => ({ usePerfil: vi.fn() }))
vi.mock('../../hooks/useAutenticacao', () => ({ useAutenticacao: vi.fn() }))
vi.mock('../../services/usuariosService', () => ({
    usuariosService: {
        atualizarPerfil: vi.fn(),
        alterarSenha: vi.fn(),
        enviarFoto: vi.fn(),
    },
}))

const atualizarUsuario = vi.fn()

function renderizar(perfil) {
    usePerfil.mockReturnValue({ perfil, carregando: false, erro: '', carregar: vi.fn() })
    useAutenticacao.mockReturnValue({ atualizarUsuario })

    return render(
        <MemoryRouter>
            <Configuracoes />
        </MemoryRouter>
    )
}

const arquivo = () => new File(['conteudo'], 'leo.png', { type: 'image/png' })

beforeEach(() => {
    vi.resetAllMocks()
})

describe('Configuracoes — foto de perfil', () => {
    it('mostra as iniciais quando o usuário não tem foto', () => {
        renderizar({ nome: 'Leonardo Santos', email: 'leo@gmail.com', foto: null })

        expect(screen.getByText('LS')).toBeInTheDocument()
        expect(screen.getByText('Enviar foto')).toBeInTheDocument()
    })

    it('envia a foto escolhida e atualiza a sessão', async () => {
        usuariosService.enviarFoto.mockResolvedValue({ foto: 'https://exemplo.com/leo.png' })
        const { container } = renderizar({ nome: 'Leo', email: 'leo@gmail.com', foto: null })

        await userEvent.upload(screen.getByLabelText('Enviar foto'), arquivo())

        expect(usuariosService.enviarFoto).toHaveBeenCalledTimes(1)
        expect(atualizarUsuario).toHaveBeenCalledWith({ foto: 'https://exemplo.com/leo.png' })
        expect(await screen.findByText('Foto atualizada.')).toBeInTheDocument()
        expect(container.querySelector('.config-foto-avatar img')).toHaveAttribute(
            'src',
            'https://exemplo.com/leo.png'
        )
    })

    it('mostra o erro da API e mantém a sessão quando o envio falha', async () => {
        usuariosService.enviarFoto.mockRejectedValue(new Error('Formato de imagem não permitido'))
        renderizar({ nome: 'Leo', email: 'leo@gmail.com', foto: null })

        await userEvent.upload(screen.getByLabelText('Enviar foto'), arquivo())

        expect(await screen.findByText('Formato de imagem não permitido')).toBeInTheDocument()
        expect(atualizarUsuario).not.toHaveBeenCalled()
    })
})
