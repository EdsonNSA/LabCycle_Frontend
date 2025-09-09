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

const API_URL = 'http://localhost:8080/praticas';
const getToken = () => localStorage.getItem('authToken');

export const buscarPraticas = async (): Promise<Pratica[]> => {
    const response = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Falha ao buscar a lista de práticas.');
    return response.json();
};

export const buscarPraticaPorId = async (id: string): Promise<Pratica> => {
    const response = await fetch(`${API_URL}/${id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Falha ao buscar detalhes da prática.');
    return response.json();
};

export const criarPratica = async (dados: DadosCadastroPratica): Promise<Pratica> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(dados)
    });
    if (!response.ok) throw new Error('Falha ao criar a prática.');
    return response.json();
};

export const atualizarPratica = async (id: string, dados: Partial<DadosCadastroPratica>): Promise<Pratica> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(dados)
    });
    if (!response.ok) throw new Error('Falha ao atualizar a prática.');
    return response.json();
};

export const deletarPratica = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Falha ao deletar a prática.');
};