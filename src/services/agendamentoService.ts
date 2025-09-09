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

const API_URL = 'http://localhost:8080/agendamentos';
const getToken = () => localStorage.getItem('authToken');

export const buscarAgendamentos = async (): Promise<Agendamento[]> => {
    const response = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Falha ao buscar agendamentos.');
    return response.json();
};

export const buscarAgendamentosPorTurma = async (turmaId: string): Promise<Agendamento[]> => {
    const response = await fetch(`${API_URL}/por-turma/${turmaId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Falha ao buscar os agendamentos da turma.');
    return response.json();
};

export const criarAgendamento = async (dados: DadosAgendamento): Promise<Agendamento> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(dados)
    });
    if (!response.ok) {
        const erro = await response.text();
        throw new Error(`Falha ao criar agendamento: ${erro}`);
    }
    return response.json();
};

export const atualizarAgendamento = async (id: string, dados: DadosAgendamento): Promise<Agendamento> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(dados)
    });
    if (!response.ok) throw new Error('Falha ao atualizar agendamento.');
    return response.json();
};

export const deletarAgendamento = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Falha ao deletar agendamento.');
};