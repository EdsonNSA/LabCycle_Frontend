
import api from '../services/api';

export interface Turma {
    id: string;
    nomeDisciplina: string;
    codigo: string;
    semestre: string;
    numeroAlunos: number;
}

export type DadosCriacaoTurma = Omit<Turma, 'id'>;

const getToken = () => localStorage.getItem('authToken');

const getAuthHeaders = () => ({
    headers: {
        'Authorization': `Bearer ${getToken()}`
    }
});

export const buscarTurmas = async (): Promise<Turma[]> => {
    const response = await api.get('/turmas', getAuthHeaders());
    return response.data;
};

export const buscarTurmaPorId = async (id: string): Promise<Turma> => {
    const response = await api.get(`/turmas/${id}`, getAuthHeaders());
    return response.data;
};

export const criarTurma = async (dados: DadosCriacaoTurma): Promise<Turma> => {
    const response = await api.post('/turmas', dados, getAuthHeaders());
    return response.data;
};

export const atualizarTurma = async (id: string, dados: DadosCriacaoTurma): Promise<Turma> => {
    const response = await api.put(`/turmas/${id}`, dados, getAuthHeaders());
    return response.data;
};

export const deletarTurma = async (id: string): Promise<void> => {
    await api.delete(`/turmas/${id}`, getAuthHeaders());
};