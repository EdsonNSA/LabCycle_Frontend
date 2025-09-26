
import api from '../services/api'; 


export interface PraticaResumo {
    id: string;
    titulo: string;
}

export interface Agendamento {
    id: string;
    dataHora: string;
    turmaCodigo: string;
    disciplinaNome: string;
    pratica: PraticaResumo;
}

export interface DadosAgendamento {
    turmaId: string;
    praticaId: string;
    dataHora: string;
}


const getToken = () => localStorage.getItem('authToken');

const getAuthHeaders = () => ({
    headers: {
        'Authorization': `Bearer ${getToken()}`
    }
});

export const buscarAgendamentos = async (): Promise<Agendamento[]> => {
    const response = await api.get('/agendamentos', getAuthHeaders());
    return response.data;
};

export const buscarAgendamentosPorTurma = async (turmaId: string): Promise<Agendamento[]> => {
    const response = await api.get(`/agendamentos/por-turma/${turmaId}`, getAuthHeaders());
    return response.data;
};

export const criarAgendamento = async (dados: DadosAgendamento): Promise<Agendamento> => {
    const response = await api.post('/agendamentos', dados, getAuthHeaders());
    return response.data;
};

export const atualizarAgendamento = async (id: string, dados: DadosAgendamento): Promise<Agendamento> => {
    const response = await api.put(`/agendamentos/${id}`, dados, getAuthHeaders());
    return response.data;
};

export const deletarAgendamento = async (id: string): Promise<void> => {
    await api.delete(`/agendamentos/${id}`, getAuthHeaders());
};