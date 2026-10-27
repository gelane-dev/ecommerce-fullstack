import "./App.css";
import { Home } from "./pages/Home";
import { Login } from "./pages/autenticacao/Login";
import { Cadastro } from "./pages/autenticacao/Cadastro";
import { Carrinho } from "./pages/carrinho/Carrinho";
import { MeusPedidos } from "./pages/pedidos/MeusPedidos";
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

function Layout() {
    const location = useLocation();

    const estaNoLogin =
        location.pathname === "/login" ||
        location.pathname === "/cadastro";

    return (
        <>
            {!estaNoLogin && <Header />}

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
