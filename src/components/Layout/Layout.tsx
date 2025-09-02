import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';
import { Bell, PlusCircle } from 'lucide-react';

const userInfo = {
    nome: 'Edson Nunes',
    departamento: 'Departamento de Química',
    avatarUrl: 'https://placehold.co/40x40/2a5b4a/FFFFFF?text=E'
};

const pageConfig: { [key: string]: { title: string; action?: React.ReactNode } } = {
    '/painel-aluno': { title: 'Painel do Aluno' },
    '/painel-responsavel': { title: 'Painel do Responsável' },
    '/catalogo-kits': { title: 'Catálogo de Kits' },
    '/gestao-inventario': { 
        title: 'Gestão de Inventário',
    },
    '/minhas-turmas': { 
        title: 'Minhas Turmas',
    },
    '/pagina-pratica': { title: 'Detalhes da Prática' },
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const config = pageConfig[location.pathname] || { title: 'LabCycle' };
    const userRole = (localStorage.getItem('userRole') || 'PROFESSOR') as 'ALUNO' | 'PROFESSOR' | 'TECNICO';

    return (
        <div className="layout-container">
            <Sidebar userRole={userRole} />
            <div className="content-wrapper">
                <header className="main-header">
                    <div>
                        <h2 className="header-title">{config.title}</h2>
                    </div>
                    <div className="header-right-side">
                        {config.action && <div className="header-action">{config.action}</div>}
                        <div className="header-user-info">
                            <Bell className="notification-icon" />
                            <div className="user-details">
                                <img src={userInfo.avatarUrl} alt="Avatar do usuário" className="user-avatar" />
                                <div>
                                    <p className="user-name">{userInfo.nome}</p>
                                    <p className="user-course">{userInfo.departamento}</p>
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