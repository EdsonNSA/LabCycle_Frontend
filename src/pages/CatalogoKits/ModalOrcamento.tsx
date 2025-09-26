import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './ModalOrcamento.css'; 

interface Kit {
    id: number;
    moduloTematico: string;
}

interface ModalOrcamentoProps {
    isOpen: boolean;
    onClose: () => void;
    kit: Kit | null;
}

const ModalOrcamento: React.FC<ModalOrcamentoProps> = ({ isOpen, onClose, kit }) => {
    const [formData, setFormData] = useState({
        nome: '',
        contato: '',
        email: '',
        descricao: '',
        quantidade: 1,
    });

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                nome: '',
                contato: '',
                email: '',
                descricao: '',
                quantidade: 1,
            });
        }
    }, [isOpen]);
    
    if (!isOpen || !kit) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'number' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        
        const dadosOrcamento = {
            kitId: kit.id,
            kitNome: kit.moduloTematico,
            ...formData,
        };

        console.log("Solicitação de Orçamento Enviada:", dadosOrcamento);
        alert(`Obrigado, ${formData.nome}! Sua solicitação para ${formData.quantidade} kit(s) de "${kit.moduloTematico}" foi enviada.`);
        
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="mo-close-button" aria-label="Fechar modal">
                    <X size={24} />
                </button>
                
                <h3>Solicitar Orçamento</h3>
                <p className="mo-kit-name">Kit: <strong>{kit.moduloTematico}</strong></p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nome">Nome</label>
                        <input id="nome" type="text" value={formData.nome} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contato">Contato (Telefone/WhatsApp)</label>
                        <input id="contato" type="text" value={formData.contato} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input id="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantidade">Quantos kits você precisa?</label>
                        <input id="quantidade" type="number" min="1" value={formData.quantidade} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="descricao">Especificações (Opcional)</label>
                        <textarea id="descricao" value={formData.descricao} onChange={handleChange} rows={4} placeholder="Alguma observação ou pergunta?"></textarea>
                    </div>

                    <div className="modal-actions">
                         <button type="button" className="button-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="button-primary">
                            Enviar Solicitação
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalOrcamento;