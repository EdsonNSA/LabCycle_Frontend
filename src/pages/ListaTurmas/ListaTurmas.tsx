import React from 'react';
import './ListaTurmas.css';
import {
    LayoutDashboard, FlaskConical, Users, BookCopy, LogOut, Bell, PlusCircle
} from 'lucide-react';

const professorInfo = {
    nome: 'Edson Nunes',
    departamento: 'Departamento de Química',
    avatarUrl: 'https://placehold.co/40x40/2a5b4a/FFFFFF?text=E'
};

const turmasData = [
    {
        id: 1,
        disciplina: 'Química Geral',
        codigo: 'QUI-101',
        semestre: '2025.1',
        alunos: 45,
        praticasAgendadas: 8
    },
    {
        id: 2,
        disciplina: 'Química Orgânica I',
        codigo: 'QUI-203',
        semestre: '2025.1',
        alunos: 32,
        praticasAgendadas: 5
    },
    {
        id: 3,
        disciplina: 'Físico-Química',
        codigo: 'QUI-305',
        semestre: '2025.1',
        alunos: 28,
        praticasAgendadas: 3
    },
    {
        id: 4,
        disciplina: 'Química Analítica',
        codigo: 'QUI-208',
        semestre: '2025.1',
        alunos: 35,
        praticasAgendadas: 10
    },
];

const ListaTurmas: React.FC = () => {
    return (
        <div className="painel-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1 className="logo-text">LabCycle</h1>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li><a href="#" className="nav-link"><LayoutDashboard className="nav-icon" />Painel Principal</a></li>
                        <li><a href="#" className="nav-link"><FlaskConical className="nav-icon" />Inventário</a></li>
                        <li><a href="#" className="nav-link active"><Users className="nav-icon" />Lista de Turmas</a></li>
                        <li><a href="#" className="nav-link"><BookCopy className="nav-icon" />Catálogo de Práticas</a></li>
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <a href="#" className="nav-link"><LogOut className="nav-icon" />Sair</a>
                </div>
            </aside>

            <div className="main-content">
                <header className="main-header">
                    <div>
                        <h2 className="header-title">Minhas Turmas</h2>
                    </div>
                    <div className="header-user-info">
                        <Bell className="notification-icon" />
                        <div className="user-details">
                            <img src={professorInfo.avatarUrl} alt="Avatar do professor" className="user-avatar" />
                            <div>
                                <p className="user-name">{professorInfo.nome}</p>
                                <p className="user-course">{professorInfo.departamento}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="content-area">
                    <div className="page-header">
                        <div>
                            <h3 className="page-main-title">Gerencie suas Turmas</h3>
                            <p className="page-subtitle">Visualize, edite e agende práticas para cada uma de suas turmas ativas.</p>
                        </div>
                        <button className="action-button">
                            <PlusCircle size={18} /> Criar Nova Turma
                        </button>
                    </div>

                    <div className="turmas-grid">
                        {turmasData.map(turma => (
                            <div key={turma.id} className="turma-card">
                                <div className="turma-card-header">
                                    <span className="turma-semestre">{turma.semestre}</span>
                                </div>
                                <div className="turma-card-body">
                                    <h3 className="turma-disciplina">{turma.disciplina}</h3>
                                    <p className="turma-codigo">{turma.codigo}</p>
                                    <div className="turma-stats">
                                        <div className="stat-item">
                                            <Users size={16} />
                                            <span>{turma.alunos} Alunos</span>
                                        </div>
                                        <div className="stat-item">
                                            <FlaskConical size={16} />
                                            <span>{turma.praticasAgendadas} Práticas</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="turma-card-footer">
                                    <button className="turma-button">Gerenciar Turma</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ListaTurmas;