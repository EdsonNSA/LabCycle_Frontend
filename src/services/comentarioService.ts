
import api from '../services/api';

export interface Comentario {
    id: string;
    conteudo: string;
    nomeAutor: string;
    dataCriacao: string;
}

export interface DadosNovoComentario {
    conteudo: string;
}

const getToken = () => localStorage.getItem('authToken');

const getAuthHeaders = () => ({
    headers: {
        'Authorization': `Bearer ${getToken()}`
    }
});

export const buscarComentarios = async (praticaId: string): Promise<Comentario[]> => {
    const response = await api.get(`/praticas/${praticaId}/comentarios`, getAuthHeaders());
    return response.data;
};

export const criarComentario = async (praticaId: string, dados: DadosNovoComentario): Promise<Comentario> => {
    const response = await api.post(`/praticas/${praticaId}/comentarios`, dados, getAuthHeaders());
    return response.data;
};