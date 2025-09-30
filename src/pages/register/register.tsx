import { useState, FormEvent } from 'react';
import './register.css';
import { useNavigate } from 'react-router-dom';
import { handleRegister } from '../handles';
import { cpfMask } from '../../utils/mask/cpfMask';
import logo from '../../assets/logo.1.png';

function Register() {
    const [formulario, setFormulario] = useState({
        nome: '',
        cpf: '',
        email: '',
        cargo: '',
        senha: '',
        confirmarSenha: '',
    });
    
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
    const navigate = useNavigate();

    const aoAlterarCampo = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const valorFormatado = name === "cpf" ? cpfMask(value) : value;
        setFormulario((formAnterior) => ({
            ...formAnterior,
            [name]: valorFormatado,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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

    return (
        <div className="register-container">
            <img src={logo} alt="Logo LabCycle" className="register-logo" />
            <h2>Criar Conta</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                
                <label htmlFor='nomeReg'>Nome Completo</label>
                <div className="input-wrapper">
                    <input
                        id='nomeReg' type="text" name="nome"
                        placeholder="Digite o nome completo"
                        className="register-input" value={formulario.nome}
                        onChange={aoAlterarCampo} required
                    />
                </div>

                <label htmlFor='cpfReg'>CPF</label>
                <div className="input-wrapper">
                    <input
                        id='cpfReg' type="text" name="cpf"
                        placeholder="000.000.000-00"
                        className="register-input" value={formulario.cpf}
                        onChange={aoAlterarCampo} maxLength={14} required
                    />
                </div>

                <label htmlFor='emailReg'>Email</label>
                <div className="input-wrapper">
                    <input
                        id='emailReg' type="email" name="email"
                        placeholder="Digite o email"
                        className="register-input" value={formulario.email}
                        onChange={aoAlterarCampo} required
                    />
                </div>

                <label htmlFor='cargoReg'>Eu sou</label>
                <div className="input-wrapper">
                    <select
                        id='cargoReg' name='cargo'
                        className='register-input' value={formulario.cargo}
                        onChange={aoAlterarCampo} required
                    >
                        <option value="" disabled>Selecione um perfil</option>
                        <option value="ADMIN">Professor/Técnico</option>
                        <option value="USER">Aluno</option>
                    </select>
                </div>

                <label htmlFor='senhaReg'>Senha</label>
                <div className="input-wrapper">
                    <input
                        id='senhaReg' type="password" name="senha"
                        placeholder="Digite sua senha"
                        className="register-input" value={formulario.senha}
                        onChange={aoAlterarCampo} required
                    />
                </div>
                
                {passwordErrors.length > 0 && (
                    <ul className="error-list">
                        {passwordErrors.map((err, idx) => (
                            <li key={idx} className="error-message">{err}</li>
                        ))}
                    </ul>
                )}

                <label htmlFor='confirmSenhaReg'>Confirme a sua senha</label>
                <div className="input-wrapper">
                    <input
                        id='confirmSenhaReg' type="password" name="confirmarSenha"
                        className="register-input" value={formulario.confirmarSenha}
                        onChange={aoAlterarCampo} required
                    />
                </div>

                <button type="submit" className="register-button">Cadastrar</button>
                
                <div className="links-container">
                    <button 
                        type="button" 
                        className="link-button"
                        onClick={() => navigate('/login')}
                    >
                        Já tem uma conta? Faça login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Register;