import { useState } from "react";

export function useFormulario(valoresIniciais) {

    const [valores, setValores] = useState(valoresIniciais);

    const alterar = (event) => {
        setValores((atuais) => ({
            ...atuais,
            [event.target.name]: event.target.value,
        }));
    };

    const definir = (novosValores) => {
        setValores(novosValores);
    };

    const limpar = () => {
        setValores(valoresIniciais);
    };

    return { valores, alterar, definir, limpar };
}
