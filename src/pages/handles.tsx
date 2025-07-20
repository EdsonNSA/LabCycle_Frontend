import React from 'react';
import { NavigateFunction } from 'react-router-dom';

// --- INTERFACES ---
// Define a estrutura de dados esperada pela função de login
interface LoginProps {
  event: React.FormEvent<HTMLFormElement>;
  email: string;
  password: string;
  navigate: NavigateFunction; // Usando o tipo correto do react-router-dom
}

// Define a estrutura de dados esperada pela função de registro
interface RegisterProps {
  event: React.FormEvent<HTMLFormElement>;
  name: string;
  email: string;
  cpf: string;
  password: string;
  confirmPassword: string;
  role: string; // Ex: 'ALUNO', 'PROFESSOR', 'TECNICO'
  setPasswordErrors: (errors: string[]) => void;
  navigate: NavigateFunction;
}


// --- LÓGICA DE LOGIN MOCADO (ATUALIZADA) ---
export const handleLogin = async ({ event, email, password, navigate }: LoginProps): Promise<void> => {
  event.preventDefault();

  if (!email || !password) {
    alert('Por favor, preencha o e-mail e a senha.');
    return;
  }

  console.log('Simulando login com o e-mail:', email);

  // ==================================================================
  // ATUALIZAÇÃO: Lógica de simulação de perfis de usuário
  // Em um app real, o token JWT viria do back-end com o perfil (role) correto.
  // Aqui, vamos simular isso para testar o redirecionamento.
  let userRole = 'PROFESSOR'; // Padrão é Professor/Técnico

  if (email.toLowerCase().includes('aluno')) {
    userRole = 'ALUNO';
  }
  // ==================================================================

  // Salva os dados falsos no localStorage para o resto da app usar
  localStorage.setItem('authToken', 'token_falso_para_desenvolvimento');
  localStorage.setItem('userRole', userRole);
  localStorage.setItem('userEmail', email);

  alert('Login realizado com sucesso!');
  
  // ==================================================================
  // ATUALIZAÇÃO: Redirecionamento baseado no perfil do usuário
  switch (userRole) {
    case 'ALUNO':
      navigate('/painel-aluno');
      break;
    case 'PROFESSOR':
    case 'TECNICO':
      // Assumindo que você terá uma rota '/painel-professor'
      navigate('/painel-professor'); 
      break;
    default:
      // Rota padrão caso o perfil não seja reconhecido
      navigate('/');
      break;
  }
  // ==================================================================
};


// --- LÓGICA DE REGISTRO MOCADO (SEM ALTERAÇÕES NECESSÁRIAS) ---
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

  // Validações de cliente
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
  
  // Nenhuma chamada à API é feita aqui. Apenas simulação.
  console.log('Simulando cadastro com os dados:', { cpf, email, name, role });

  alert('Cadastro realizado com sucesso! Você será redirecionado para a tela de login.');
  navigate('/login'); // Redireciona o usuário para a tela de login após o cadastro
};
