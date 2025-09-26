import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Turma, DadosCriacaoTurma } from '../../services/turmaService';
import './ModalTurma.css';

interface ModalTurmaProps {
    turma: Turma | null;
    aoFechar: () => void;
    aoSalvar: (dados: DadosCriacaoTurma, id?: string) => void;
}

const ModalTurma: React.FC<ModalTurmaProps> = ({ turma, aoFechar, aoSalvar }) => {
    const [formData, setFormData] = useState<DadosCriacaoTurma>({
        nomeDisciplina: '',
        codigo: '',
        semestre: '',
        numeroAlunos: 0
    });

    useEffect(() => {
        if (turma) {
            setFormData({
                nomeDisciplina: turma.nomeDisciplina,
                codigo: turma.codigo,
                semestre: turma.semestre,
                numeroAlunos: turma.numeroAlunos
            });
        } else {
            setFormData({
                nomeDisciplina: '',
                codigo: '',
                semestre: '',
                numeroAlunos: 0
            });
        }
    }, [turma]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'numeroAlunos' ? parseInt(value) || 0 : value 
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        aoSalvar(formData, turma?.id);
    };

    return (
        <div className="modal-overlay" onClick={aoFechar}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h3>{turma ? 'Editar Turma' : 'Criar Nova Turma'}</h3>
                        <button type="button" className="modal-close-button" onClick={aoFechar}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="nomeDisciplina">Nome da Disciplina</label>
                            <input type="text" id="nomeDisciplina" name="nomeDisciplina" value={formData.nomeDisciplina} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="codigo">Código da Turma</label>
                            <input type="text" id="codigo" name="codigo" value={formData.codigo} onChange={handleInputChange} required />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="semestre">Semestre</label>
                                <input type="text" id="semestre" name="semestre" placeholder="Ex: 2025.1" value={formData.semestre} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="numeroAlunos">Nº de Alunos</label>
                                <input type="number" id="numeroAlunos" name="numeroAlunos" value={formData.numeroAlunos} onChange={handleInputChange} min="0" required />
                            </div>
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="button-secondary" onClick={aoFechar}>Cancelar</button>
                        <button type="submit" className="button-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalTurma;