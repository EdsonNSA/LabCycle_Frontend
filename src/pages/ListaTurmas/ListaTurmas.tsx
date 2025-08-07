import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ListaTurmas.css';
import {
    PlusCircle, Users, FlaskConical
} from 'lucide-react';

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
    const navigate = useNavigate();

    const handleGerenciarPratica = () => {
        navigate('/pagina-pratica');
    };

    return (
        <>
            <div className="lt-page-header">
                <div>
                    <h3 className="lt-page-main-title">Gerencie as suas Turmas</h3>
                    <p className="lt-page-subtitle">Visualize, edite e agende práticas para cada uma das suas turmas ativas.</p>
                </div>
                <button className="action-button">
                    <PlusCircle size={18} /> Criar Nova Turma
                </button>
            </div>

            <div className="lt-turmas-grid">
                {turmasData.map(turma => (
                    <div key={turma.id} className="lt-turma-card">
                        <div className="lt-turma-card-header">
                            <span className="lt-turma-semestre">{turma.semestre}</span>
                        </div>
                        <div className="lt-turma-card-body">
                            <h3 className="lt-turma-disciplina">{turma.disciplina}</h3>
                            <p className="lt-turma-codigo">{turma.codigo}</p>
                            <div className="lt-turma-stats">
                                <div className="lt-stat-item">
                                    <Users size={16} />
                                    <span>{turma.alunos} Alunos</span>
                                </div>
                                <div className="lt-stat-item">
                                    <FlaskConical size={16} />
                                    <span>{turma.praticasAgendadas} Práticas</span>
                                </div>
                            </div>
                        </div>
                        <div className="lt-turma-card-footer">
                            <button className="lt-turma-button" onClick={handleGerenciarPratica}>
                                Gerenciar Prática
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ListaTurmas;