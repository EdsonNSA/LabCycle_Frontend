export interface Turma {
    id: string;
    nomeDisciplina: string;
    codigo: string;
    semestre: string;
    numeroAlunos: number;
}

export type DadosCriacaoTurma = Omit<Turma, 'id'>;

const BASE_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const TURMAS_API_URL = `${BASE_API_URL}/turmas`;

const getToken = () => localStorage.getItem('authToken');


export const buscarTurmas = async (): Promise<Turma[]> => {
    const response = await fetch(TURMAS_API_URL, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Falha ao buscar turmas.');
    return response.json();
};

export const buscarTurmaPorId = async (id: string): Promise<Turma> => {
    const response = await fetch(`${TURMAS_API_URL}/${id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Falha ao buscar detalhes da turma.');
    return response.json();
};

export const criarTurma = async (dados: DadosCriacaoTurma): Promise<Turma> => {
    const response = await fetch(TURMAS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(dados)
    });
    if (!response.ok) throw new Error('Falha ao criar turma.');
    return response.json();
};

export const atualizarTurma = async (id: string, dados: DadosCriacaoTurma): Promise<Turma> => {
    const response = await fetch(`${TURMAS_API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(dados)
    });
    if (!response.ok) throw new Error('Falha ao atualizar turma.');
    return response.json();
};

export const deletarTurma = async (id: string): Promise<void> => {
    const response = await fetch(`${TURMAS_API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
    if (!response.ok) throw new Error('Falha ao deletar turma.');
};