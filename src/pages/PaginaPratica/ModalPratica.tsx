import React, { useState, useEffect } from 'react';
import { Pratica, DadosCadastroPratica } from '../../services/PraticaService';
import './ModalPratica.css';

interface ModalPraticaProps {
    pratica: Pratica | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (dados: DadosCadastroPratica, id?: string) => void;
}

const arrayToText = (jsonString: string = '[]'): string => {
    try {
        const parsed = JSON.parse(jsonString);
        return Array.isArray(parsed) ? parsed.join('\n') : '';
    } catch {
        return '';
    }
};

const textToArrayJson = (text: string): string => {
    return JSON.stringify(text.split('\n').filter(line => line.trim() !== ''));
};

const ModalPratica: React.FC<ModalPraticaProps> = ({ pratica, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<DadosCadastroPratica>>({});
    
    useEffect(() => {
        if (isOpen) {
            if (pratica) {
                setFormData(pratica);
            } else {
                setFormData({
                    titulo: '',
                    disciplina: '',
                    duracao: '',
                    dificuldade: '',
                    videoUrl: '',
                    objetivosJson: '[]',
                    procedimentoJson: '[]',
                    segurancaJson: '{"epis":[],"cuidados":[]}',
                    materiaisJson: '[]',
                    reagentesJson: '[]',
                    descarte: ''
                });
            }
        }
    }, [pratica, isOpen]);

    const handleChange = (field: keyof DadosCadastroPratica, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as DadosCadastroPratica, pratica?.id);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h2>{pratica ? 'Editar Roteiro de Prática' : 'Criar Novo Roteiro'}</h2>

                    <div className="form-group">
                        <label>Título da Prática</label>
                        <input type="text" value={formData.titulo || ''} onChange={e => handleChange('titulo', e.target.value)} required />
                    </div>
                    
                    <div className="form-group">
                        <label>Disciplina</label>
                        <input type="text" value={formData.disciplina || ''} onChange={e => handleChange('disciplina', e.target.value)} />
                    </div>
                    
                    <div className="form-group">
                        <label>Duração</label>
                        <input type="text" value={formData.duracao || ''} onChange={e => handleChange('duracao', e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Dificuldade</label>
                        <input type="text" value={formData.dificuldade || ''} onChange={e => handleChange('dificuldade', e.target.value)} />
                    </div>
                    
                    <div className="form-group">
                        <label>URL do Vídeo (Embed)</label>
                        <input type="text" value={formData.videoUrl || ''} onChange={e => handleChange('videoUrl', e.target.value)} />
                    </div>
                    
                    <div className="form-group">
                        <label>Objetivos (um por linha)</label>
                        <textarea rows={4} value={arrayToText(formData.objetivosJson)} onChange={e => handleChange('objetivosJson', textToArrayJson(e.target.value))} />
                    </div>
                    
                    <div className="form-group">
                        <label>Procedimento (um passo por linha)</label>
                        <textarea rows={8} value={arrayToText(formData.procedimentoJson)} onChange={e => handleChange('procedimentoJson', textToArrayJson(e.target.value))} />
                    </div>

                    <div className="form-group">
                        <label>Segurança (JSON)</label>
                        <textarea rows={5} value={formData.segurancaJson || ''} onChange={e => handleChange('segurancaJson', e.target.value)} />
                        <small>Formato: {'{"epis":["Jaleco"],"cuidados":["Manusear com cuidado"]}'}</small>
                    </div>

                    <div className="form-group">
                        <label>Materiais (JSON)</label>
                        <textarea rows={5} value={formData.materiaisJson || ''} onChange={e => handleChange('materiaisJson', e.target.value)} />
                        <small>Formato: {'[{"nome":"Béquer","qtd":1}]'}</small>
                    </div>

                     <div className="form-group">
                        <label>Reagentes (JSON)</label>
                        <textarea rows={5} value={formData.reagentesJson || ''} onChange={e => handleChange('reagentesJson', e.target.value)} />

                        <small>Formato: {'[{"nome":"HCl","qtd":"10 mL"}]'}</small>
                    </div>

                    <div className="form-group">
                        <label>Descarte</label>
                        <textarea rows={3} value={formData.descarte || ''} onChange={e => handleChange('descarte', e.target.value)} />
                    </div>

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