export interface Comentario {
    id: string;
    conteudo: string;
    nomeAutor: string;
    dataCriacao: string;
}

export interface DadosNovoComentario {
    conteudo: string;
}

const API_URL = 'http://localhost:8080/praticas';
const getToken = () => localStorage.getItem('authToken');

export const buscarComentarios = async (praticaId: string): Promise<Comentario[]> => {
    const response = await fetch(`${API_URL}/${praticaId}/comentarios`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Falha ao buscar comentários.');
    return response.json();
};

export const criarComentario = async (praticaId: string, dados: DadosNovoComentario): Promise<Comentario> => {
    const response = await fetch(`${API_URL}/${praticaId}/comentarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(dados)
    });
    if (!response.ok) throw new Error('Falha ao criar comentário.');
    return response.json();
};