import { Home } from "./pages/Home";
import { Login } from "./pages/autenticacao/Login";
import { Cadastro } from "./pages/autenticacao/Cadastro";
import { Produto } from "./pages/produto/Produto";
import { Carrinho } from "./pages/carrinho/Carrinho";
import { MeusPedidos } from "./pages/pedidos/MeusPedidos";
import { Perfil } from "./pages/conta/Perfil";
import { Configuracoes } from "./pages/conta/Configuracoes";
import { Admin } from "./pages/admin/Admin";
import { RotaProtegida } from "./components/rotas/RotaProtegida";
import { ProvedorCarrinho } from "./context/CartContext";
import { Header } from "./components/header/Header";
import { ProvedorAutenticacao } from "./context/AuthContext";

import {
    BrowserRouter,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

const ROTAS_SEM_HEADER = ["/login", "/cadastro"];

function Layout() {
    const location = useLocation();

    const semHeader = ROTAS_SEM_HEADER.includes(location.pathname);

    return (
        <>
            {!semHeader && <Header />}

            <Routes>
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/cadastro"
                    element={<Cadastro />}
                />

                <Route
                    path="/produto/:id"
                    element={<Produto />}
                />

                <Route
                    path="/carrinho"
                    element={<Carrinho />}
                />

                <Route
                    path="/pedidos"
                    element={
                        <RotaProtegida>
                            <MeusPedidos />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/perfil"
                    element={
                        <RotaProtegida>
                            <Perfil />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/configuracoes"
                    element={
                        <RotaProtegida>
                            <Configuracoes />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <RotaProtegida somenteAdmin>
                            <Admin />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/"
                    element={<Home />}
                />
            </Routes>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <ProvedorAutenticacao>
                <ProvedorCarrinho>
                    <Layout />
                </ProvedorCarrinho>
            </ProvedorAutenticacao>
        </BrowserRouter>
    );
}

export default App;
