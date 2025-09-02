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

const getRoleFromToken = (token: string): string => {
    try {
        const decoded: { role: string } = jwtDecode(token);
        return decoded.role;
    } catch (error) {
        console.error("Token inválido:", error);
        return '';
    }
};

export const handleLogin = async ({ event, email, password, navigate }: LoginProps): Promise<void> => {
  event.preventDefault();

  try {
    const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Email ou senha inválidos.');
    }

    const data = await response.json();
    const userRole = getRoleFromToken(data.token);

    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('userEmail', email);

    //alert('Login realizado com sucesso!');

    switch (userRole) {
        case 'USER':
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
    const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
    });

    if (!response.ok) {
        throw new Error('O email informado já pode estar em uso.');
    }

    alert('Cadastro realizado com sucesso! Você será redirecionado para a tela de login.');
    navigate('/login');
  } catch (error) {
    console.error('Erro no cadastro:', error);
    alert('Falha no cadastro. Tente novamente.');
  }
};