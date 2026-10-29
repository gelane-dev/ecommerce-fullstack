import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Produto } from './Produto'
import { useProduto, useProdutos } from '../../hooks/useProdutos'
import { useCarrinho } from '../../hooks/useCarrinho'

vi.mock('../../hooks/useProdutos', () => ({
    useProduto: vi.fn(),
    useProdutos: vi.fn(),
}))
vi.mock('../../hooks/useCarrinho', () => ({
    useCarrinho: vi.fn(),
}))
vi.mock('../../components/botoes/BotaoFavorito', () => ({
    BotaoFavorito: () => null,
}))

const produtoBase = {
    id: 1,
    name: 'Camiseta Pony',
    categoria: 'Roupas',
    preco: 79.9,
    estoque: 10,
    imagem_url: 'https://exemplo.com/camiseta.png',
    descricao: 'Algodão 100%.',
}

let carrinho

const prepararHooks = ({
    produto = produtoBase,
    carregando = false,
    erro = '',
    relacionados = [],
    itens = [],
} = {}) => {
    carrinho = {
        itens,
        adicionarAoCarrinho: vi.fn(),
        alterarQuantidade: vi.fn(),
    }
    useProduto.mockReturnValue({ produto, carregando, erro })
    useProdutos.mockReturnValue({ produtos: relacionados })
    useCarrinho.mockReturnValue(carrinho)
}

const renderizar = (caminho = '/produto/1') =>
    render(
        <MemoryRouter initialEntries={[caminho]}>
            <Routes>
                <Route path="/produto/:id" element={<Produto />} />
            </Routes>
        </MemoryRouter>
    )

beforeEach(() => {
    vi.clearAllMocks()
})

describe('Produto - conteúdo', () => {
    it('renderiza nome, preço, imagem com alt e descrição', () => {
        prepararHooks()
        renderizar()

        expect(screen.getByRole('heading', { level: 1, name: 'Camiseta Pony' })).toBeInTheDocument()
        expect(screen.getByText(/79,90/)).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'Camiseta Pony' })).toHaveAttribute(
            'src',
            'https://exemplo.com/camiseta.png'
        )
        expect(screen.getByText('Algodão 100%.')).toBeInTheDocument()
    })

    it('busca o produto pelo id da rota', () => {
        prepararHooks()
        renderizar()

        expect(useProduto).toHaveBeenCalledWith('1')
    })

    it('mostra placeholder quando não há imagem', () => {
        prepararHooks({ produto: { ...produtoBase, imagem_url: null } })
        renderizar()

        expect(screen.getByRole('img', { name: 'Produto sem imagem' })).toBeInTheDocument()
        expect(screen.queryByRole('img', { name: 'Camiseta Pony' })).not.toBeInTheDocument()
    })

    it.each([null, ''])('mostra mensagem quando a descrição é %j', (descricao) => {
        prepararHooks({ produto: { ...produtoBase, descricao } })
        renderizar()

        expect(screen.getByText('Esta peça ainda não tem uma descrição.')).toBeInTheDocument()
    })

    it('breadcrumb tem links para início e categoria', () => {
        prepararHooks()
        renderizar()

        const nav = screen.getByRole('navigation', { name: 'Você está em' })
        expect(within(nav).getByRole('link', { name: 'Início' })).toHaveAttribute('href', '/')
        expect(within(nav).getByRole('link', { name: 'Roupas' })).toHaveAttribute(
            'href',
            '/?categoria=Roupas#colecao'
        )
    })

    it('codifica a categoria no link do breadcrumb', () => {
        prepararHooks({ produto: { ...produtoBase, categoria: 'Casa & Jardim' } })
        renderizar()

        expect(screen.getByRole('link', { name: 'Casa & Jardim' })).toHaveAttribute(
            'href',
            '/?categoria=Casa%20%26%20Jardim#colecao'
        )
    })
})

describe('Produto - estoque e quantidade', () => {
    it('esgotado desabilita o botão e esconde o seletor de quantidade', () => {
        prepararHooks({ produto: { ...produtoBase, estoque: 0 } })
        renderizar()

        expect(screen.getByRole('button', { name: 'Esgotado' })).toBeDisabled()
        expect(screen.queryByRole('group', { name: 'Quantidade' })).not.toBeInTheDocument()
    })

    it('esgotado não chama o carrinho', async () => {
        prepararHooks({ produto: { ...produtoBase, estoque: 0 } })
        renderizar()

        await userEvent.click(screen.getByRole('button', { name: 'Esgotado' }))

        expect(carrinho.adicionarAoCarrinho).not.toHaveBeenCalled()
        expect(carrinho.alterarQuantidade).not.toHaveBeenCalled()
    })

    it('estoque negativo é tratado como esgotado', () => {
        prepararHooks({ produto: { ...produtoBase, estoque: -3 } })
        renderizar()

        expect(screen.getByRole('button', { name: 'Esgotado' })).toBeDisabled()
    })

    it('mostra "Últimas N unidades" com estoque baixo e singular com 1', () => {
        prepararHooks({ produto: { ...produtoBase, estoque: 3 } })
        const { unmount } = renderizar()
        expect(screen.getAllByText('Últimas 3 unidades').length).toBeGreaterThan(0)
        unmount()

        prepararHooks({ produto: { ...produtoBase, estoque: 1 } })
        renderizar()
        expect(screen.getAllByText('Últimas 1 unidade').length).toBeGreaterThan(0)
    })

    it('+/- respeitam os limites de 1 e do estoque', async () => {
        prepararHooks({ produto: { ...produtoBase, estoque: 3 } })
        renderizar()

        const menos = screen.getByRole('button', { name: 'Diminuir quantidade' })
        const mais = screen.getByRole('button', { name: 'Aumentar quantidade' })
        const quantidade = screen.getByLabelText('Quantidade selecionada')

        expect(quantidade).toHaveTextContent('1')
        expect(menos).toBeDisabled()

        await userEvent.click(mais)
        await userEvent.click(mais)
        expect(quantidade).toHaveTextContent('3')
        expect(mais).toBeDisabled()

        await userEvent.click(menos)
        expect(quantidade).toHaveTextContent('2')
        expect(mais).toBeEnabled()
    })

    it('com estoque 1 ambos os botões ficam desabilitados', () => {
        prepararHooks({ produto: { ...produtoBase, estoque: 1 } })
        renderizar()

        expect(screen.getByRole('button', { name: 'Diminuir quantidade' })).toBeDisabled()
        expect(screen.getByRole('button', { name: 'Aumentar quantidade' })).toBeDisabled()
    })
})

describe('Produto - adicionar à sacola', () => {
    it('adiciona 1 unidade sem ajustar a quantidade', async () => {
        prepararHooks()
        renderizar()

        await userEvent.click(screen.getByRole('button', { name: 'Adicionar à Sacola' }))

        expect(carrinho.adicionarAoCarrinho).toHaveBeenCalledTimes(1)
        expect(carrinho.adicionarAoCarrinho).toHaveBeenCalledWith(produtoBase)
        expect(carrinho.alterarQuantidade).not.toHaveBeenCalled()
    })

    it('adiciona a quantidade escolhida e mostra feedback com link /carrinho', async () => {
        prepararHooks()
        renderizar()

        const mais = screen.getByRole('button', { name: 'Aumentar quantidade' })
        await userEvent.click(mais)
        await userEvent.click(mais)
        await userEvent.click(screen.getByRole('button', { name: 'Adicionar à Sacola' }))

        expect(carrinho.adicionarAoCarrinho).toHaveBeenCalledWith(produtoBase)
        expect(carrinho.alterarQuantidade).toHaveBeenCalledWith(1, 3)

        const aviso = screen.getByText(/Adicionado à sacola/).closest('p')
        expect(aviso).toHaveAttribute('role', 'status')
        expect(within(aviso).getByRole('link', { name: 'Ver sacola' })).toHaveAttribute(
            'href',
            '/carrinho'
        )
    })

    it('não mostra feedback antes de adicionar', () => {
        prepararHooks()
        renderizar()

        expect(screen.queryByText(/Adicionado à sacola/)).not.toBeInTheDocument()
    })

    it('somando ao que já está no carrinho usa alterarQuantidade com o total', async () => {
        prepararHooks({ itens: [{ id: 1, quantidade: 2 }] })
        renderizar()

        await userEvent.click(screen.getByRole('button', { name: 'Aumentar quantidade' }))
        await userEvent.click(screen.getByRole('button', { name: 'Adicionar à Sacola' }))

        expect(carrinho.adicionarAoCarrinho).not.toHaveBeenCalled()
        expect(carrinho.alterarQuantidade).toHaveBeenCalledWith(1, 4)
    })

    it('o total no carrinho nunca passa do estoque', async () => {
        prepararHooks({
            produto: { ...produtoBase, estoque: 3 },
            itens: [{ id: 1, quantidade: 2 }],
        })
        renderizar()

        const mais = screen.getByRole('button', { name: 'Aumentar quantidade' })
        await userEvent.click(mais)
        await userEvent.click(mais)
        await userEvent.click(screen.getByRole('button', { name: 'Adicionar à Sacola' }))

        expect(carrinho.alterarQuantidade).toHaveBeenCalledWith(1, 3)
    })

    it('alterar a quantidade depois de adicionar esconde o feedback', async () => {
        prepararHooks()
        renderizar()

        await userEvent.click(screen.getByRole('button', { name: 'Adicionar à Sacola' }))
        expect(screen.getByText(/Adicionado à sacola/)).toBeInTheDocument()

        await userEvent.click(screen.getByRole('button', { name: 'Aumentar quantidade' }))
        expect(screen.queryByText(/Adicionado à sacola/)).not.toBeInTheDocument()
    })
})

describe('Produto - limite, imagem e acessibilidade', () => {
    it('com o estoque todo na sacola avisa o limite e não mostra "Adicionado"', async () => {
        prepararHooks({
            produto: { ...produtoBase, estoque: 3 },
            itens: [{ id: 1, quantidade: 3 }],
        })
        renderizar()

        await userEvent.click(screen.getByRole('button', { name: 'Adicionar à Sacola' }))

        expect(carrinho.alterarQuantidade).not.toHaveBeenCalled()
        expect(carrinho.adicionarAoCarrinho).not.toHaveBeenCalled()
        expect(screen.queryByText(/Adicionado à sacola/)).not.toBeInTheDocument()
        const aviso = screen.getByText(/Você já tem todas as unidades disponíveis na sacola/)
        expect(within(aviso.closest('p')).getByRole('link', { name: 'Ver sacola' })).toHaveAttribute(
            'href',
            '/carrinho'
        )
    })

    it('imagem quebrada troca para o placeholder', () => {
        prepararHooks()
        renderizar()

        fireEvent.error(screen.getByRole('img', { name: 'Camiseta Pony' }))

        expect(screen.queryByRole('img', { name: 'Camiseta Pony' })).not.toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'Produto sem imagem' })).toHaveTextContent('WP')
    })

    it('há uma única live region na área de compra', async () => {
        prepararHooks()
        renderizar()

        await userEvent.click(screen.getByRole('button', { name: 'Adicionar à Sacola' }))

        const compra = screen.getByRole('region', { name: 'Comprar' })
        expect(compra.tagName).toBe('SECTION')
        expect(compra.querySelectorAll('[role="status"], [aria-live], output[role]')).toHaveLength(1)
    })

    it('define o título da página com o nome do produto e restaura ao sair', () => {
        document.title = 'White Pony'
        prepararHooks()
        const { unmount } = renderizar()

        expect(document.title).toContain('Camiseta Pony')
        unmount()
        expect(document.title).toBe('White Pony')
    })
})

describe('Produto - estados de carregamento e erro', () => {
    it('id inválido mostra "Produto não encontrado" em português', () => {
        prepararHooks({ produto: null, erro: 'Input should be a valid integer' })
        renderizar('/produto/abc')

        expect(screen.getByRole('alert')).toHaveTextContent('Produto não encontrado')
        expect(screen.queryByText(/valid integer/)).not.toBeInTheDocument()
    })

    it('erro cru da API (422) nunca aparece na tela', () => {
        prepararHooks({ produto: null, erro: 'O campo "id" é inválido.' })
        renderizar()

        expect(screen.getByRole('alert')).toHaveTextContent('Produto não encontrado')
        expect(screen.queryByText(/inválido/)).not.toBeInTheDocument()
    })

    it('mostra o estado carregando', () => {
        prepararHooks({ produto: null, carregando: true })
        renderizar()

        expect(screen.getByRole('status')).toHaveTextContent('Carregando peça')
        expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    })

    it('mantém a mensagem de falha de conexão e o link de volta à coleção', () => {
        prepararHooks({ produto: null, erro: 'Não foi possível conectar ao servidor.' })
        renderizar()

        expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível conectar ao servidor.')
        expect(screen.getByRole('link', { name: 'Voltar à coleção' })).toHaveAttribute(
            'href',
            '/#colecao'
        )
    })

    it('sem produto e sem erro mostra mensagem padrão de não encontrado', () => {
        prepararHooks({ produto: null })
        renderizar()

        expect(screen.getByRole('alert')).toHaveTextContent('Produto não encontrado')
        expect(screen.getByRole('link', { name: 'Voltar à coleção' })).toBeInTheDocument()
    })
})

describe('Produto - relacionados', () => {
    const outro = (id) => ({
        id,
        name: `Outro ${id}`,
        categoria: 'Roupas',
        preco: 10,
        estoque: 5,
        imagem_url: null,
    })

    it('pede relacionados da mesma categoria', () => {
        prepararHooks()
        renderizar()

        expect(useProdutos).toHaveBeenCalledWith({ categoria: 'Roupas' })
    })

    it('não exibe o produto atual entre os relacionados', () => {
        prepararHooks({ relacionados: [produtoBase, outro(2), outro(3)] })
        renderizar()

        const secao = screen.getByRole('region', { name: 'Você também pode gostar' })
        expect(within(secao).queryByText('Camiseta Pony')).not.toBeInTheDocument()
        expect(within(secao).getByText('Outro 2')).toBeInTheDocument()
        expect(within(secao).getByText('Outro 3')).toBeInTheDocument()
    })

    it('limita a 4 relacionados', () => {
        prepararHooks({ relacionados: [2, 3, 4, 5, 6, 7].map(outro) })
        renderizar()

        const secao = screen.getByRole('region', { name: 'Você também pode gostar' })
        expect(within(secao).getAllByRole('link', { name: /^Ver detalhes de/ })).toHaveLength(4)
    })

    it('some quando a lista é vazia', () => {
        prepararHooks({ relacionados: [] })
        renderizar()

        expect(screen.queryByText('Você também pode gostar')).not.toBeInTheDocument()
    })

    it('some quando só existe o próprio produto na categoria', () => {
        prepararHooks({ relacionados: [produtoBase] })
        renderizar()

        expect(screen.queryByText('Você também pode gostar')).not.toBeInTheDocument()
    })
})
