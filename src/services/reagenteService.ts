
import api from '../services/api';

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

const getToken = () => localStorage.getItem('authToken');

const getAuthHeaders = () => ({
    headers: {
        'Authorization': `Bearer ${getToken()}`
    }
});

export const buscarReagentes = async (): Promise<Reagente[]> => {
    const response = await api.get('/reagentes', getAuthHeaders());
    return response.data;
};

export const criarReagente = async (dadosReagente: Reagente): Promise<Reagente> => {
    const response = await api.post('/reagentes', dadosReagente, getAuthHeaders());
    return response.data;
};

export const atualizarReagente = async (id: string, dadosReagente: Reagente): Promise<Reagente> => {
    const response = await api.put(`/reagentes/${id}`, dadosReagente, getAuthHeaders());
    return response.data;
};

export const deletarReagente = async (id: string): Promise<void> => {
    await api.delete(`/reagentes/${id}`, getAuthHeaders());
};