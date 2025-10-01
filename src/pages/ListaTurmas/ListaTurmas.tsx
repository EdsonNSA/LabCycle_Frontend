import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListaTurmas.css';
import { PlusCircle, Users, FlaskConical, Edit, Trash2 } from 'lucide-react';
import { buscarTurmas, deletarTurma, criarTurma, atualizarTurma, Turma, DadosCriacaoTurma } from '../../services/turmaService';
import { buscarAgendamentos, Agendamento } from '../../services/agendamentoService';
import ModalTurma from './ModalTurma';

const toArray = (data: any): data is any[] => Array.isArray(data);

const ListaTurmas: React.FC = () => {
    const navigate = useNavigate();

    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [turmaEmEdicao, setTurmaEmEdicao] = useState<Turma | null>(null);

    const userEmail = localStorage.getItem('userEmail');
    const isDemoMode = userEmail === 'admin@email.com';

    const userRole = localStorage.getItem('userRole');
    const isManager = userRole === 'ADMIN';

    useEffect(() => {
        const carregarDados = async () => {
            try {
                setCarregando(true);
                let dadosTurmas: Turma[];
                let dadosAgendamentos: Agendamento[];

                if (isDemoMode) {
                    dadosTurmas = toArray(JSON.parse(localStorage.getItem('demoTurmas') || '[]')) ? JSON.parse(localStorage.getItem('demoTurmas') || '[]') : [];
                    dadosAgendamentos = toArray(JSON.parse(localStorage.getItem('demoAgendamentos') || '[]')) ? JSON.parse(localStorage.getItem('demoAgendamentos') || '[]') : [];
                } else {
                    const [apiTurmas, apiAgendamentos] = await Promise.all([
                        buscarTurmas(),
                        buscarAgendamentos()
                    ]);
                    dadosTurmas = toArray(apiTurmas) ? apiTurmas : [];
                    dadosAgendamentos = toArray(apiAgendamentos) ? apiAgendamentos : [];
                }

                setTurmas(dadosTurmas);
                setAgendamentos(dadosAgendamentos);
                setErro(null);
            } catch (err) {
                setErro('Não foi possível carregar os dados.');
            } finally {
                setCarregando(false);
            }
        };
        carregarDados();
    }, [isDemoMode]);

    const handleDeletarTurma = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta turma?')) {
            if (isDemoMode) {
                const turmasAtuais = toArray(JSON.parse(localStorage.getItem('demoTurmas') || '[]')) ? JSON.parse(localStorage.getItem('demoTurmas') || '[]') : [];
                const turmasAtualizadas = turmasAtuais.filter((t: Turma) => t.id !== id);
                localStorage.setItem('demoTurmas', JSON.stringify(turmasAtualizadas));
                setTurmas(turmasAtualizadas);
                alert('Demonstração: Turma removida!');
                return;
            }

            try {
                await deletarTurma(id);
                setTurmas(turmas.filter(t => t.id !== id));
            } catch (error) {
                alert('Falha ao excluir a turma.');
            }
        }
    };
    
    const handleSalvarTurma = async (dados: DadosCriacaoTurma, id?: string) => {
        if (isDemoMode) {
            const turmasAtuais = toArray(JSON.parse(localStorage.getItem('demoTurmas') || '[]')) ? JSON.parse(localStorage.getItem('demoTurmas') || '[]') : [];
            let turmasAtualizadas;
            if (id) {
                turmasAtualizadas = turmasAtuais.map((t: Turma) => t.id === id ? { ...t, ...dados } as Turma : t);
            } else {
                const novaTurma = { ...dados, id: `temp_${Date.now()}` };
                turmasAtualizadas = [...turmasAtuais, novaTurma];
            }
            localStorage.setItem('demoTurmas', JSON.stringify(turmasAtualizadas));
            setTurmas(turmasAtualizadas);
            setModalAberto(false);
            alert('Demonstração: Turma salva!');
            return;
        }
        try {
            if (id) {
                const turmaAtualizada = await atualizarTurma(id, dados);
                setTurmas(turmas.map(t => t.id === id ? turmaAtualizada : t));
            } else {
                const novaTurma = await criarTurma(dados);
                setTurmas([...turmas, novaTurma]);
            }
            setModalAberto(false);
        } catch (error) {
            alert('Não foi possível salvar a turma.');
        }
    };
    
    const abrirModalParaCriar = () => {
        setTurmaEmEdicao(null);
        setModalAberto(true);
    };

    const abrirModalParaEditar = (turma: Turma) => {
        setTurmaEmEdicao(turma);
        setModalAberto(true);
    };

    if (carregando) return <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando turmas...</p>;
    if (erro) return <p style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{erro}</p>;

    return (
        <>
            <div className="lt-page-header">
                <div>
                    <h3 className="lt-page-main-title">Gerencie as suas Turmas</h3>
                    <p className="lt-page-subtitle">Visualize, edite e agende práticas para cada uma das suas turmas ativas.</p>
                </div>
                {isManager && (
                    <button className="action-button" onClick={abrirModalParaCriar}>
                        <PlusCircle size={18} /> Criar Nova Turma
                    </button>
                )}
            </div>

            <div className="lt-turmas-grid">
                {turmas.map(turma => {
                    const praticasCount = agendamentos.filter(ag => ag.turmaCodigo === turma.codigo).length;
                    
                    const isTempItem = String(turma.id).startsWith('temp_');

                    return (
                        <div key={turma.id} className="lt-turma-card">
                            <div className="lt-turma-card-header">
                                <span className="lt-turma-semestre">{turma.semestre}</span>
                                {isManager && (
                                    <div className="lt-turma-actions">
                                        <button onClick={() => abrirModalParaEditar(turma)}><Edit size={16} /></button>
                                        <button onClick={() => handleDeletarTurma(turma.id)}><Trash2 size={16} /></button>
                                    </div>
                                )}
                            </div>
                            <div className="lt-turma-card-body">
                                <h3 className="lt-turma-disciplina">{turma.nomeDisciplina}</h3>
                                <p className="lt-turma-codigo">{turma.codigo}</p>
                                <div className="lt-turma-stats">
                                    <div className="lt-stat-item">
                                        <Users size={16} />
                                        <span>{turma.numeroAlunos} Alunos</span>
                                    </div>
                                    <div className="lt-stat-item">
                                        <FlaskConical size={16} />
                                        <span>{praticasCount} {praticasCount === 1 ? 'Prática' : 'Práticas'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="lt-turma-card-footer">
                                <button
                                    className={`lt-turma-button ${isTempItem ? 'disabled' : ''}`}
                                    onClick={() => {
                                        if (isTempItem) {
                                            alert("Não é possível ver detalhes de itens criados na Demonstração.");
                                        } else {
                                            navigate(`/minhas-turmas/${turma.id}/praticas`);
                                        }
                                    }}
                                >
                                    Práticas
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {modalAberto && (
                <ModalTurma
                    turma={turmaEmEdicao}
                    aoFechar={() => setModalAberto(false)}
                    aoSalvar={handleSalvarTurma}
                />
            )}
        </>
    );
};

export default ListaTurmas;