export interface Turma {
    id: string;
    nomeDisciplina: string;
    codigo: string;
    semestre: string;
    numeroAlunos: number;
}

export type DadosCriacaoTurma = Omit<Turma, 'id'>;

const API_URL = 'http://localhost:8080/turmas';
const getToken = () => localStorage.getItem('authToken');

export const buscarTurmas = async (): Promise<Turma[]> => {
    const response = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Falha ao buscar turmas.');
    return response.json();
};

export const criarTurma = async (dados: DadosCriacaoTurma): Promise<Turma> => {
    const response = await fetch(API_URL, {
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

