import React from 'react';
import './PainelResponsavel.css';
import {
    LayoutDashboard,
    FlaskConical,
    Users,
    BookCopy,
    LogOut,
    Bell,
    PlusCircle,
    AlertTriangle,
    CalendarClock,
    ClipboardList,
    MoreHorizontal
} from 'lucide-react';

const professorInfo = {
    nome: 'Edson Nunes',
    departamento: 'Departamento de Química',
    avatarUrl: 'https://placehold.co/40x40/2a5b4a/FFFFFF?text=E'
};

const kpiData = {
    baixoEstoque: 3,
    proximasAulas: 2,
    turmasAtivas: 4
};

const inventarioData = [
    { id: 1, nome: 'Ácido Clorídrico (HCl)', quantidade: '50 mL', status: 'Baixo Estoque' },
    { id: 2, nome: 'Hidróxido de Sódio (NaOH)', quantidade: '500 mL', status: 'OK' },
    { id: 3, nome: 'Nitrato de Prata (AgNO3)', quantidade: '15 g', status: 'Baixo Estoque' },
    { id: 4, nome: 'Etanol (C2H5OH)', quantidade: '1.5 L', status: 'OK' },
    { id: 5, nome: 'Permanganato de Potássio', quantidade: '5 g', status: 'Vencendo' },
];

const agendaData = [
    { id: 1, disciplina: 'Química Geral', turma: '2025.1', pratica: 'Prática 04: Eletrólise', data: '25 de Julho, 14:00' },
    { id: 2, disciplina: 'Química Orgânica', turma: '2025.1', pratica: 'Prática 02: Destilação', data: '28 de Julho, 09:00' },
];

const PainelResponsavel: React.FC = () => {
    return (
        <div className="painel-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1 className="logo-text">LabCycle</h1>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li><a href="#" className="nav-link active"><LayoutDashboard className="nav-icon" />Painel Principal</a></li>
                         <li><a href="#" className="nav-link"><Users className="nav-icon" />Minhas Turmas</a></li>
                        <li><a href="#" className="nav-link"><FlaskConical className="nav-icon" />Inventário</a></li>
                        <li><a href="#" className="nav-link"><BookCopy className="nav-icon" />Catálogo de Kits</a></li>
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <a href="#" className="nav-link"><LogOut className="nav-icon" />Sair</a>
                </div>
            </aside>

            <div className="main-content">
                <header className="main-header">
                    <div>
                        <h2 className="header-title">Painel do Responsável</h2>
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
                    <div className="greeting">
                        <h3 className="greeting-title">Bem-vindo, {professorInfo.nome.split(' ')[0]}!</h3>
                        <p className="greeting-subtitle">Aqui está um resumo das atividades do seu laboratório.</p>
                    </div>

                    <div className="actions-and-kpis">
                        <div className="kpi-cards-grid">
                            <div className="kpi-card">
                                <AlertTriangle className="kpi-icon text-red-500" />
                                <div>
                                    <p className="kpi-value">{kpiData.baixoEstoque}</p>
                                    <p className="kpi-label">Reagentes em Baixo Estoque</p>
                                </div>
                            </div>
                            <div className="kpi-card">
                                <CalendarClock className="kpi-icon text-blue-500" />
                                <div>
                                    <p className="kpi-value">{kpiData.proximasAulas}</p>
                                    <p className="kpi-label">Aulas nas Próximas 48h</p>
                                </div>
                            </div>
                            <div className="kpi-card">
                                <Users className="kpi-icon text-green-500" />
                                <div>
                                    <p className="kpi-value">{kpiData.turmasAtivas}</p>
                                    <p className="kpi-label">Turmas Ativas</p>
                                </div>
                            </div>
                        </div>
                        <div className="quick-actions">
                            <button className="action-button"><PlusCircle size={18} />Adicionar Reagente</button>
                            <button className="action-button"><PlusCircle size={18} />Agendar Prática</button>
                        </div>
                    </div>

                    <div className="card inventario-card">
                        <div className="card-header-flex">
                            <h4 className="card-title">Resumo do Inventário</h4>
                            <a href="#" className="card-link">Ver Inventário Completo →</a>
                        </div>
                        <table className="inventory-table">
                            <thead>
                                <tr>
                                    <th>Reagente</th>
                                    <th>Quantidade Restante</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventarioData.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.nome}</td>
                                        <td>{item.quantidade}</td>
                                        <td>
                                            <span className={`status-badge status-${item.status.toLowerCase().replace(' ', '-')}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td><button className="table-action-button"><MoreHorizontal size={16} /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="card agenda-card">
                         <div className="card-header-flex">
                            <h4 className="card-title">Próximas Aulas Práticas</h4>
                            <a href="#" className="card-link">Ver Agenda Completa →</a>
                        </div>
                        <ul className="agenda-list">
                            {agendaData.map(aula => (
                                <li key={aula.id} className="agenda-item">
                                    <div className="agenda-icon-wrapper"><ClipboardList size={20} /></div>
                                    <div className="agenda-details">
                                        <p className="agenda-pratica">{aula.pratica}</p>
                                        <p className="agenda-disciplina">{aula.disciplina} - Turma {aula.turma}</p>
                                    </div>
                                    <div className="agenda-data">{aula.data}</div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default PainelResponsavel;
