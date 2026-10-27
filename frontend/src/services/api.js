export const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8001";

const CHAVE_TOKEN = "@WhitePony:token";

export class ErroApi extends Error {
    constructor(mensagem, status) {
        super(mensagem);
        this.status = status;
    }
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
            typeof dados?.detail === "string"
                ? dados.detail
                : "Não foi possível concluir a operação.",
            resposta.status
        );
    }

    return dados;
}
