import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import {
    LayoutDashboard,
    FlaskConical,
    Users,
    BookCopy,
    LogOut
} from 'lucide-react';

interface SidebarProps {
  userRole: 'ALUNO' | 'PROFESSOR' | 'TECNICO';
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const linksResponsavel = [
    { to: "/painel-responsavel", icon: LayoutDashboard, label: "Painel Principal" },
    { to: "/gestao-inventario", icon: FlaskConical, label: "Inventário" },
    { to: "/minhas-turmas", icon: Users, label: "Minhas Turmas" },
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
        <h1 className="logo-text">LabCycle</h1>
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
        <NavLink to="/login" className="nav-link">
          <LogOut className="nav-icon" />
          Sair
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;