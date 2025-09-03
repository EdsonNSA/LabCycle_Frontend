export interface Reagente {
    id?: string;
    nome: string;
    numeroCas: string;
    quantidade: number;
    unidade: string;
    dataValidade: string;
    localizacao: string;
    status: 'OK' | 'BAIXO_ESTOQUE' | 'VENCENDO' | 'VENCIDO';
}


const API_URL = 'http://localhost:8080/reagentes';

const getToken = () => localStorage.getItem('authToken');

export const buscarReagentes = async (): Promise<Reagente[]> => {
    const response = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Falha ao buscar reagentes.');
    return response.json();
};

export const criarReagente = async (dadosReagente: Reagente): Promise<Reagente> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(dadosReagente)
    });
    if (!response.ok) throw new Error('Falha ao adicionar reagente.');
    return response.json();
};

export const atualizarReagente = async (id: string, dadosReagente: Reagente): Promise<Reagente> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(dadosReagente)
    });
    if (!response.ok) throw new Error('Falha ao atualizar reagente.');
    return response.json();
};

export const deletarReagente = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
    if (!response.ok) throw new Error('Falha ao deletar reagente.');
};