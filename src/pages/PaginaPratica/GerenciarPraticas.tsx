import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buscarAgendamentosPorTurma, criarAgendamento, Agendamento, DadosAgendamento } from '../../services/agendamentoService';
import { buscarTurmaPorId, Turma } from '../../services/turmaService';
import { buscarPraticas, Pratica } from '../../services/PraticaService';
import './GerenciarPraticas.css';
import { CalendarPlus, ClipboardList, ArrowLeft, X } from 'lucide-react';

const toArray = (data: any): data is any[] => Array.isArray(data);

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
                                onChange={(e) => setDataHora(e.target.value)} 
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
    const userEmail = localStorage.getItem('userEmail');
    const isDemoMode = userEmail === 'admin@email.com';

    useEffect(() => {
        if (!turmaId) return;

        const carregarDados = async () => {
            try {
                setCarregando(true);
                let dadosTurma: Turma | null;
                let dadosAgendamentos: Agendamento[];
                let dadosPraticas: Pratica[];

                if (isDemoMode) {
                    const turmasLocais = toArray(JSON.parse(localStorage.getItem('demoTurmas') || '[]')) ? JSON.parse(localStorage.getItem('demoTurmas') || '[]') : [];
                    dadosTurma = turmasLocais.find((t: Turma) => t.id === turmaId) || null;

                    const agendamentosLocais = toArray(JSON.parse(localStorage.getItem('demoAgendamentos') || '[]')) ? JSON.parse(localStorage.getItem('demoAgendamentos') || '[]') : [];
                    dadosAgendamentos = agendamentosLocais.filter((a: Agendamento) => a.turmaCodigo === dadosTurma?.codigo);

                    dadosPraticas = toArray(JSON.parse(localStorage.getItem('demoPraticas') || '[]')) ? JSON.parse(localStorage.getItem('demoPraticas') || '[]') : [];

                } else {
                    const [apiTurma, apiAgendamentos, apiPraticas] = await Promise.all([
                        buscarTurmaPorId(turmaId),
                        buscarAgendamentosPorTurma(turmaId),
                        buscarPraticas() 
                    ]);
                    dadosTurma = apiTurma;
                    dadosAgendamentos = toArray(apiAgendamentos) ? apiAgendamentos : [];
                    dadosPraticas = toArray(apiPraticas) ? apiPraticas : [];
                }
                
                setTurma(dadosTurma);
                setAgendamentos(dadosAgendamentos);
                setPraticas(dadosPraticas);
                setErro(null);

                if (!dadosTurma) {
                    setErro("Turma não encontrada.");
                }

            } catch (err) {
                setErro("Não foi possível carregar os dados da turma.");
            } finally {
                setCarregando(false);
            }
        };

        carregarDados();
    }, [turmaId]);

    const handleSalvarAgendamento = async (dados: Omit<DadosAgendamento, 'turmaId'>) => {
        if (!turmaId || !turma) return;

        if (isDemoMode) {
            const agendamentosAtuais = toArray(JSON.parse(localStorage.getItem('demoAgendamentos') || '[]')) ? JSON.parse(localStorage.getItem('demoAgendamentos') || '[]') : [];
            const praticaSelecionada = praticas.find(p => p.id === dados.praticaId);

            const novoAgendamento: Agendamento = {
                id: `temp_${Date.now()}`,
                dataHora: dados.dataHora,
                turmaCodigo: turma.codigo,
                disciplinaNome: turma.nomeDisciplina,
                pratica: {
                    id: praticaSelecionada?.id || '',
                    titulo: praticaSelecionada?.titulo || 'Prática não encontrada'
                }
            };
            
            const agendamentosAtualizados = [...agendamentosAtuais, novoAgendamento];
            localStorage.setItem('demoAgendamentos', JSON.stringify(agendamentosAtualizados));
            setAgendamentos([...agendamentos, novoAgendamento]);
            setModalAberto(false);
            alert('Demonstração: Prática agendada!');
            return;
        }

        try {
            const novoAgendamento = await criarAgendamento({ ...dados, turmaId });
            setAgendamentos(prevAgendamentos => [...prevAgendamentos, novoAgendamento]);
            setModalAberto(false);
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
                                    disabled={!agendamento.pratica?.id || String(agendamento.pratica.id).startsWith('temp_')} 
                                    title={String(agendamento.pratica.id).startsWith('temp_') ? "Não é possível ver detalhes de práticas criadas no Modo Demo" : "Ver detalhes da prática"}
                                    onClick={() => {
                                        if (agendamento.pratica?.id && !String(agendamento.pratica.id).startsWith('temp_')) {
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