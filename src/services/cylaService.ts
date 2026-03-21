import api from './api';

export interface CylaRequest {
    contexto: string;
    pergunta: string;
}

export const perguntarParaCyla = async (dados: CylaRequest): Promise<string> => {
    const response = await api.post('/cyla/perguntar', dados);
    return response.data; 
};