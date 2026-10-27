import "./Mensagem.css";

export const Mensagem = ({ texto }) => {
    if (!texto) {
        return null;
    }

    return (
        <p className="mensagem-erro" role="alert">
            {texto}
        </p>
    );
};
