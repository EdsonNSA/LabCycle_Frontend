import { useState } from 'react';
import './register.css';
import { useNavigate } from 'react-router-dom';

// Funções e tipos importados
import { handleRegister } from '../handles';
import { cpfMask } from '../../utils/mask/cpfMask';
// import { Funcionario } from '../../interfaces/Funcionario'; // << REMOVIDO

// << ADICIONADO: Interface local para definir a estrutura do estado do formulário
interface FormularioState {
  nome: string;
  cpf: string;
  email: string;
  cargo: string;
  senha: string;
  confirmarSenha: string;
}

function Register() {
  // << ALTERADO: Usamos a interface local e inicializamos com um objeto simples
  const [formulario, setFormulario] = useState<FormularioState>({
    nome: '',
    cpf: '',
    email: '',
    cargo: '',
    senha: '',
    confirmarSenha: '',
  });
  
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  // Função para alterar campo (continua igual)
  const aoAlterarCampo = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const valorFormatado = name === "cpf" ? cpfMask(value) : value;

    setFormulario((formAnterior) => ({
      ...formAnterior,
      [name]: valorFormatado,
    }));
  };

  // Função para submeter o formulário (continua igual)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleRegister({
      event: e,
      name: formulario.nome,
      email: formulario.email,
      cpf: formulario.cpf,
      password: formulario.senha,
      confirmPassword: formulario.confirmarSenha,
      role: formulario.cargo,
      setPasswordErrors,
      navigate,
    });
  };

  // O JSX do formulário (continua exatamente o mesmo)
  return (
    <div className="register-container">
      <h2>Cadastro de Funcionário</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        {/* ... todo o seu JSX do formulário permanece aqui ... */}
        
        <label htmlFor='nomeReg'>Nome Completo</label>
        <input
          id='nomeReg'
          type="text"
          name="nome"
          placeholder="Digite o nome completo"
          className="register-input"
          value={formulario.nome}
          onChange={aoAlterarCampo}
          required
        />

        <label htmlFor='cpfReg'>CPF</label>
        <input
          id='cpfReg'
          type="text"
          name="cpf"
          placeholder="000.000.000-00"
          className="register-input"
          value={formulario.cpf}
          onChange={aoAlterarCampo}
          maxLength={14}
          required
        />

        <label htmlFor='emailReg'>Email</label>
        <input
          id='emailReg'
          type="email"
          name="email"
          placeholder="Digite o email"
          className="register-input"
          value={formulario.email}
          onChange={aoAlterarCampo}
          required
        />

        <label htmlFor='cargoReg'>Cargo</label>
        <select
          id='cargoReg'
          name='cargo'
          className='register-input'
          value={formulario.cargo}
          onChange={aoAlterarCampo}
          required
        >
          <option value="" disabled>Selecione um cargo</option>
          <option value="ADMIN">Administrador</option>
          <option value="USER">Funcionário</option>
        </select>

        <label htmlFor='senhaReg'>Senha</label>
        <input
          id='senhaReg'
          type="password"
          name="senha"
          placeholder="Digite sua senha"
          className="register-input"
          value={formulario.senha}
          onChange={aoAlterarCampo}
          required
        />
        
        {passwordErrors.length > 0 && (
          <ul className="error-list">
            {passwordErrors.map((err, idx) => (
              <li key={idx} className="error-message">{err}</li>
            ))}
          </ul>
        )}

        <label htmlFor='confirmSenhaReg'>Confirme sua senha</label>
        <input
          id='confirmSenhaReg'
          type="password"
          name="confirmarSenha"
          placeholder="Confirme sua senha"
          className="register-input"
          value={formulario.confirmarSenha}
          onChange={aoAlterarCampo}
          required
        />

        <button type="submit" className="register-button">Cadastrar</button>
      </form>
    </div>
  );
}

export default Register;