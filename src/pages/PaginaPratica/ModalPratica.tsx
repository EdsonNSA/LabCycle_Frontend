import React, { useState, useEffect } from 'react';
import { Pratica, DadosCadastroPratica } from '../../services/PraticaService';
import { PlusCircle, Trash2, HelpCircle } from 'lucide-react';
import './ModalPratica.css';

interface ModalPraticaProps {
    pratica: Pratica | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (dados: DadosCadastroPratica, id?: string) => void;
}

interface Material {
    nome: string;
    qtd: string;
}
interface Seguranca {
    epis: string[];
    cuidados: string[];
}

const ModalPratica: React.FC<ModalPraticaProps> = ({ pratica, isOpen, onClose, onSave }) => {
    const [titulo, setTitulo] = useState('');
    const [disciplina, setDisciplina] = useState('');
    const [duracao, setDuracao] = useState('');
    const [dificuldade, setDificuldade] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [objetivos, setObjetivos] = useState<string[]>([]);
    const [procedimento, setProcedimento] = useState<string[]>([]);
    const [seguranca, setSeguranca] = useState<Seguranca>({ epis: [], cuidados: [] });
    const [materiais, setMateriais] = useState<Material[]>([]);
    const [reagentes, setReagentes] = useState<Material[]>([]);
    const [descarte, setDescarte] = useState('');
    const [showVideoTip, setShowVideoTip] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (pratica) {
                setTitulo(pratica.titulo);
                setDisciplina(pratica.disciplina);
                setDuracao(pratica.duracao);
                setDificuldade(pratica.dificuldade);
                setVideoUrl(pratica.videoUrl);
                setDescarte(pratica.descarte);
                try { setObjetivos(JSON.parse(pratica.objetivosJson)); } catch { setObjetivos([]); }
                try { setProcedimento(JSON.parse(pratica.procedimentoJson)); } catch { setProcedimento([]); }
                try { setSeguranca(JSON.parse(pratica.segurancaJson)); } catch { setSeguranca({ epis: [], cuidados: [] }); }
                try { setMateriais(JSON.parse(pratica.materiaisJson)); } catch { setMateriais([]); }
                try { setReagentes(JSON.parse(pratica.reagentesJson)); } catch { setReagentes([]); }
            } else {
                setTitulo('');
                setDisciplina('');
                setDuracao('');
                setDificuldade('');
                setVideoUrl('');
                setObjetivos([]);
                setProcedimento([]);
                setSeguranca({ epis: [], cuidados: [] });
                setMateriais([]);
                setReagentes([]);
                setDescarte('');
            }
            setShowVideoTip(false);
        }
    }, [pratica, isOpen]);

    const handleListChange = (list: Material[], setList: React.Dispatch<React.SetStateAction<Material[]>>, index: number, field: keyof Material, value: string) => {
        const newList = [...list];
        newList[index][field] = value;
        setList(newList);
    };
    const addToList = (setList: React.Dispatch<React.SetStateAction<Material[]>>, newItem: Material) => setList((prev) => [...prev, newItem]);
    const removeFromList = (setList: React.Dispatch<React.SetStateAction<Material[]>>, index: number) => setList((prev) => prev.filter((_, i) => i !== index));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dadosParaSalvar: DadosCadastroPratica = {
            titulo, disciplina, duracao, dificuldade, videoUrl, descarte,
            objetivosJson: JSON.stringify(objetivos.filter(item => item.trim() !== '')),
            procedimentoJson: JSON.stringify(procedimento.filter(item => item.trim() !== '')),
            segurancaJson: JSON.stringify({
                epis: seguranca.epis.filter(item => item.trim() !== ''),
                cuidados: seguranca.cuidados.filter(item => item.trim() !== '')
            }),
            materiaisJson: JSON.stringify(materiais.filter(item => item.nome.trim() !== '')),
            reagentesJson: JSON.stringify(reagentes.filter(item => item.nome.trim() !== '')),
        };
        onSave(dadosParaSalvar, pratica?.id);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h2>{pratica ? 'Editar Roteiro de Prática' : 'Criar Novo Roteiro'}</h2>

                    <div className="form-group"><label>Título da Prática</label><input type="text" placeholder="Ex: Titulação Ácido-Base" value={titulo} onChange={e => setTitulo(e.target.value)} required /></div>
                    <div className="form-group"><label>Disciplina</label><input type="text" placeholder="Ex: Química Geral" value={disciplina} onChange={e => setDisciplina(e.target.value)} /></div>
                    <div className="form-group"><label>Duração</label><input type="text" placeholder="Ex: 90 min" value={duracao} onChange={e => setDuracao(e.target.value)} /></div>
                    <div className="form-group"><label>Dificuldade</label><input type="text" placeholder="Ex: Intermediário" value={dificuldade} onChange={e => setDificuldade(e.target.value)} /></div>
                    
                    <div className="form-group form-group-with-tip">
                        <div className="label-with-help">
                            <label htmlFor="videoUrl">URL do Vídeo</label>
                            <button type="button" className="help-button" onClick={() => setShowVideoTip(!showVideoTip)} title="Ajuda sobre o link do vídeo">
                                <HelpCircle size={16} />
                            </button>
                        </div>
                        <input id="videoUrl" type="text" placeholder="Ex: https://www.youtube.com/embed/codigoDoVideo" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
                        {showVideoTip && (
                            <div className="video-tip">
                                <p>No YouTube, clique em <strong>Compartilhar</strong> → <strong>Incorporar</strong> e copie apenas a URL que aparece dentro de <code>src="..."</code>.</p>
                                <p>O link deve ser no formato: <code>https://www.youtube.com/embed/CODIGO_DO_VIDEO</code></p>
                            </div>
                        )}
                    </div>

                    <div className="form-group"><label>Objetivos (um por linha)</label><textarea rows={4} placeholder={"Ex:\nCompreender o conceito de neutralização.\nDeterminar a concentração de uma solução."} value={objetivos.join('\n')} onChange={e => setObjetivos(e.target.value.split('\n'))} /></div>
                    <div className="form-group"><label>Procedimento (um passo por linha)</label><textarea rows={8} placeholder={"Ex:\nLave e ambiente a bureta.\nPreencha a bureta com a solução."} value={procedimento.join('\n')} onChange={e => setProcedimento(e.target.value.split('\n'))} /></div>

                    <div className="form-group"><label>EPIs Obrigatórios (um por linha)</label><textarea rows={3} placeholder={"Ex:\nJaleco\nÓculos de Segurança"} value={seguranca.epis.join('\n')} onChange={e => setSeguranca(s => ({ ...s, epis: e.target.value.split('\n') }))} /></div>
                    <div className="form-group"><label>Cuidados Específicos (um por linha)</label><textarea rows={3} placeholder={"Ex:\nManusear ácidos e bases com cuidado.\nNunca pipetar com a boca."} value={seguranca.cuidados.join('\n')} onChange={e => setSeguranca(s => ({ ...s, cuidados: e.target.value.split('\n') }))} /></div>

                    <div className="form-group">
                        <label>Materiais</label>
                        {materiais.map((item, index) => (
                            <div key={index} className="dynamic-list-item">
                                <input type="text" placeholder="Nome do material" value={item.nome} onChange={e => handleListChange(materiais, setMateriais, index, 'nome', e.target.value)} />
                                <input type="text" placeholder="Qtd." value={item.qtd} onChange={e => handleListChange(materiais, setMateriais, index, 'qtd', e.target.value)} style={{ flexGrow: 0, width: '80px' }} />
                                <button type="button" className="remove-button" onClick={() => removeFromList(setMateriais, index)} title="Remover Material"><Trash2 size={16} /></button>
                            </div>
                        ))}
                        <button type="button" className="add-button" onClick={() => addToList(setMateriais, { nome: '', qtd: '' })}><PlusCircle size={16} /> Adicionar Material</button>
                    </div>

                    <div className="form-group">
                        <label>Reagentes</label>
                        {reagentes.map((item, index) => (
                             <div key={index} className="dynamic-list-item">
                                <input type="text" placeholder="Nome do reagente" value={item.nome} onChange={e => handleListChange(reagentes, setReagentes, index, 'nome', e.target.value)} />
                                <input type="text" placeholder="Qtd." value={item.qtd} onChange={e => handleListChange(reagentes, setReagentes, index, 'qtd', e.target.value)} style={{ flexGrow: 0, width: '80px' }} />
                                <button type="button" className="remove-button" onClick={() => removeFromList(setReagentes, index)} title="Remover Reagente"><Trash2 size={16} /></button>
                            </div>
                        ))}
                        <button type="button" className="add-button" onClick={() => addToList(setReagentes, { nome: '', qtd: '' })}><PlusCircle size={16} /> Adicionar Reagente</button>
                    </div>

                    <div className="form-group"><label>Descarte</label><textarea rows={3} placeholder="Ex: A solução final pode ser descartada na pia com água corrente." value={descarte} onChange={e => setDescarte(e.target.value)} /></div>
                    
                    <div className="modal-actions">
                        <button type="button" className="button-secondary" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="button-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalPratica;