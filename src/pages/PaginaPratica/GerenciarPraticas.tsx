import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buscarTurmaPorId, Turma } from '../../services/turmaService'; 
import { buscarAgendamentosPorTurma, Agendamento } from '../../services/agendamentoService';
import './GerenciarPraticas.css';
import { CalendarPlus, ClipboardList, ArrowLeft } from 'lucide-react';

const GerenciarPraticas: React.FC = () => {
    const { turmaId } = useParams<{ turmaId: string }>();
    const navigate = useNavigate();

    const [turma, setTurma] = useState<Turma | null>(null);
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (!turmaId) return;

        const carregarDados = async () => {
            try {
                setCarregando(true);
                const [dadosTurma, dadosAgendamentos] = await Promise.all([
                    buscarTurmaPorId(turmaId),
                    buscarAgendamentosPorTurma(turmaId)
                ]);
                setTurma(dadosTurma);
                setAgendamentos(dadosAgendamentos);
                setErro(null);
            } catch (err) {
                setErro("Não foi possível carregar os dados da turma.");
            } finally {
                setCarregando(false);
            }
        };

        carregarDados();
    }, [turmaId]);

    if (carregando) return <p>Carregando práticas da turma...</p>;
    if (erro) return <p style={{ color: 'red' }}>{erro}</p>;

    return (
        <>
            <div className="gp-page-header">
                <div>
                    <button onClick={() => navigate('/minhas-turmas')} className="gp-back-button">
                        <ArrowLeft size={18} /> Voltar para Turmas
                    </button>
                    <h3 className="gp-page-main-title">Práticas Agendadas</h3>
                    {turma && <p className="gp-page-subtitle">Turma: {turma.nomeDisciplina} ({turma.codigo})</p>}
                </div>
                <button className="action-button">
                    <CalendarPlus size={18} /> Agendar Nova Prática
                </button>
            </div>

            <div className="gp-praticas-list">
                {agendamentos.length > 0 ? (
                    agendamentos.map(agendamento => (
                        <div key={agendamento.id} className="gp-pratica-card">
                            <div className="gp-pratica-icon"><ClipboardList size={24} /></div>
                            <div className="gp-pratica-details">
                                <p className="gp-pratica-nome">{agendamento.nomePratica}</p>
                                <p className="gp-pratica-data">
                                    {new Date(agendamento.dataHora).toLocaleString('pt-BR', {
                                        dateStyle: 'long',
                                        timeStyle: 'short'
                                    })}h
                                </p>
                            </div>
                            <div className="gp-pratica-actions">
                                <button 
                                    className="gp-details-button" 
                                    onClick={() => navigate('/pagina-pratica')}
                                >
                                    Ver Detalhes
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="gp-no-praticas">
                        <p>Nenhuma prática agendada para esta turma ainda.</p>
                        <p>Clique em "Agendar Nova Prática" para começar.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default GerenciarPraticas;