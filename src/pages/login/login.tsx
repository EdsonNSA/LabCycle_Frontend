import { useState, FormEvent } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../handles';
// 1. Importe os ícones que você precisa do react-icons
import { FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';

// 2. Crie uma interface para as props dos ícones
interface IconProps {
  className?: string;
}

// 3. Use a interface na conversão de tipo
const IconUser = FaUser as unknown as React.FC<IconProps>;
const IconEye = FaEye as unknown as React.FC<IconProps>;
const IconEyeSlash = FaEyeSlash as unknown as React.FC<IconProps>;

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    handleLogin({ event, email, password, navigate });
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={onSubmit}>
        
        <label htmlFor="email">Email</label>
        <div className="input-wrapper">
          <input
            type="email"
            id="email"
            placeholder="Digite seu email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* Agora o TypeScript entende a prop className */}
          <IconUser className="input-icon" />
        </div>
        
        <label htmlFor="password">Senha</label>
        <div className="input-wrapper">
          <input
            type={passwordShown ? 'text' : 'password'}
            id="password"
            placeholder="Digite sua senha"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span onClick={togglePasswordVisibility} className="input-icon">
            {passwordShown ? <IconEyeSlash /> : <IconEye />}
          </span>
        </div>

        <button type="submit" className="login-button">Entrar</button>

        <div className="links-container">
          <a onClick={() => alert('Funcionalidade a ser implementada!')} className="link">Esqueceu sua senha?</a>
          <a onClick={() => navigate('/register')} className="link">Cadastre-se</a>
        </div>
      </form>
    </div>
  );
};

export default Login;