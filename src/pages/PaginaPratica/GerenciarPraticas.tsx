import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buscarAgendamentosPorTurma, criarAgendamento, Agendamento, DadosAgendamento } from '../../services/agendamentoService';
import { buscarTurmaPorId, Turma } from '../../services/turmaService';
import { buscarPraticas, Pratica } from '../../services/PraticaService';
import './GerenciarPraticas.css';
import { CalendarPlus, ClipboardList, ArrowLeft, X } from 'lucide-react';

interface ModalAgendamentoProps {
    isOpen: boolean;
    turma: Turma;
    praticas: Pratica[];
    aoFechar: () => void;
    aoSalvar: (dados: Omit<DadosAgendamento, 'turmaId'>) => void;
}

const ModalAgendamento: React.FC<ModalAgendamentoProps> = ({ isOpen, turma, praticas, aoFechar, aoSalvar }) => {
    const [praticaId, setPraticaId] = useState('');
    const [dataHora, setDataHora] = useState('');

    useEffect(() => {
        if (isOpen) {
            setPraticaId('');
            setDataHora('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!praticaId || !dataHora) {
            alert('Por favor, selecione uma prática e uma data.');
            return;
        }
        aoSalvar({ praticaId, dataHora });
    };

    const agora = new Date();
    agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
    const agoraString = agora.toISOString().slice(0, 16);

    return (
        <div className="modal-overlay" onClick={aoFechar}> 
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h3>Agendar Nova Prática</h3>
                        <button type="button" className="modal-close-button" onClick={aoFechar}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className="modal-body">
                        <p className="gp-modal-subtitle">Para a turma: <strong>{turma.nomeDisciplina} ({turma.codigo})</strong></p>
                        
                        <div className="form-group">
                            <label htmlFor="praticaId">Prática</label>
                            <select id="praticaId" value={praticaId} onChange={(e) => setPraticaId(e.target.value)} required>
                                <option value="" disabled>Selecione uma prática</option>
                                {praticas.map(pratica => (
                                    <option key={pratica.id} value={pratica.id}>{pratica.titulo}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="dataHora">Data e Hora</label>
                            <input 
                                type="datetime-local" 
                                id="dataHora" 
                                value={dataHora} 
                                onChange={(e) => {
                                    let value = e.target.value;
                                    if (value) {
                                        let [ano] = value.split('-');
                                        if (ano.length > 4) {
                                            ano = ano.slice(0, 4);
                                            value = ano + value.substring(ano.length);
                                        }
                                    }
                                    setDataHora(value);
                                }} 
                                min={agoraString}
                                max="9999-12-31T23:59"
                                required 
                            />
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="button-secondary" onClick={aoFechar}>Cancelar</button>
                        <button type="submit" className="button-primary">Agendar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const GerenciarPraticas: React.FC = () => {
    const { turmaId } = useParams<{ turmaId: string }>();
    const navigate = useNavigate();

    const [turma, setTurma] = useState<Turma | null>(null);
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [praticas, setPraticas] = useState<Pratica[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [modalAberto, setModalAberto] = useState(false); 

    useEffect(() => {
        if (!turmaId) return;

        const carregarDados = async () => {
            try {
                setCarregando(true);
                const [dadosTurma, dadosAgendamentos, dadosPraticas] = await Promise.all([
                    buscarTurmaPorId(turmaId),
                    buscarAgendamentosPorTurma(turmaId),
                    buscarPraticas() 
                ]);
                setTurma(dadosTurma);
                setAgendamentos(dadosAgendamentos);
                setPraticas(dadosPraticas);
                setErro(null);
            } catch (err) {
                setErro("Não foi possível carregar os dados da turma.");
            } finally {
                setCarregando(false);
            }
        };

        carregarDados();
    }, [turmaId]);

    const handleSalvarAgendamento = async (dados: Omit<DadosAgendamento, 'turmaId'>) => {
        if (!turmaId) return;
        try {
            await criarAgendamento({ ...dados, turmaId });
            setModalAberto(false);
            const dadosAgendamentos = await buscarAgendamentosPorTurma(turmaId);
            setAgendamentos(dadosAgendamentos);
            alert('Prática agendada com sucesso!');
        } catch (error) {
            alert('Falha ao agendar a prática.');
        }
    };


    if (carregando) return <p>Carregando práticas da turma...</p>;
    if (erro) return <p style={{ color: 'red' }}>{erro}</p>;
    if (!turma) return <p>Turma não encontrada.</p>;

    return (
        <>
            <div className="gp-page-header">
                <div>
                    <button onClick={() => navigate('/minhas-turmas')} className="gp-back-button">
                        <ArrowLeft size={18} /> Voltar para Turmas
                    </button>
                    <h3 className="gp-page-main-title">Práticas Agendadas</h3>
                    <p className="gp-page-subtitle">Turma: {turma.nomeDisciplina} ({turma.codigo})</p>
                </div>
                <button className="action-button" onClick={() => setModalAberto(true)}>
                    <CalendarPlus size={18} /> Agendar Nova Prática
                </button>
            </div>

            <div className="gp-praticas-list">
                {agendamentos.length > 0 ? (
                    agendamentos.map(agendamento => (
                        <div key={agendamento.id} className="gp-pratica-card">
                            <div className="gp-pratica-icon"><ClipboardList size={24} /></div>
                            <div className="gp-pratica-details">
                                <p className="gp-pratica-nome">{agendamento.pratica?.titulo || "Prática Inválida ou Removida"}</p>
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
                                    disabled={!agendamento.pratica?.id} 
                                    onClick={() => {
                                        if (agendamento.pratica?.id) {
                                            navigate(`/praticas/${agendamento.pratica.id}`);
                                        }
                                    }}
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

            {modalAberto && (
                <ModalAgendamento
                    isOpen={modalAberto}
                    turma={turma}
                    praticas={praticas}
                    aoFechar={() => setModalAberto(false)}
                    aoSalvar={handleSalvarAgendamento}
                />
            )}
        </>
    );
};

export default GerenciarPraticas;