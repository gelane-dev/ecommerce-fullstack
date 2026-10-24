import "./App.css";
import { Home } from "./pages/Home";
import { Login } from "./pages/autenticacao/Login";
import { Header } from "./components/header/Header";

import {
    BrowserRouter,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

function Layout() {
    const location = useLocation();

    const estaNoLogin = location.pathname === "/login";

    return (
        <>
            {!estaNoLogin && <Header />}

            <Routes>
                <Route
                    path="/login"
                    element={<Login />}
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
            <Layout />
        </BrowserRouter>
    );
}

export default App;
