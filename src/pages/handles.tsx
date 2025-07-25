import React from 'react';
import { NavigateFunction } from 'react-router-dom';

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

export const handleLogin = async ({ event, email, password, navigate }: LoginProps): Promise<void> => {
  event.preventDefault();

  if (!email || !password) {
    alert('Por favor, preencha o e-mail e a senha.');
    return;
  }

  console.log('Simulando login com o e-mail:', email);

  let userRole = 'PROFESSOR';

  if (email.toLowerCase().includes('aluno')) {
    userRole = 'ALUNO';
  }
  localStorage.setItem('authToken', 'token_falso_para_desenvolvimento');
  localStorage.setItem('userRole', userRole);
  localStorage.setItem('userEmail', email);

  alert('Login realizado com sucesso!');
  
  switch (userRole) {
    case 'ALUNO':
      navigate('/painel-aluno');
      break;
    case 'PROFESSOR':
    case 'TECNICO':
      navigate('/painel-professor'); 
      break;
    default:
      navigate('/');
      break;
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
  setPasswordErrors,
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
  
  console.log('Simulando cadastro com os dados:', { cpf, email, name, role });

  alert('Cadastro realizado com sucesso! Você será redirecionado para a tela de login.');
  navigate('/login');
};
