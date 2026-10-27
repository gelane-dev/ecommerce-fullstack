export const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8001";

const CHAVE_TOKEN = "@WhitePony:token";

export class ErroApi extends Error {
    constructor(mensagem, status) {
        super(mensagem);
        this.status = status;
    }
}

const MENSAGEM_GENERICA = "Não foi possível concluir a operação.";
const MAXIMO_DE_AVISOS = 2;

// o 422 do FastAPI traz detail como lista de { loc, msg, type, ctx }
function descreverCampoInvalido(entrada) {
    const campo = Array.isArray(entrada?.loc) ? entrada.loc.at(-1) : null;

    if (typeof campo !== "string" || !entrada.type) {
        return null;
    }

    const limites = entrada.ctx ?? {};

    switch (entrada.type) {
        case "string_too_short":
            return limites.min_length
                ? `O campo "${campo}" precisa ter pelo menos ${limites.min_length} caracteres.`
                : `O campo "${campo}" está curto demais.`;
        case "string_too_long":
            return limites.max_length
                ? `O campo "${campo}" pode ter no máximo ${limites.max_length} caracteres.`
                : `O campo "${campo}" está longo demais.`;
        case "missing":
            return `O campo "${campo}" é obrigatório.`;
        default:
            return `O campo "${campo}" é inválido.`;
    }
}

export function extrairMensagemErro(detail) {
    if (typeof detail === "string") {
        return detail;
    }

    if (!Array.isArray(detail)) {
        return MENSAGEM_GENERICA;
    }

    const avisos = detail
        .map(descreverCampoInvalido)
        .filter(Boolean)
        .slice(0, MAXIMO_DE_AVISOS);

    return avisos.length > 0 ? avisos.join(" ") : MENSAGEM_GENERICA;
}

export async function requisitar(
    caminho,
    { metodo = "GET", corpo, autenticado = false } = {}
) {
    const headers = {};
    let body;

    if (autenticado) {
        headers.Authorization = `Bearer ${localStorage.getItem(CHAVE_TOKEN)}`;
    }

    if (corpo instanceof FormData) {
        body = corpo;
    } else if (corpo !== undefined) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(corpo);
    }

    let resposta;

    try {
        resposta = await fetch(`${API_URL}${caminho}`, {
            method: metodo,
            headers,
            body,
        });
    } catch {
        throw new ErroApi("Não foi possível conectar ao servidor.", 0);
    }

    const dados = await resposta.json().catch(() => null);

    if (!resposta.ok) {
        throw new ErroApi(
            extrairMensagemErro(dados?.detail),
            resposta.status
        );
    }

    return dados;
}
