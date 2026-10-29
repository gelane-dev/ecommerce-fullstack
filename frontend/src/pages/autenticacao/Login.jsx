import "./Login.css";
import imagemLogin from "../../assets/login-arte.png";
import { Link, useNavigate } from "react-router-dom";
import { usarAutenticacao } from "../../hooks/usarAutenticacao";
import { usarFormulario } from "../../hooks/usarFormulario";
import { usarEnvio } from "../../hooks/usarEnvio";
import { autenticacaoService } from "../../services/autenticacaoService";

export const Login = () => {
    const navigate = useNavigate();
    const { entrar } = usarAutenticacao();

    const { valores, alterar } = usarFormulario({ email: "", senha: "" });
    const { enviar, carregando, mensagem } = usarEnvio(
        autenticacaoService.login
    );

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { ok, resultado } = await enviar(valores);

        if (ok) {
            entrar(resultado.access_token, resultado.usuario);

            navigate("/");
        }
    };

    return (
        <main className="login">

            <header className="login-header">

                <Link
                    to="/"
                    className="login-marca"
                    aria-label="Voltar para a página inicial"
                >

                    <img
                        src={imagemLogin}
                        alt=""
                        className="login-logo-cavalo"
                    />

                    <span>WHITE PONY</span>

                </Link>

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
                                name="email"
                                type="email"
                                placeholder="Digite seu email"
                                value={valores.email}
                                onChange={alterar}
                                required
                            />

                        </div>

                        <div className="login-campo">

                            <label htmlFor="senha">
                                SENHA
                            </label>

                            <input
                                id="senha"
                                name="senha"
                                type="password"
                                placeholder="Digite sua senha"
                                value={valores.senha}
                                onChange={alterar}
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

                        <div className="login-acoes">

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

                        </div>

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