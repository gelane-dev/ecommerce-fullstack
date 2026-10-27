import "./Login.css";
import imagemLogin from "../../assets/login-arte.png";
import { Link, useNavigate } from "react-router-dom";
import { usarFormulario } from "../../hooks/usarFormulario";
import { usarEnvio } from "../../hooks/usarEnvio";
import { autenticacaoService } from "../../services/autenticacaoService";

export const Cadastro = () => {
    const navigate = useNavigate();

    const { valores, alterar } = usarFormulario({
        name: "",
        email: "",
        senha: "",
    });
    const { enviar, carregando, mensagem } = usarEnvio(
        autenticacaoService.cadastrar
    );

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { ok } = await enviar(valores);

        if (ok) {
            navigate("/login");
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
                                name="name"
                                type="text"
                                placeholder="Digite seu nome"
                                value={valores.name}
                                onChange={alterar}
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
                                placeholder="Mínimo de 6 caracteres"
                                value={valores.senha}
                                onChange={alterar}
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
