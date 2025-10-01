import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PaginaPratica.css';
import { Clock, BarChart, Check, List, Trash2, ShieldAlert, Printer, Edit, Save, MessageSquare, Send
} from 'lucide-react';
import { buscarPraticaPorId, Pratica, atualizarPratica } from '../../services/PraticaService';
import { buscarComentarios, criarComentario, Comentario } from '../../services/comentarioService';

const toArray = (data: any): data is any[] => Array.isArray(data);

interface Seguranca { epis: string[]; cuidados: string[]; }
interface Material { nome: string; qtd: number | string; }

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
                    const praticasLocais = toArray(JSON.parse(localStorage.getItem('demoPraticas') || '[]')) ? JSON.parse(localStorage.getItem('demoPraticas') || '[]') : [];
                    dadosPratica = praticasLocais.find((p: Pratica) => p.id === praticaId) || null;
                    
                    const comentariosStorageKey = `demoComentarios_${praticaId}`;
                    const comentariosLocais = toArray(JSON.parse(localStorage.getItem(comentariosStorageKey) || '[]')) ? JSON.parse(localStorage.getItem(comentariosStorageKey) || '[]') : [];
                    dadosComentarios = comentariosLocais;
                    
                    if (!dadosPratica) {
                        dadosPratica = await buscarPraticaPorId(praticaId);
                    }
                    if (dadosComentarios.length === 0) {
                        const comentariosApi = await buscarComentarios(praticaId);
                        dadosComentarios = toArray(comentariosApi) ? comentariosApi : [];
                        localStorage.setItem(comentariosStorageKey, JSON.stringify(dadosComentarios));
                    }

                } else {
                    const [apiPratica, apiComentarios] = await Promise.all([
                        buscarPraticaPorId(praticaId),
                        buscarComentarios(praticaId)
                    ]);
                    dadosPratica = apiPratica;
                    dadosComentarios = toArray(apiComentarios) ? apiComentarios : [];
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

    const handleFormChange = (field: keyof Pratica, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!praticaId) return;

        if (isDemoMode) {
            const praticasLocais = toArray(JSON.parse(localStorage.getItem('demoPraticas') || '[]')) ? JSON.parse(localStorage.getItem('demoPraticas') || '[]') : [];
            const praticasAtualizadas = praticasLocais.map((p: Pratica) => 
                p.id === praticaId ? { ...p, ...formData } as Pratica : p
            );
            localStorage.setItem('demoPraticas', JSON.stringify(praticasAtualizadas));
            setPratica(praticasAtualizadas.find((p: Pratica) => p.id === praticaId) || null);
            setIsEditing(false);
            alert('Demonstração: Alterações salvas!');
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
            const comentariosAtuais = toArray(JSON.parse(localStorage.getItem(comentariosStorageKey) || '[]')) ? JSON.parse(localStorage.getItem(comentariosStorageKey) || '[]') : [];
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
            alert('Demonstração: Comentário salvo!');
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
        try { return JSON.parse(jsonString); } catch { return fallback; }
    };
    const objetivos: string[] = parseJson(pratica.objetivosJson, []);
    const procedimento: string[] = parseJson(pratica.procedimentoJson, []);
    const seguranca: Seguranca = parseJson(pratica.segurancaJson, { epis: [], cuidados: [] });
    const materiais: Material[] = parseJson(pratica.materiaisJson, []);
    const reagentes: Material[] = parseJson(pratica.reagentesJson, []);

    return (
        <div className="printable-area">
            <div className="pp-pratica-header">
                <div>
                    {isEditing ? <input type="text" value={formData.titulo || ''} onChange={e => handleFormChange('titulo', e.target.value)} className="pp-edit-input-title" /> : <h2 className="pp-pratica-title">{pratica.titulo}</h2>}
                    <div className="pp-pratica-meta">
                        {isEditing ? (
                            <>
                                <input type="text" value={formData.duracao || ''} onChange={e => handleFormChange('duracao', e.target.value)} className="pp-edit-input-meta" />
                                <input type="text" value={formData.dificuldade || ''} onChange={e => handleFormChange('dificuldade', e.target.value)} className="pp-edit-input-meta" />
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
                    {isEditing ? <textarea value={formData.objetivosJson ? JSON.parse(formData.objetivosJson).join('\n') : ''} onChange={e => handleFormChange('objetivosJson', JSON.stringify(e.target.value.split('\n')))} className="pp-edit-textarea" rows={5}></textarea> : 
                        <ul className="pp-objetivos-list">{objetivos.map((obj: string) => <li key={obj}><Check size={16} /> {obj}</li>)}</ul>}
                </div>
                <div className="pp-video-wrapper">
                    {isEditing ? <input type="text" value={formData.videoUrl || ''} onChange={e => handleFormChange('videoUrl', e.target.value)} placeholder="URL do vídeo (embed)" className="pp-edit-input" /> : 
                        pratica.videoUrl && <iframe src={pratica.videoUrl} title="Vídeo da Prática" allowFullScreen></iframe>}
                </div>
            </div>
            
            <div className="pp-pratica-grid">
                <div className="pp-procedimento-coluna">
                    <div className="pp-card">
                        <h3 className="pp-section-title">Procedimento</h3>
                        {isEditing ? <textarea value={formData.procedimentoJson ? JSON.parse(formData.procedimentoJson).join('\n') : ''} onChange={e => handleFormChange('procedimentoJson', JSON.stringify(e.target.value.split('\n')))} className="pp-edit-textarea" rows={15}></textarea> : 
                            (
                                <ol className="pp-procedimento-list">
                                    {procedimento.map((p: string, i: number) => (
                                        <li key={i}>
                                            <div className="pp-passo-numero">{i + 1}</div>
                                            <p>{p}</p>
                                        </li>
                                    ))}
                                </ol>
                            )
                        }
                    </div>
                </div>
                <div className="pp-apoio-coluna">
                   
                    <div className="pp-card pp-seguranca-card">
                         <h3 className="pp-section-title-icon"><ShieldAlert /> Segurança</h3>
                         {isEditing ? <textarea placeholder="Edite EPIs e Cuidados como JSON" defaultValue={formData.segurancaJson} onChange={e => handleFormChange('segurancaJson', e.target.value)} className="pp-edit-textarea" rows={8}></textarea> :
                         <>
                             <h4>EPIs:</h4>
                             <ul className="pp-apoio-list">{seguranca.epis.map((e: string) => <li key={e}>{e}</li>)}</ul>
                             <h4>Cuidados:</h4>
                             <ul className="pp-apoio-list">{seguranca.cuidados.map((c: string) => <li key={c}>{c}</li>)}</ul>
                         </>}
                    </div>
                    <div className="pp-card">
                        <h3 className="pp-section-title-icon"><List /> Materiais e Reagentes</h3>
                        {isEditing ? (
                            <>
                                <label className="pp-edit-label">Materiais (JSON)</label>
                                <textarea 
                                    placeholder='Edite a lista de materiais em formato JSON. Ex: [{"nome": "Béquer", "qtd": 2}]'
                                    value={formData.materiaisJson || ''} 
                                    onChange={e => handleFormChange('materiaisJson', e.target.value)} 
                                    className="pp-edit-textarea" 
                                    rows={6}
                                ></textarea>
                                
                                <label className="pp-edit-label">Reagentes (JSON)</label>
                                <textarea 
                                    placeholder='Edite a lista de reagentes em formato JSON. Ex: [{"nome": "HCl", "qtd": "10 mL"}]'
                                    value={formData.reagentesJson || ''} 
                                    onChange={e => handleFormChange('reagentesJson', e.target.value)} 
                                    className="pp-edit-textarea" 
                                    rows={6}
                                ></textarea>
                            </>
                        ) : (
                            <>
                                <h4>Vidrarias e Equipamentos:</h4>
                                <ul className="pp-apoio-list">
                                    {materiais.map((mat: Material) => <li key={mat.nome}>{mat.qtd}x - {mat.nome}</li>)}
                                </ul>
                                <h4>Reagentes:</h4>
                                <ul className="pp-apoio-list">
                                    {reagentes.map((reag: Material) => <li key={reag.nome}>{reag.qtd} - {reag.nome}</li>)}
                                </ul>
                            </>
                        )}
                    </div>
                    <div className="pp-card pp-descarte-card">
                        <h3 className="pp-section-title-icon"><Trash2 /> Descarte de Resíduos</h3>
                        {isEditing ? (
                            <textarea 
                                value={formData.descarte || ''} 
                                onChange={e => handleFormChange('descarte', e.target.value)} 
                                className="pp-edit-textarea" 
                                rows={4}
                            ></textarea>
                        ) : (
                            <p>{pratica.descarte}</p>
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
                    {comentarios.map((c: Comentario) => <div key={c.id} className="pp-comment-item"><p className="pp-comment-content">{c.conteudo}</p><p className="pp-comment-meta">por <strong>{c.nomeAutor}</strong> em {new Date(c.dataCriacao).toLocaleString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}</p></div>)}
                </div>
            </div>
        </div>
    );
};

export default PaginaPratica;