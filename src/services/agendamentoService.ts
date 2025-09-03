export interface Agendamento {
    id: string;
    nomePratica: string;
    dataHora: string;
    nomeDisciplina: string;
    codigoTurma: string;
}

export interface DadosAgendamento {
    turmaId: string;
    nomePratica: string;
    dataHora: string;
}

export interface NovoAgendamento extends Agendamento {
    turmaId: string;
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

export const criarAgendamento = async (dados: DadosAgendamento): Promise<NovoAgendamento> => {
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

export const atualizarAgendamento = async (id: string, dados: DadosAgendamento) => {
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

export const deletarAgendamento = async (id: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Falha ao deletar agendamento.');
};

