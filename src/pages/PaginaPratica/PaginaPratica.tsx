import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import './PaginaPratica.css';
import { Clock, BarChart, Check, List, Trash2, ShieldAlert, Printer, Edit, Save, MessageSquare, Send, Wrench, FlaskConical } from 'lucide-react';
import { buscarPraticaPorId, Pratica, atualizarPratica} from '../../services/PraticaService';
import { buscarComentarios, criarComentario, Comentario } from '../../services/comentarioService';

interface Seguranca {
    epis: string[];
    cuidados: string[];
}
interface Material {
    nome: string;
    qtd: number | string;
}
interface ProcedimentoItem {
    tipo: 'titulo' | 'subtitulo' | 'passo';
    texto: string;
}

const SecaoSeguranca: React.FC<{ seguranca: Seguranca }> = ({ seguranca }) => {
    const groupedCuidados = useMemo(() => {
        const groups: { heading: string; items: string[] }[] = [];
        (seguranca.cuidados || []).forEach(cuidado => {
            if (/^\d+\.\s/.test(cuidado)) {
                groups.push({ heading: cuidado, items: [] });
            } else if (groups.length > 0) {
                groups[groups.length - 1].items.push(cuidado);
            }
        });
        return groups;
    }, [seguranca.cuidados]);

    return (
        <>
            <h4>EPIs Obrigatórios:</h4>
            <ul className="pp-apoio-list">
                {(seguranca.epis || []).map(e => <li key={e}>{e}</li>)}
            </ul>
            <h4 className="pp-seguranca-subtitulo">Cuidados Específicos:</h4>
            {groupedCuidados.map((group, index) => (
                <div key={index} className="pp-cuidado-group">
                    {group.heading && <p className="pp-cuidado-titulo">{group.heading}</p>}
                    <ul className="pp-apoio-list">
                        {group.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </>
    );
};

const PaginaPratica: React.FC = () => {
    const { praticaId } = useParams<{ praticaId: string }>();
    const [pratica, setPratica] = useState<Pratica | null>(null);
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<Pratica>>({});
    const [novoComentario, setNovoComentario] = useState('');

    const userEmail = localStorage.getItem('userEmail');
    const isDemoMode = userEmail === 'admin@email.com';
    const userRole = localStorage.getItem('userRole');
    const isManager = userRole === 'ADMIN';

    useEffect(() => {
        if (!praticaId) return;

        const carregarDados = async () => {
            try {
                setCarregando(true);
                let dadosPratica: Pratica | null = null;
                let dadosComentarios: Comentario[] = [];

                if (isDemoMode) {
                    const praticasLocais = JSON.parse(localStorage.getItem('demoPraticas') || '[]');
                    dadosPratica = praticasLocais.find((p: Pratica) => p.id === praticaId) || null;
                    
                    const comentariosStorageKey = `demoComentarios_${praticaId}`;
                    dadosComentarios = JSON.parse(localStorage.getItem(comentariosStorageKey) || '[]');
                    
                    if (!dadosPratica) {
                        dadosPratica = await buscarPraticaPorId(praticaId);
                    }
                } else {
                    const [apiPratica, apiComentarios] = await Promise.all([
                        buscarPraticaPorId(praticaId),
                        buscarComentarios(praticaId)
                    ]);
                    dadosPratica = apiPratica;
                    dadosComentarios = apiComentarios;
                }

                setPratica(dadosPratica);
                setFormData(dadosPratica || {});
                setComentarios(dadosComentarios);
                setErro(null);

                if (!dadosPratica) {
                    setErro("Prática não encontrada.");
                }

            } catch (err) {
                setErro("Não foi possível carregar os dados. Verifique a URL e tente novamente.");
            } finally {
                setCarregando(false);
            }
        };
        carregarDados();
    }, [praticaId, isDemoMode]);

    const handleFormChange = (field: keyof Pratica, value: string) => { setFormData(prev => ({ ...prev, [field]: value })); };
    
    const handleSave = async () => {
        if (!praticaId) return;
        if (isDemoMode) {
            const praticasLocais = JSON.parse(localStorage.getItem('demoPraticas') || '[]');
            const praticasAtualizadas = praticasLocais.map((p: Pratica) => p.id === praticaId ? { ...p, ...formData } as Pratica : p);
            localStorage.setItem('demoPraticas', JSON.stringify(praticasAtualizadas));
            setPratica(praticasAtualizadas.find((p: Pratica) => p.id === praticaId) || null);
            setIsEditing(false);
            alert('Demonstração: Alterações salvas no localStorage!');
            return;
        }
        try {
            const praticaAtualizada = await atualizarPratica(praticaId, formData);
            setPratica(praticaAtualizada);
            setIsEditing(false);
        } catch (error) {
            alert("Erro ao salvar as alterações.");
        }
    };
    
    const handlePostComment = async () => {
        if (!praticaId || !novoComentario.trim()) return;
        if (isDemoMode) {
            const comentariosStorageKey = `demoComentarios_${praticaId}`;
            const comentariosAtuais = JSON.parse(localStorage.getItem(comentariosStorageKey) || '[]');
            const comentarioAdicionado: Comentario = {
                id: `temp_comm_${Date.now()}`,
                conteudo: novoComentario,
                nomeAutor: 'Usuário Demo',
                dataCriacao: new Date().toISOString()
            };
            const comentariosAtualizados = [comentarioAdicionado, ...comentariosAtuais];
            localStorage.setItem(comentariosStorageKey, JSON.stringify(comentariosAtualizados));
            setComentarios(comentariosAtualizados);
            setNovoComentario('');
            alert('Demonstração: Comentário salvo no localStorage!');
            return;
        }
        try {
            const comentarioAdicionado = await criarComentario(praticaId, { conteudo: novoComentario });
            setComentarios([comentarioAdicionado, ...comentarios]);
            setNovoComentario('');
        } catch (error) {
            alert("Erro ao postar o comentário.");
        }
    };

    const handlePrint = () => window.print();

    if (carregando) return <div className="loading-message">Carregando roteiro da prática...</div>;
    if (erro) return <div className="error-message">{erro}</div>;
    if (!pratica) return <div className="loading-message">Prática não encontrada.</div>;

    const parseJson = (jsonString: string, fallback: any) => {
        if (!jsonString) return fallback;
        try { const parsed = JSON.parse(jsonString); return parsed; } catch { return fallback; }
    };

    const objetivos: string[] = parseJson(pratica.objetivosJson, []);
    const seguranca: Seguranca = parseJson(pratica.segurancaJson, { epis: [], cuidados: [] });
    const materiais: Material[] = parseJson(pratica.materiaisJson, []);
    const reagentes: Material[] = parseJson(pratica.reagentesJson, []);
    const procedimento: ProcedimentoItem[] = parseJson(pratica.procedimentoJson, []);
    const descarte: string[] = parseJson(pratica.descarteJson, []);
    let passoCounter = 1;

    return (
        <div className="printable-area">
            <div className="pp-pratica-header">
                <div>
                    {isEditing ? <input type="text" value={formData.titulo || ''} onChange={e => handleFormChange('titulo', e.target.value)} className="pp-edit-input-title" /> : <h2 className="pp-pratica-title">{pratica.titulo}</h2>}
                    <div className="pp-pratica-meta">
                        {isEditing ? (
                            <>
                                <input type="text" value={formData.duracao || ''} onChange={e => handleFormChange('duracao', e.target.value)} className="pp-edit-input-meta" placeholder="Duração" />
                                <input type="text" value={formData.dificuldade || ''} onChange={e => handleFormChange('dificuldade', e.target.value)} className="pp-edit-input-meta" placeholder="Dificuldade" />
                            </>
                        ) : (
                            <>
                                <span><Clock size={16} /> {pratica.duracao}</span>
                                <span><BarChart size={16} /> {pratica.dificuldade}</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="pp-pratica-actions">
                    {isManager && (isEditing ? <button className="action-button primary" onClick={handleSave}><Save size={16} /> Salvar</button> : <button className="action-button" onClick={() => setIsEditing(true)}><Edit size={16} /> Editar</button>)}
                    <button className="action-button secondary" onClick={handlePrint}><Printer size={16} /> Imprimir</button>
                </div>
            </div>

            <div className="pp-card pp-overview-card">
                <div className="pp-overview-text">
                    <h3 className="pp-section-title">Objetivos</h3>
                    {isEditing ? <textarea value={formData.objetivosJson ? parseJson(formData.objetivosJson, []).join('\n') : ''} onChange={e => handleFormChange('objetivosJson', JSON.stringify(e.target.value.split('\n')))} className="pp-edit-textarea" rows={5}></textarea> :
                        <div className="pp-objetivos-list">
                            {objetivos.map(obj => <div key={obj} className="pp-objetivo-item"><Check size={16} /> <span>{obj}</span></div>)}
                        </div>
                    }
                </div>
                <div className="pp-video-wrapper">
                    {isEditing ? <input type="text" value={formData.videoUrl || ''} onChange={e => handleFormChange('videoUrl', e.target.value)} placeholder="URL do vídeo (embed)" className="pp-edit-input" /> :
                        pratica.videoUrl && <iframe src={pratica.videoUrl} title="Vídeo da Prática" allowFullScreen></iframe>}
                </div>
            </div>
            
            <div className="pp-pratica-grid">
                <div className="pp-procedimento-coluna">
                    <div className="pp-card">
                        <h3 className="pp-section-title">Procedimento Experimental</h3>
                        {isEditing ? (
                            <>
                                <label className="pp-edit-label">Procedimento (JSON Estruturado)</label>
                                <textarea
                                    value={formData.procedimentoJson || ''}
                                    onChange={e => handleFormChange('procedimentoJson', e.target.value)}
                                    className="pp-edit-textarea"
                                    rows={20}
                                ></textarea>
                            </>
                        ) : (
                            <div className="pp-procedimento-container">
                                {procedimento.map((item, index) => {
                                    if (item.tipo === 'titulo') {
                                        return <h4 key={index} className="pp-procedimento-titulo">{item.texto}</h4>;
                                    }
                                    if (item.tipo === 'subtitulo') {
                                        return <p key={index} className="pp-procedimento-subtitulo">• {item.texto}</p>;
                                    }
                                    if (item.tipo === 'passo') {
                                        const numeroDoPasso = passoCounter++;
                                        return (
                                            <div key={index} className="pp-procedimento-passo">
                                                <div className="pp-passo-numero">{numeroDoPasso}</div>
                                                <p>{item.texto}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="pp-apoio-coluna">
                    <div className="pp-card pp-seguranca-card">
                        <h3 className="pp-section-title-icon"><ShieldAlert /> Segurança</h3>
                        {isEditing ? (
                             <>
                                <label className="pp-edit-label">Segurança (JSON)</label>
                                <textarea defaultValue={formData.segurancaJson} onChange={e => handleFormChange('segurancaJson', e.target.value)} className="pp-edit-textarea" rows={8}></textarea>
                            </>
                        ) : <SecaoSeguranca seguranca={seguranca} />
                        }
                    </div>

                    <div className="pp-card">
                        <h3 className="pp-section-title-icon"><List /> Materiais e Reagentes</h3>
                        {isEditing ? (
                            <>
                                <label className="pp-edit-label">Materiais (JSON)</label>
                                <textarea defaultValue={formData.materiaisJson} onChange={e => handleFormChange('materiaisJson', e.target.value)} className="pp-edit-textarea" rows={8}></textarea>
                                <label className="pp-edit-label">Reagentes (JSON)</label>
                                <textarea defaultValue={formData.reagentesJson} onChange={e => handleFormChange('reagentesJson', e.target.value)} className="pp-edit-textarea" rows={8}></textarea>
                            </>
                        ) : (
                        <>
                            <h4>Vidrarias e Equipamentos:</h4>
                            <div className="pp-lista-vertical-tags">
                                {materiais.map(mat => (
                                    <div key={mat.nome} className="pp-tag-item">
                                        <Wrench size={16} /><span className="pp-tag-qtd">{mat.qtd}x</span><span>{mat.nome}</span>
                                    </div>
                                ))}
                            </div>
                            <h4 style={{marginTop: '1rem'}}>Reagentes:</h4>
                            <div className="pp-lista-vertical-tags">
                                {reagentes.map(reag => (
                                    <div key={reag.nome} className="pp-tag-item reagente">
                                        <FlaskConical size={16} /><span className="pp-tag-qtd">{reag.qtd}</span><span>{reag.nome}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                        )}
                    </div>

                    <div className="pp-card pp-descarte-card">
                        <h3 className="pp-section-title-icon"><Trash2 /> Descarte de Resíduos</h3>
                        {isEditing ? (
                            <>
                                <label className="pp-edit-label">Descarte (um item por linha)</label>
                                <textarea value={formData.descarteJson ? parseJson(formData.descarteJson, []).join('\n') : ''} onChange={e => handleFormChange('descarteJson', JSON.stringify(e.target.value.split('\n')))} className="pp-edit-textarea" rows={4}></textarea>
                            </>
                        ) : (
                            <ul className="pp-apoio-list">
                                {descarte.map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <div className="pp-card pp-comments-section">
                <h3 className="pp-section-title-icon"><MessageSquare /> Anotações e Resultados</h3>
                <div className="pp-comment-input-area">
                    <textarea className="pp-comment-textarea" placeholder="Adicione sua anotação..." value={novoComentario} onChange={e => setNovoComentario(e.target.value)}></textarea>
                    <button className="action-button" onClick={handlePostComment}><Send size={16} /> Publicar</button>
                </div>
                <div className="pp-comments-list">
                    {comentarios.map(c => <div key={c.id} className="pp-comment-item"><p className="pp-comment-content">{c.conteudo}</p><p className="pp-comment-meta">por <strong>{c.nomeAutor}</strong> em {new Date(c.dataCriacao).toLocaleString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}</p></div>)}
                </div>
            </div>
        </div>
    );
};

export default PaginaPratica;