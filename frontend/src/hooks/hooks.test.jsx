import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useProduto, useProdutos } from './useProdutos'
import { usePerfil } from './usePerfil'
import { usePedidosAdmin } from './usePedidosAdmin'
import { produtosService } from '../services/produtosService'
import { usuariosService } from '../services/usuariosService'
import { pedidosService } from '../services/pedidosService'

vi.mock('../services/produtosService', () => ({
    produtosService: {
        listar: vi.fn(),
        buscar: vi.fn(),
        excluir: vi.fn(),
    },
}))
vi.mock('../services/usuariosService', () => ({
    usuariosService: { obterPerfil: vi.fn() },
}))
vi.mock('../services/pedidosService', () => ({
    pedidosService: { listarTodos: vi.fn(), mudarStatus: vi.fn() },
}))

beforeEach(() => {
    vi.resetAllMocks()
})

describe('useProduto', () => {
    it('começa carregando e depois devolve o produto', async () => {
        produtosService.buscar.mockResolvedValue({ id: 1, name: 'Panela' })

        const { result } = renderHook(() => useProduto(1))

        expect(result.current.carregando).toBe(true)
        await waitFor(() => expect(result.current.carregando).toBe(false))
        expect(result.current.produto).toEqual({ id: 1, name: 'Panela' })
        expect(result.current.erro).toBe('')
    })

    it('devolve a mensagem de erro quando a busca falha', async () => {
        produtosService.buscar.mockRejectedValue(new Error('Produto não encontrado'))

        const { result } = renderHook(() => useProduto(99))

        await waitFor(() => expect(result.current.carregando).toBe(false))
        expect(result.current.produto).toBeNull()
        expect(result.current.erro).toBe('Produto não encontrado')
    })

    it('volta a carregar e esconde o produto anterior quando o id muda', async () => {
        produtosService.buscar.mockImplementation((id) => Promise.resolve({ id }))

        const { result, rerender } = renderHook(({ id }) => useProduto(id), {
            initialProps: { id: 1 },
        })
        await waitFor(() => expect(result.current.produto).toEqual({ id: 1 }))

        rerender({ id: 2 })

        expect(result.current.carregando).toBe(true)
        expect(result.current.produto).toBeNull()
        await waitFor(() => expect(result.current.produto).toEqual({ id: 2 }))
    })
})

describe('useProdutos', () => {
    it('lista os produtos com os filtros recebidos', async () => {
        produtosService.listar.mockResolvedValue([{ id: 1 }])

        const { result } = renderHook(() => useProdutos({ categoria: 'cozinha' }))

        await waitFor(() => expect(result.current.carregando).toBe(false))
        expect(result.current.produtos).toEqual([{ id: 1 }])
        expect(produtosService.listar).toHaveBeenCalledWith({
            busca: undefined,
            categoria: 'cozinha',
            ordenar: undefined,
        })
    })

    it('busca a lista de novo depois de uma ação bem-sucedida', async () => {
        produtosService.listar.mockResolvedValue([])
        produtosService.excluir.mockResolvedValue({})

        const { result } = renderHook(() => useProdutos())
        await waitFor(() => expect(result.current.carregando).toBe(false))

        let deuCerto
        await act(async () => {
            deuCerto = await result.current.excluir(1)
        })

        expect(deuCerto).toBe(true)
        await waitFor(() => expect(produtosService.listar).toHaveBeenCalledTimes(2))
    })

    it('mostra o erro da ação e o limpa ao recarregar', async () => {
        produtosService.listar.mockResolvedValue([])
        produtosService.excluir.mockRejectedValue(
            new Error('Produto possui pedidos e não pode ser excluído')
        )

        const { result } = renderHook(() => useProdutos())
        await waitFor(() => expect(result.current.carregando).toBe(false))

        let deuCerto
        await act(async () => {
            deuCerto = await result.current.excluir(1)
        })

        expect(deuCerto).toBe(false)
        expect(result.current.erro).toBe('Produto possui pedidos e não pode ser excluído')

        act(() => result.current.carregar())

        expect(result.current.erro).toBe('')
        await waitFor(() => expect(produtosService.listar).toHaveBeenCalledTimes(2))
    })

    it('mostra o erro quando a listagem falha', async () => {
        produtosService.listar.mockRejectedValue(new Error('Erro ao consultar o banco de dados'))

        const { result } = renderHook(() => useProdutos())

        await waitFor(() => expect(result.current.carregando).toBe(false))
        expect(result.current.produtos).toEqual([])
        expect(result.current.erro).toBe('Erro ao consultar o banco de dados')
    })
})

describe('usePerfil', () => {
    it('carrega o perfil e busca de novo ao chamar carregar', async () => {
        usuariosService.obterPerfil
            .mockRejectedValueOnce(new Error('Não foi possível conectar ao servidor.'))
            .mockResolvedValueOnce({ nome: 'Leo' })

        const { result } = renderHook(() => usePerfil())
        await waitFor(() => expect(result.current.carregando).toBe(false))
        expect(result.current.erro).toBe('Não foi possível conectar ao servidor.')

        act(() => result.current.carregar())

        expect(result.current.carregando).toBe(true)
        expect(result.current.erro).toBe('')
        await waitFor(() => expect(result.current.perfil).toEqual({ nome: 'Leo' }))
        expect(result.current.carregando).toBe(false)
    })
})

describe('usePedidosAdmin', () => {
    it('lista os pedidos e busca de novo depois de mudar o status', async () => {
        pedidosService.listarTodos.mockResolvedValue([{ id: 7 }])
        pedidosService.mudarStatus.mockResolvedValue({})

        const { result } = renderHook(() => usePedidosAdmin())
        await waitFor(() => expect(result.current.pedidos).toEqual([{ id: 7 }]))

        let mudou
        await act(async () => {
            mudou = await result.current.mudarStatus(7, 'pago')
        })

        expect(mudou).toBe(true)
        expect(pedidosService.mudarStatus).toHaveBeenCalledWith(7, 'pago')
        await waitFor(() => expect(pedidosService.listarTodos).toHaveBeenCalledTimes(2))
    })

    it('mostra o erro quando a mudança de status é recusada', async () => {
        pedidosService.listarTodos.mockResolvedValue([])
        pedidosService.mudarStatus.mockRejectedValue(new Error('transição inválida'))

        const { result } = renderHook(() => usePedidosAdmin())

        let mudou
        await act(async () => {
            mudou = await result.current.mudarStatus(1, 'enviado')
        })

        expect(mudou).toBe(false)
        expect(result.current.erro).toBe('transição inválida')
    })
})
