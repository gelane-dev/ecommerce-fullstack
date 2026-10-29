import { createContext } from "react";

// ficam fora dos arquivos dos provedores para o Fast Refresh do Vite
// conseguir atualizar os componentes sem recarregar a página
export const ContextoAutenticacao = createContext(null);
export const ContextoCarrinho = createContext(null);
