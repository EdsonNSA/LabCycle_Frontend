import React from 'react';
import './GestaoInventario.css';
import {
    Search, ChevronDown, PlusCircle, Filter, Edit, Trash2
} from 'lucide-react';

const inventarioData = [
    { id: 1, nome: 'Ácido Clorídrico', cas: '7647-01-0', quantidade: '50 mL', validade: '12/12/2025', local: 'Armário A1', status: 'Baixo Estoque' },
    { id: 2, nome: 'Hidróxido de Sódio', cas: '1310-73-2', quantidade: '500 mL', validade: '01/06/2026', local: 'Armário B2', status: 'OK' },
    { id: 3, nome: 'Nitrato de Prata', cas: '7761-88-8', quantidade: '15 g', validade: '30/09/2025', local: 'Armário C1 (Contr.)', status: 'Baixo Estoque' },
    { id: 4, nome: 'Etanol Absoluto', cas: '64-17-5', quantidade: '1.5 L', validade: '05/03/2027', local: 'Armário Inflamáveis', status: 'OK' },
    { id: 5, nome: 'Permanganato de Potássio', cas: '7722-64-7', quantidade: '5 g', validade: '25/08/2025', local: 'Armário A2', status: 'Vencendo' },
    { id: 6, nome: 'Dicromato de Potássio', cas: '7778-50-9', quantidade: '100 g', validade: '15/02/2025', local: 'Armário C1 (Contr.)', status: 'Vencido' },
];

const GestaoInventario: React.FC = () => {
    const userRole = localStorage.getItem('userRole');
    const isManager = userRole === 'PROFESSOR' || userRole === 'TECNICO' || userRole === 'ADMIN';

    return (
        <>
            <div className="gi-page-header">
                <div className="gi-search-wrapper">
                    <Search className="gi-search-icon" />
                    <input type="text" placeholder="Buscar reagente por nome ou CAS..." className="gi-search-input" />
                </div>
                {isManager && (
                    <div className="gi-filters-wrapper">
                        <button className="gi-filter-button">
                            <Filter size={16} /> Status <ChevronDown size={16} />
                        </button>
                        <button className="action-button">
                            <PlusCircle size={18} /> Adicionar Novo Reagente
                        </button>
                    </div>
                )}
            </div>

            <div className="gi-table-container">
                <table className="gi-inventory-table">
                    <thead>
                        <tr>
                            <th>Reagente</th>
                            <th>Quantidade</th>
                            <th>Validade</th>
                            <th>Status</th>
                            <th>Localização</th>
                            {isManager && <th>Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {inventarioData.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <div className="gi-reagente-info">
                                        <span className="gi-reagente-nome">{item.nome}</span>
                                        <span className="gi-reagente-cas">CAS: {item.cas}</span>
                                    </div>
                                </td>
                                <td>{item.quantidade}</td>
                                <td>{item.validade}</td>
                                <td>
                                    <span className={`gi-status-badge status-${item.status.toLowerCase().replace(' ', '-')}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td>{item.local}</td>
                                {isManager && (
                                    <td>
                                        <div className="gi-actions-cell">
                                            <button className="gi-table-action-button"><Edit size={16} /></button>
                                            <button className="gi-table-action-button action-delete"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default GestaoInventario;