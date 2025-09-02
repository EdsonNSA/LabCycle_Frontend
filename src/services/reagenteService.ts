export interface DadosReagente {
    id?: string;
    nome: string;
    numeroCas: string;
    quantidade: number;
    unidade: string;
    dataValidade: string; // Formato 'AAAA-MM-DD'
    localizacao: string;
    status: 'OK' | 'BAIXO_ESTOQUE' | 'VENCENDO' | 'VENCIDO';
}

const API_URL = 'http://localhost:8080/reagentes';

const getToken = (): string | null => {
    return localStorage.getItem('authToken');
};

// Função para buscar
export const buscarReagentes = async (): Promise<DadosReagente[]> => {
    const token = getToken();
    const response = await fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Falha ao buscar reagentes. Verifique se está autenticado.');
    }
    return response.json();
};

// Função para criar
export const criarReagente = async (dadosReagente: DadosReagente): Promise<DadosReagente> => {
    const token = getToken();
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosReagente)
    });
    if (!response.ok) {
        throw new Error('Falha ao adicionar reagente. Verifique os dados e as suas permissões.');
    }
    return response.json();
};

// Função para atualizar
export const atualizarReagente = async (id: string, dadosReagente: DadosReagente): Promise<DadosReagente> => {
    const token = getToken();
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosReagente)
    });
    if (!response.ok) {
        throw new Error('Falha ao atualizar reagente.');
    }
    return response.json();
};

// Função para deletar
export const deletarReagente = async (id: string): Promise<void> => {
    const token = getToken();
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Falha ao deletar reagente.');
    }
};