import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';
import { Bell, Menu } from 'lucide-react';

const userInfo = {
    nome: 'Edson Nunes',
    departamento: 'Departamento de Química',
    avatarUrl: 'https://placehold.co/40x40/2a5b4a/FFFFFF?text=E'
};

const pageConfig: { [key: string]: { title: string; action?: React.ReactNode } } = {
    '/painel-aluno': { title: 'Painel do Aluno' },
    '/painel-responsavel': { title: 'Painel do Responsável' },
    '/catalogo-kits': { title: 'Catálogo de Kits' },
    '/gestao-inventario': { title: 'Gestão de Inventário' },
    '/minhas-turmas': { title: 'Minhas Turmas' },
    '/gestao-praticas': { title: 'Gerenciar Práticas' },
    '/praticas/:praticaId': { title: 'Detalhes da Prática' },
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const config = pageConfig[location.pathname] || { title: 'LabCycle' };
    const userRole = (localStorage.getItem('userRole') || 'PROFESSOR') as 'ALUNO' | 'PROFESSOR' | 'TECNICO' | 'ADMIN';
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const userEmail = localStorage.getItem('userEmail') || userInfo.nome;
    const userInitial = userEmail.charAt(0).toUpperCase();

    return (
        <div className="layout-container">
            <Sidebar userRole={userRole} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="content-wrapper">
                <header className="main-header">
                    <div className="header-heading">
                        <button className="mobile-menu-button" type="button" aria-label="Abrir menu" onClick={() => setSidebarOpen(true)}>
                            <Menu size={21} />
                        </button>
                        <h2 className="header-title">{config.title}</h2>
                    </div>
                    <div className="header-right-side">
                        {config.action && <div className="header-action">{config.action}</div>}
                        <div className="header-user-info">
                            <button className="notification-button" type="button" aria-label="Notificações">
                                <Bell className="notification-icon" />
                                <span className="notification-dot" aria-hidden="true" />
                            </button>
                            <div className="user-details">
                                <div className="user-avatar" aria-hidden="true">{userInitial}</div>
                                <div>
                                    <p className="user-name">{userEmail}</p>
                                    <p className="user-course">{userRole === 'ALUNO' ? 'Aluno' : 'Equipe LabCycle'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="content-area">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
