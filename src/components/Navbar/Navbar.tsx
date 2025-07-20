import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaPlus, FaUserShield, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const IconDashboard = FaTachometerAlt as unknown as React.FC;
const IconUsers = FaUsers as unknown as React.FC;
const IconPlus = FaPlus as unknown as React.FC;
const IconUserShield = FaUserShield as unknown as React.FC;
const IconSignOut = FaSignOutAlt as unknown as React.FC;

const Navbar = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    return (
        <nav className="sidebar-nav">
            <div className="sidebar-container">
                <div className="sidebar-logo">
                    <NavLink to="/visualizar_vitima">
                        Secretaria da Mulher
                    </NavLink>
                </div>

                <ul className="nav-menu">
                    <li>
                        <NavLink to="/dashboard" className="nav-link">
                            <IconDashboard />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/visualizar_vitima" className="nav-link">
                            <IconUsers />
                            <span>Mulheres Cadastradas</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/cadastro_vitima" className="nav-link">
                            <IconPlus />
                            <span>Novo Cadastro</span>
                        </NavLink>
                    </li>
                    
                    {userRole === 'ADMIN' && (
                        <li>
                            <NavLink to="/FuncionariosList" className="nav-link">
                                <IconUserShield />
                                <span>Funcionários</span>
                            </NavLink>
                        </li>
                    )}
                </ul>
                
                <div className="sidebar-logout">
                    <button onClick={handleLogout} className="nav-link logout-button">
                        <IconSignOut />
                        <span>Sair</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;