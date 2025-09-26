
import api from '../services/api';

export interface Pratica {
    id: string;
    titulo: string;
    disciplina: string;
    duracao: string;
    dificuldade: string;
    videoUrl: string;
    objetivosJson: string;
    procedimentoJson: string;
    segurancaJson: string;
    materiaisJson: string;
    reagentesJson: string;
    descarte: string;
}

export type DadosCadastroPratica = Omit<Pratica, 'id'>;

const getToken = () => localStorage.getItem('authToken');

const getAuthHeaders = () => ({
    headers: {
        'Authorization': `Bearer ${getToken()}`
    }
});

export const buscarPraticas = async (): Promise<Pratica[]> => {
    const response = await api.get('/praticas', getAuthHeaders());
    return response.data;
};

export const buscarPraticaPorId = async (id: string): Promise<Pratica> => {
    const response = await api.get(`/praticas/${id}`, getAuthHeaders());
    return response.data;
};

export const criarPratica = async (dados: DadosCadastroPratica): Promise<Pratica> => {
    const response = await api.post('/praticas', dados, getAuthHeaders());
    return response.data;
};

export const atualizarPratica = async (id: string, dados: Partial<DadosCadastroPratica>): Promise<Pratica> => {
    const response = await api.put(`/praticas/${id}`, dados, getAuthHeaders());
    return response.data;
};

export const deletarPratica = async (id: string): Promise<void> => {
    await api.delete(`/praticas/${id}`, getAuthHeaders());
};