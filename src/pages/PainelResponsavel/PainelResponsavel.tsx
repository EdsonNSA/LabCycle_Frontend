import React from 'react';
import './PainelResponsavel.css';
import {
    PlusCircle,
    AlertTriangle,
    CalendarClock,
    Users,
    ClipboardList,
    MoreHorizontal
} from 'lucide-react';

const professorInfo = {
    nome: 'Edson Nunes',
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
        <>
            <div className="greeting">
                <h3 className="greeting-title">Bem-vindo, {professorInfo.nome.split(' ')[0]}!</h3>
                <p className="greeting-subtitle">Aqui está um resumo das atividades do seu laboratório.</p>
            </div>

            <div className="pr-actions-and-kpis">
                <div className="pr-kpi-cards-grid">
                    <div className="pr-kpi-card">
                        <AlertTriangle className="pr-kpi-icon text-red-500" />
                        <div>
                            <p className="pr-kpi-value">{kpiData.baixoEstoque}</p>
                            <p className="pr-kpi-label">Reagentes em Baixo Estoque</p>
                        </div>
                    </div>
                    <div className="pr-kpi-card">
                        <CalendarClock className="pr-kpi-icon text-blue-500" />
                        <div>
                            <p className="pr-kpi-value">{kpiData.proximasAulas}</p>
                            <p className="pr-kpi-label">Aulas nas Próximas 48h</p>
                        </div>
                    </div>
                    <div className="pr-kpi-card">
                        <Users className="pr-kpi-icon text-green-500" />
                        <div>
                            <p className="pr-kpi-value">{kpiData.turmasAtivas}</p>
                            <p className="pr-kpi-label">Turmas Ativas</p>
                        </div>
                    </div>
                </div>
                <div className="pr-quick-actions">
                    <button className="action-button"><PlusCircle size={18} />Adicionar Reagente</button>
                    <button className="action-button"><PlusCircle size={18} />Agendar Prática</button>
                </div>
            </div>

            <div className="card pr-inventario-card">
                <div className="pr-card-header-flex">
                    <h4 className="card-title">Resumo do Inventário</h4>
                    <a href="#" className="pr-card-link">Ver Inventário Completo →</a>
                </div>
                <table className="pr-inventory-table">
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
                                    <span className={`pr-status-badge status-${item.status.toLowerCase().replace(' ', '-')}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td><button className="pr-table-action-button"><MoreHorizontal size={16} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="card pr-agenda-card">
                 <div className="pr-card-header-flex">
                    <h4 className="card-title">Próximas Aulas Práticas</h4>
                    <a href="#" className="pr-card-link">Ver Agenda Completa →</a>
                </div>
                <ul className="pr-agenda-list">
                    {agendaData.map(aula => (
                        <li key={aula.id} className="pr-agenda-item">
                            <div className="pr-agenda-icon-wrapper"><ClipboardList size={20} /></div>
                            <div className="pr-agenda-details">
                                <p className="pr-agenda-pratica">{aula.pratica}</p>
                                <p className="pr-agenda-disciplina">{aula.disciplina} - Turma {aula.turma}</p>
                            </div>
                            <div className="pr-agenda-data">{aula.data}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default PainelResponsavel;