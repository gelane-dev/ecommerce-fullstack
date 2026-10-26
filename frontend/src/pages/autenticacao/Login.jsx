import { useState } from "react";
import "./Login.css";
import imagemLogin from "../../assets/login-arte.png";
import { Link, useNavigate } from "react-router-dom";
import { usarAutenticacao } from "../../hooks/usarAutenticacao";

export const Login = () => {
    const navigate = useNavigate();
    const { entrar } = usarAutenticacao();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);

    const alterarEmail = (event) => {
        setEmail(event.target.value);
    };

    const alterarSenha = (event) => {
        setSenha(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setCarregando(true);
        setMensagem("");

        try {
            const resposta = await fetch(
                "http://localhost:8001/login/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        senha,
                    }),
                }
            );

            const dados = await resposta.json();

            if (resposta.ok) {
                entrar(
                    dados.access_token,
                    dados.usuario || { nome: email, email }
                );

                navigate("/");
            } else {
                setMensagem(
                    dados.detail ||
                    "Erro ao realizar login."
                );
            }
        } catch (erro) {
            setMensagem(
                "Não foi possível conectar ao servidor."
            );
        } finally {
            setCarregando(false);
        }
    };

    return (
        <main className="login">

            <header className="login-header">

                <div className="login-marca">

                    <img
                        src={imagemLogin}
                        alt=""
                        className="login-logo-cavalo"
                    />

                    <span>WHITE PONY</span>

                </div>

                <div className="login-categorias">

                    ELETRÔNICOS

                    <span>/</span>

                    SMARTPHONES

                    <span>/</span>

                    ACESSÓRIOS

                    <span>/</span>

                    E MUITO MAIS

                </div>

            </header>

            <section className="login-conteudo">

                <div className="login-esquerda">

                    <form
                        className="login-formulario"
                        onSubmit={handleSubmit}
                    >

                        <span className="login-pre-titulo">
                            BEM-VINDO(A)
                        </span>

                        <h1>
                            ENTRAR
                        </h1>

                        <p className="login-subtitulo">
                            Acesse sua conta para continuar
                            <br />
                            comprando na White Pony.
                        </p>

                        <div className="login-campo">

                            <label htmlFor="email">
                                EMAIL
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={alterarEmail}
                                required
                            />

                        </div>

                        <div className="login-campo">

                            <label htmlFor="senha">
                                SENHA
                            </label>

                            <input
                                id="senha"
                                type="password"
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={alterarSenha}
                                required
                            />

                        </div>

                        <button
                            className="login-botao"
                            type="submit"
                            disabled={carregando}
                        >

                            <span>
                                {carregando
                                    ? "ENTRANDO..."
                                    : "FAZER LOGIN"}
                            </span>

                            <span className="login-seta">
                                →
                            </span>

                        </button>

                        <a
                            href="#"
                            className="login-esqueci"
                        >
                            ESQUECI MINHA SENHA
                        </a>

                        <Link
                            to="/cadastro"
                            className="login-esqueci"
                        >
                            CRIAR CONTA
                        </Link>

                        {mensagem && (
                            <p className="login-mensagem">
                                {mensagem}
                            </p>
                        )}

                    </form>

                </div>

                <div className="login-direita">

                    <img
                        src={imagemLogin}
                        alt="White Pony"
                        className="login-pony"
                    />

                </div>

            </section>

        </main>
    );
};