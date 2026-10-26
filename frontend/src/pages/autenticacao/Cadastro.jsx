import { useState } from "react";
import "./Login.css";
import imagemLogin from "../../assets/login-arte.png";
import { Link, useNavigate } from "react-router-dom";

export const Cadastro = () => {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setCarregando(true);
        setMensagem("");

        try {
            const resposta = await fetch(
                "http://localhost:8001/cadastro/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: nome,
                        email,
                        senha,
                    }),
                }
            );

            const dados = await resposta.json();

            if (resposta.ok) {
                navigate("/login");
            } else {
                setMensagem(
                    typeof dados.detail === "string"
                        ? dados.detail
                        : "Verifique os dados informados."
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

            </header>

            <section className="login-conteudo">

                <div className="login-esquerda">

                    <form
                        className="login-formulario"
                        onSubmit={handleSubmit}
                    >

                        <span className="login-pre-titulo">
                            NOVO(A) POR AQUI?
                        </span>

                        <h1>
                            CRIAR CONTA
                        </h1>

                        <p className="login-subtitulo">
                            Cadastre-se para comprar na White Pony.
                        </p>

                        <div className="login-campo">

                            <label htmlFor="nome">
                                NOME
                            </label>

                            <input
                                id="nome"
                                type="text"
                                placeholder="Digite seu nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                minLength={3}
                                maxLength={100}
                                required
                            />

                        </div>

                        <div className="login-campo">

                            <label htmlFor="email">
                                EMAIL
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                placeholder="Mínimo de 6 caracteres"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                minLength={6}
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
                                    ? "CRIANDO..."
                                    : "CRIAR CONTA"}
                            </span>

                            <span className="login-seta">
                                →
                            </span>

                        </button>

                        <Link
                            to="/login"
                            className="login-esqueci"
                        >
                            JÁ TENHO CONTA
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
