import "./App.css";
import { Home } from "./pages/Home";
import { Login } from "./pages/autenticacao/Login";
import { Cadastro } from "./pages/autenticacao/Cadastro";
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
                <Layout />
            </ProvedorAutenticacao>
        </BrowserRouter>
    );
}

export default App;
