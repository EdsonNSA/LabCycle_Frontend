import React from 'react';
import './GestaoInventario.css';
import {
    LayoutDashboard, FlaskConical, Users, BookCopy, LogOut, Bell, Search, ChevronDown,
    PlusCircle, Filter, Edit, Trash2
} from 'lucide-react';

const professorInfo = {
    nome: 'Edson Nunes',
    departamento: 'Departamento de Química',
    avatarUrl: 'https://placehold.co/40x40/2a5b4a/FFFFFF?text=E'
};

const inventarioData = [
    { id: 1, nome: 'Ácido Clorídrico', cas: '7647-01-0', quantidade: '50 mL', validade: '12/12/2025', local: 'Armário A1', status: 'Baixo Estoque' },
    { id: 2, nome: 'Hidróxido de Sódio', cas: '1310-73-2', quantidade: '500 mL', validade: '01/06/2026', local: 'Armário B2', status: 'OK' },
    { id: 3, nome: 'Nitrato de Prata', cas: '7761-88-8', quantidade: '15 g', validade: '30/09/2025', local: 'Armário C1 (Contr.)', status: 'Baixo Estoque' },
    { id: 4, nome: 'Etanol Absoluto', cas: '64-17-5', quantidade: '1.5 L', validade: '05/03/2027', local: 'Armário Inflamáveis', status: 'OK' },
    { id: 5, nome: 'Permanganato de Potássio', cas: '7722-64-7', quantidade: '5 g', validade: '25/08/2025', local: 'Armário A2', status: 'Vencendo' },
    { id: 6, nome: 'Dicromato de Potássio', cas: '7778-50-9', quantidade: '100 g', validade: '15/02/2025', local: 'Armário C1 (Contr.)', status: 'Vencido' },
];

const GestaoInventario: React.FC = () => {
    return (
        <div className="painel-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1 className="logo-text">LabCycle</h1>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li><a href="#" className="nav-link"><LayoutDashboard className="nav-icon" />Painel Principal</a></li>
                        <li><a href="#" className="nav-link active"><FlaskConical className="nav-icon" />Inventário</a></li>
                        <li><a href="#" className="nav-link"><Users className="nav-icon" />Lista de Turmas</a></li>
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
                        <h2 className="header-title">Gestão de Inventário</h2>
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
                        <div className="search-wrapper">
                            <Search className="search-icon" />
                            <input type="text" placeholder="Buscar reagente por nome ou CAS..." className="search-input" />
                        </div>
                        <div className="filters-wrapper">
                            <button className="filter-button">
                                <Filter size={16} /> Status <ChevronDown size={16} />
                            </button>
                            <button className="filter-button primary">
                                <PlusCircle size={18} /> Adicionar Novo Reagente
                            </button>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="inventory-table">
                            <thead>
                                <tr>
                                    <th>Reagente</th>
                                    <th>Quantidade</th>
                                    <th>Validade</th>
                                    <th>Status</th>
                                    <th>Localização</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventarioData.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="reagente-info">
                                                <span className="reagente-nome">{item.nome}</span>
                                                <span className="reagente-cas">CAS: {item.cas}</span>
                                            </div>
                                        </td>
                                        <td>{item.quantidade}</td>
                                        <td>{item.validade}</td>
                                        <td>
                                            <span className={`status-badge status-${item.status.toLowerCase().replace(' ', '-')}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>{item.local}</td>
                                        <td>
                                            <div className="actions-cell">
                                                <button className="table-action-button"><Edit size={16} /></button>
                                                <button className="table-action-button action-delete"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default GestaoInventario;