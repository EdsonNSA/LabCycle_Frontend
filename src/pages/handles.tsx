
import api from '../services/api'; 
import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


interface LoginProps {
    event: React.FormEvent<HTMLFormElement>;
    email: string;
    password: string;
    navigate: NavigateFunction;
}

interface RegisterProps {
    event: React.FormEvent<HTMLFormElement>;
    name: string;
    email: string;
    cpf: string;
    password: string;
    confirmPassword: string;
    role: string;
    setPasswordErrors: (errors: string[]) => void;
    navigate: NavigateFunction;
}

interface DecodedToken {
    sub: string;
    role: string;
    iat: number;
    exp: number;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';


const getRoleFromToken = (token: string): string => {
    try {
        const decoded: DecodedToken = jwtDecode(token);
        return decoded.role;
    } catch (error) {
        console.error("Token inválido:", error);
        return '';
    }
};


export const handleLogin = async ({ event, email, password, navigate }: LoginProps): Promise<void> => {
    event.preventDefault();

    try {
        const response = await api.post('/auth/login', { email, password });
        const data = response.data;


        const roleFromToken = getRoleFromToken(data.token);
        const userRole = roleFromToken === 'USER' ? 'ALUNO' : roleFromToken;

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userEmail', email);

        switch (userRole) {
            case 'ALUNO':
                navigate('/painel-aluno');
                break;
            case 'ADMIN':
                navigate('/painel-responsavel');
                break;
            default:
                navigate('/');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        alert('Falha no login. Verifique suas credenciais.');
    }
};

export const handleRegister = async ({
    event,
    name,
    email,
    cpf,
    password,
    confirmPassword,
    role,
    setPasswordErrors: _setPasswordErrors,
    navigate
}: RegisterProps): Promise<void> => {
    event.preventDefault();

    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }
    if (cpf.replace(/\D/g, '').length < 11) {
        alert('O CPF está incorreto!');
        return;
    }
    if (!name.trim() || !email.trim() || !role) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    try {
        const requestBody = {
            name,
            login: email,
            senha: password,
            role: role === 'ALUNO' ? 'USER' : role
        };
        await api.post('/auth/registrar', requestBody);


        alert('Cadastro realizado com sucesso! Você será redirecionado para a tela de login.');
        navigate('/login');
    } catch (error: any) {
        console.error('Erro no cadastro:', error);
        const errorMessage = error.response?.data?.message || 'O email informado já pode estar em uso.';
        alert(`Falha no cadastro. ${errorMessage}`);
    }
};