// espelha TRANSICOES_VALIDAS do backend (pedido_service.py)
export const TRANSICOES_STATUS = {
    pendente: ["pago", "cancelado"],
    pago: ["enviado", "cancelado"],
    enviado: [],
    cancelado: [],
};
