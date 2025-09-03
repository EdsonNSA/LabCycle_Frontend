import React, { useState, useEffect } from 'react';
import './PainelResponsavel.css';
import {
    Bell,
    PlusCircle,
    AlertTriangle,
    CalendarClock,
    Users,
    ClipboardList,
    Edit,
    Trash2,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { buscarReagentes, criarReagente, atualizarReagente, deletarReagente, Reagente } from '../../services/reagenteService';
import { buscarTurmas, criarTurma, Turma, DadosCriacaoTurma } from '../../services/turmaService';
import { buscarAgendamentos, criarAgendamento, atualizarAgendamento, deletarAgendamento, Agendamento, DadosAgendamento } from '../../services/agendamentoService';

const PainelResponsavel: React.FC = () => {
    const [reagentes, setReagentes] = useState<Reagente[]>([]);
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    
    const [modalReagenteAberto, setModalReagenteAberto] = useState(false);
    const [reagenteEmEdicao, setReagenteEmEdicao] = useState<Reagente | null>(null);
    const [modalAgendamentoAberto, setModalAgendamentoAberto] = useState(false);
    const [agendamentoEmEdicao, setAgendamentoEmEdicao] = useState<Agendamento | null>(null);
    const [modalTurmaAberto, setModalTurmaAberto] = useState(false);
    const [mostrarAgendaCompleta, setMostrarAgendaCompleta] = useState(false);

    const userRole = localStorage.getItem('userRole');
    const isManager = userRole === 'ADMIN';

    const carregarDadosIniciais = async () => {
        try {
            setCarregando(true);
            const [dadosReagentes, dadosTurmas, dadosAgendamentos] = await Promise.all([
                buscarReagentes(),
                buscarTurmas(),
                buscarAgendamentos()
            ]);
            setReagentes(dadosReagentes);
            setTurmas(dadosTurmas);
            setAgendamentos(dadosAgendamentos.sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()));
            setErro(null);
        } catch (err) {
            setErro('Não foi possível carregar os dados do painel. Tente novamente mais tarde.');
            console.error(err);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarDadosIniciais();
    }, []);

    const abrirModalParaCriarReagente = () => {
        setReagenteEmEdicao(null);
        setModalReagenteAberto(true);
    };

    const abrirModalParaEditarReagente = (reagente: Reagente) => {
        setReagenteEmEdicao(reagente);
        setModalReagenteAberto(true);
    };

    const fecharModalReagente = () => {
        setModalReagenteAberto(false);
        setReagenteEmEdicao(null);
    };
    
    const abrirModalParaEditarAgendamento = (agendamento: Agendamento) => {
        setAgendamentoEmEdicao(agendamento);
        setModalAgendamentoAberto(true);
    };

    const fecharModalAgendamento = () => {
        setModalAgendamentoAberto(false);
        setAgendamentoEmEdicao(null);
    };

    const handleFormReagenteSubmit = async (dadosDoFormulario: Omit<Reagente, 'id'>) => {
        try {
            if (reagenteEmEdicao && reagenteEmEdicao.id) {
                await atualizarReagente(reagenteEmEdicao.id, dadosDoFormulario);
            } else {
                await criarReagente(dadosDoFormulario);
            }
            fecharModalReagente();
            await carregarDadosIniciais();
        } catch (error) {
            alert("Não foi possível salvar o reagente.");
        }
    };

    const handleDeletarReagente = async (id: string) => {
        if (window.confirm('Tem certeza de que deseja excluir este reagente?')) {
            try {
                await deletarReagente(id);
                setReagentes(reagentes.filter(r => r.id !== id));
            } catch (error) {
                alert("Não foi possível deletar o reagente.");
            }
        }
    };
    
    const handleSalvarAgendamento = async (dados: DadosAgendamento) => {
        try {
            if (agendamentoEmEdicao) {
                await atualizarAgendamento(agendamentoEmEdicao.id, dados);
            } else {
                await criarAgendamento(dados);
            }
            await carregarDadosIniciais();
            fecharModalAgendamento();
            alert(`Prática ${agendamentoEmEdicao ? 'atualizada' : 'agendada'} com sucesso!`);
        } catch (error) {
            alert("Não foi possível salvar o agendamento.");
        }
    };

    const handleDeletarAgendamento = async (id: string) => {
        if (window.confirm('Tem certeza de que deseja excluir este agendamento?')) {
            try {
                await deletarAgendamento(id);
                setAgendamentos(agendamentos.filter(a => a.id !== id));
            } catch (error) {
                alert("Não foi possível deletar o agendamento.");
            }
        }
    };

    const handleSalvarTurma = async (dados: DadosCriacaoTurma) => {
        try {
            const novaTurma = await criarTurma(dados);
            setTurmas([...turmas, novaTurma]);
            setModalTurmaAberto(false);
            alert('Turma criada com sucesso!');
        } catch (error) {
            alert("Não foi possível criar a turma.");
        }
    };

    const baixoEstoqueCount = reagentes.filter(r => r.status === 'BAIXO_ESTOQUE').length;
    const resumoInventario = reagentes.slice(0, 5);
    const agendamentosExibidos = mostrarAgendaCompleta ? agendamentos : agendamentos.slice(0, 3);

    if (carregando) return <p>A carregar dados do painel...</p>;
    if (erro) return <p style={{ color: 'red' }}>{erro}</p>;

    return (
        <>
            <div className="pr-greeting">
                <h3 className="pr-greeting-title">Olá! 👋</h3>
                <p className="pr-greeting-subtitle">Aqui está um resumo das atividades do seu laboratório.</p>
            </div>

            <div className="pr-actions-and-kpis">
                <div className="pr-kpi-cards-grid">
                    <div className="pr-kpi-card">
                        <AlertTriangle className="pr-kpi-icon text-red-500" />
                        <div>
                            <p className="pr-kpi-value">{baixoEstoqueCount}</p>
                            <p className="pr-kpi-label">Reagentes em Baixo Estoque</p>
                        </div>
                    </div>
                    <div className="pr-kpi-card">
                        <CalendarClock className="pr-kpi-icon text-blue-500" />
                        <div>
                            <p className="pr-kpi-value">{agendamentos.length}</p>
                            <p className="pr-kpi-label">Aulas Agendadas</p>
                        </div>
                    </div>
                    <div className="pr-kpi-card">
                        <Users className="pr-kpi-icon text-green-500" />
                        <div>
                            <p className="pr-kpi-value">{turmas.length}</p>
                            <p className="pr-kpi-label">Turmas Ativas</p>
                        </div>
                    </div>
                </div>
                {isManager && (
                     <div className="pr-quick-actions">
                         <button className="pr-action-button" onClick={abrirModalParaCriarReagente}>
                            <PlusCircle size={18} />Adicionar Reagente
                        </button>
                        <button className="pr-action-button" onClick={() => setModalAgendamentoAberto(true)}>
                            <CalendarClock size={18} />Agendar Prática
                        </button>
                        <button className="pr-action-button" onClick={() => setModalTurmaAberto(true)}>
                            <Users size={18} />Criar Turma
                        </button>
                    </div>
                )}
            </div>

            <div className="pr-card pr-inventario-card">
                 <div className="pr-card-header-flex">
                    <h4 className="pr-card-title">Resumo do Inventário</h4>
                    <a href="/gestao-inventario" className="pr-card-link">Ver Inventário Completo →</a>
                </div>
                <table className="pr-inventory-table">
                    <thead>
                        <tr>
                            <th>Reagente</th>
                            <th>Quantidade</th>
                            <th>Status</th>
                            {isManager && <th>Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {resumoInventario.map(item => (
                            <tr key={item.id}>
                                <td>{item.nome}</td>
                                <td>{`${item.quantidade} ${item.unidade}`}</td>
                                <td>
                                    <span className={`pr-status-badge status-${item.status.toLowerCase().replace('_', '-')}`}>
                                        {item.status.replace('_', ' ')}
                                    </span>
                                </td>
                                {isManager && item.id && (
                                    <td className="pr-actions-cell">
                                        <button className="pr-table-action-button" onClick={() => abrirModalParaEditarReagente(item)}>
                                            <Edit size={16} />
                                        </button>
                                        <button className="pr-table-action-button action-delete" onClick={() => item.id && handleDeletarReagente(item.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="pr-card pr-agenda-card">
                <div className="pr-card-header-flex">
                    <h4 className="pr-card-title">Próximas Aulas Práticas</h4>
                    {agendamentos.length > 3 && (
                        <button className="pr-card-link-button" onClick={() => setMostrarAgendaCompleta(!mostrarAgendaCompleta)}>
                           {mostrarAgendaCompleta ? 'Mostrar Menos' : 'Ver Agenda Completa'}
                           {mostrarAgendaCompleta ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    )}
                </div>
                <ul className="pr-agenda-list">
                    {agendamentosExibidos.map(aula => (
                        <li key={aula.id} className="pr-agenda-item">
                            <div className="pr-agenda-icon-wrapper"><ClipboardList size={20} /></div>
                            <div className="pr-agenda-details">
                                <p className="pr-agenda-pratica">{aula.nomePratica}</p>
                                <p className="pr-agenda-disciplina">{aula.nomeDisciplina} - Turma {aula.codigoTurma}</p>
                            </div>
                            <div className="pr-agenda-data">{new Date(aula.dataHora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}h</div>
                             {isManager && (
                                <div className="pr-agenda-actions">
                                    <button className="pr-table-action-button" onClick={() => abrirModalParaEditarAgendamento(aula)}>
                                        <Edit size={16} />
                                    </button>
                                    <button className="pr-table-action-button action-delete" onClick={() => handleDeletarAgendamento(aula.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {modalReagenteAberto && (
                <ModalReagente
                    reagente={reagenteEmEdicao}
                    aoFechar={fecharModalReagente}
                    aoSalvar={handleFormReagenteSubmit}
                />
            )}

            {modalAgendamentoAberto && (
                <ModalAgendamento
                    agendamento={agendamentoEmEdicao}
                    turmas={turmas}
                    aoFechar={fecharModalAgendamento}
                    aoSalvar={handleSalvarAgendamento}
                />
            )}

            {modalTurmaAberto && (
                <ModalNovaTurma
                    aoFechar={() => setModalTurmaAberto(false)}
                    aoSalvar={handleSalvarTurma}
                />
            )}
        </>
    );
};

interface ModalReagenteProps {
    reagente: Reagente | null;
    aoFechar: () => void;
    aoSalvar: (reagente: Omit<Reagente, 'id'>) => void;
}

const ModalReagente: React.FC<ModalReagenteProps> = ({ reagente, aoFechar, aoSalvar }) => {
    const [formData, setFormData] = useState({
        nome: reagente?.nome || '',
        numeroCas: reagente?.numeroCas || '',
        quantidade: reagente?.quantidade || 0,
        unidade: reagente?.unidade || 'mL',
        dataValidade: reagente?.dataValidade || '',
        localizacao: reagente?.localizacao || '',
        status: reagente?.status || 'OK',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'quantidade' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        aoSalvar(formData);
    };

    return (
        <div className="pr-modal-overlay">
            <div className="pr-modal-content">
                <form onSubmit={handleSubmit}>
                    <h2>{reagente ? 'Editar Reagente' : 'Adicionar Novo Reagente'}</h2>
                    
                    <div className="pr-form-group">
                        <label htmlFor="nome">Nome do Reagente</label>
                        <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required />
                    </div>
                    <div className="pr-form-group">
                        <label htmlFor="numeroCas">Número CAS</label>
                        <input type="text" id="numeroCas" name="numeroCas" value={formData.numeroCas} onChange={handleInputChange} required />
                    </div>
                    <div className="pr-form-row">
                        <div className="pr-form-group">
                            <label htmlFor="quantidade">Quantidade</label>
                            <input type="number" step="0.01" id="quantidade" name="quantidade" value={formData.quantidade} onChange={handleInputChange} required />
                        </div>
                        <div className="pr-form-group">
                            <label htmlFor="unidade">Unidade</label>
                            <select id="unidade" name="unidade" value={formData.unidade} onChange={handleInputChange}>
                                <option value="mL">mL</option><option value="L">L</option><option value="g">g</option><option value="kg">kg</option>
                            </select>
                        </div>
                    </div>
                     <div className="pr-form-group">
                        <label htmlFor="dataValidade">Data de Validade</label>
                        <input type="date" id="dataValidade" name="dataValidade" value={formData.dataValidade} onChange={handleInputChange} required />
                    </div>
                    <div className="pr-form-group">
                        <label htmlFor="localizacao">Localização</label>
                        <input type="text" id="localizacao" name="localizacao" value={formData.localizacao} onChange={handleInputChange} required />
                    </div>
                    <div className="pr-form-group">
                        <label htmlFor="status">Status</label>
                        <select id="status" name="status" value={formData.status} onChange={handleInputChange}>
                            <option value="OK">OK</option><option value="BAIXO_ESTOQUE">Baixo Estoque</option><option value="VENCENDO">Vencendo</option><option value="VENCIDO">Vencido</option>
                        </select>
                    </div>
                    <div className="pr-modal-actions">
                        <button type="button" className="pr-button-secondary" onClick={aoFechar}>Cancelar</button>
                        <button type="submit" className="pr-button-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface ModalAgendamentoProps {
    agendamento: Agendamento | null;
    turmas: Turma[];
    aoFechar: () => void;
    aoSalvar: (dados: DadosAgendamento) => void;
}

const ModalAgendamento: React.FC<ModalAgendamentoProps> = ({ agendamento, turmas, aoFechar, aoSalvar }) => {
    const [turmaId, setTurmaId] = useState('');
    const [nomePratica, setNomePratica] = useState('');
    const [dataHora, setDataHora] = useState('');

    useEffect(() => {
        if (agendamento) {
            const turmaAssociada = turmas.find(t => t.codigo === agendamento.codigoTurma && t.nomeDisciplina === agendamento.nomeDisciplina);
            setTurmaId(turmaAssociada?.id || '');
            setNomePratica(agendamento.nomePratica);
            const dataFormatada = new Date(new Date(agendamento.dataHora).getTime() + 3 * 60 * 60 * 1000).toISOString().slice(0, 16);
            setDataHora(dataFormatada);
        }
    }, [agendamento, turmas]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!turmaId || !nomePratica || !dataHora) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        aoSalvar({ turmaId, nomePratica, dataHora });
    };

    return (
        <div className="pr-modal-overlay">
            <div className="pr-modal-content">
                <form onSubmit={handleSubmit}>
                    <h2>{agendamento ? 'Editar Agendamento' : 'Agendar Nova Prática'}</h2>
                    <div className="pr-form-group">
                        <label htmlFor="turmaId">Turma</label>
                        <select id="turmaId" value={turmaId} onChange={(e) => setTurmaId(e.target.value)} required>
                            <option value="" disabled>Selecione uma turma</option>
                            {turmas.map(turma => (
                                <option key={turma.id} value={turma.id}>
                                    {turma.nomeDisciplina} ({turma.codigo})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="pr-form-group">
                        <label htmlFor="nomePratica">Nome da Prática</label>
                        <input type="text" id="nomePratica" value={nomePratica} onChange={(e) => setNomePratica(e.target.value)} required />
                    </div>
                    <div className="pr-form-group">
                        <label htmlFor="dataHora">Data e Hora</label>
                        <input type="datetime-local" id="dataHora" value={dataHora} onChange={(e) => setDataHora(e.target.value)} required />
                    </div>
                    <div className="pr-modal-actions">
                        <button type="button" className="pr-button-secondary" onClick={aoFechar}>Cancelar</button>
                        <button type="submit" className="pr-button-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface ModalNovaTurmaProps {
    aoFechar: () => void;
    aoSalvar: (dados: DadosCriacaoTurma) => void;
}

const ModalNovaTurma: React.FC<ModalNovaTurmaProps> = ({ aoFechar, aoSalvar }) => {
    const [formData, setFormData] = useState<DadosCriacaoTurma>({
        nomeDisciplina: '',
        codigo: '',
        semestre: '',
        numeroAlunos: 0
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'numeroAlunos' ? parseInt(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        aoSalvar(formData);
    };

    return (
        <div className="pr-modal-overlay">
            <div className="pr-modal-content">
                <form onSubmit={handleSubmit}>
                    <h2>Criar Nova Turma</h2>
                    <div className="pr-form-group">
                        <label htmlFor="nomeDisciplina">Nome da Disciplina</label>
                        <input type="text" id="nomeDisciplina" name="nomeDisciplina" value={formData.nomeDisciplina} onChange={handleInputChange} required />
                    </div>
                    <div className="pr-form-group">
                        <label htmlFor="codigo">Código da Turma</label>
                        <input type="text" id="codigo" name="codigo" value={formData.codigo} onChange={handleInputChange} required />
                    </div>
                    <div className="pr-form-row">
                        <div className="pr-form-group">
                            <label htmlFor="semestre">Semestre</label>
                            <input type="text" id="semestre" name="semestre" placeholder="Ex: 2025.1" value={formData.semestre} onChange={handleInputChange} required />
                        </div>
                        <div className="pr-form-group">
                            <label htmlFor="numeroAlunos">Nº de Alunos</label>
                            <input type="number" id="numeroAlunos" name="numeroAlunos" value={formData.numeroAlunos} onChange={handleInputChange} min="0" required />
                        </div>
                    </div>
                    <div className="pr-modal-actions">
                        <button type="button" className="pr-button-secondary" onClick={aoFechar}>Cancelar</button>
                        <button type="submit" className="pr-button-primary">Criar Turma</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PainelResponsavel;