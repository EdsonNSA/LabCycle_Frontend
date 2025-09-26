import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import {
    LayoutDashboard,
    FlaskConical,
    Users,
    BookCopy,
    LogOut,
    ClipboardList
} from 'lucide-react';
import logo from '../../assets/mini-logo.jpg';


interface SidebarProps {
  userRole: 'ALUNO' | 'PROFESSOR' | 'TECNICO' | 'ADMIN';
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
    const linksResponsavel = [
        { to: "/painel-responsavel", icon: LayoutDashboard, label: "Painel Principal" },
        { to: "/gestao-inventario", icon: FlaskConical, label: "Inventário" },
        { to: "/minhas-turmas", icon: Users, label: "Turmas" },
        { to: "/gestao-praticas", icon: ClipboardList, label: "Gerenciar Práticas" },
        { to: "/catalogo-kits", icon: BookCopy, label: "Catálogo de Kits" },
    ];

    const linksAluno = [
        { to: "/painel-aluno", icon: LayoutDashboard, label: "Painel Principal" },
        { to: "/minhas-turmas", icon: Users, label: "Minhas Turmas" },
        { to: "/gestao-inventario", icon: FlaskConical, label: "Inventário" },
    ];

    const navLinks = userRole === 'ALUNO' ? linksAluno : linksResponsavel;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo-container">
                    <img src={logo} alt="LabCycle Logo" className="sidebar-logo-icon" />
                    <h1 className="logo-text">LabCycle</h1>
                </div>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {navLinks.map((link) => (
                        <li key={link.to}>
                            <NavLink to={link.to} className="nav-link">
                                <link.icon className="nav-icon" />
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="sidebar-footer">
                <NavLink to="/login" className="nav-link" onClick={() => localStorage.clear()}>
                    <LogOut className="nav-icon" />
                    Sair
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;