import React, { useState } from 'react';
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
    const [nome, setNome] = useState('');
    const [contato, setContato] = useState('');
    const [email, setEmail] = useState('');
    const [descricao, setDescricao] = useState('');
    const [quantidade, setQuantidade] = useState(1);

    if (!isOpen || !kit) return null;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        
        const dadosOrcamento = {
            kitId: kit.id,
            kitNome: kit.moduloTematico,
            nome,
            contato,
            email,
            descricao,
            quantidade,
        };

        console.log("Solicitação de Orçamento Enviada:", dadosOrcamento);
        alert(`Obrigado, ${nome}! Sua solicitação para ${quantidade} kit(s) de "${kit.moduloTematico}" foi enviada.`);
        
        onClose();
    };

    return (
        <div className="mo-modal-overlay">
            <div className="mo-modal-content">
                <button onClick={onClose} className="mo-close-button">
                    <X size={24} />
                </button>
                
                <h2 className="mo-modal-title">Solicitar Orçamento</h2>
                <p className="mo-kit-name">Kit: <strong>{kit.moduloTematico}</strong></p>

                <form onSubmit={handleSubmit} className="mo-form">
                    <div className="mo-form-group">
                        <label htmlFor="nome">Nome</label>
                        <input id="nome" type="text" value={nome} onChange={e => setNome(e.target.value)} required />
                    </div>
                    <div className="mo-form-group">
                        <label htmlFor="contato">Contato</label>
                        <input id="contato" type="text" value={contato} onChange={e => setContato(e.target.value)} required />
                    </div>
                    <div className="mo-form-group">
                        <label htmlFor="email">E-mail</label>
                        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="mo-form-group">
                        <label htmlFor="quantidade">Quantos kits você precisa?</label>
                        <input id="quantidade" type="number" min="1" value={quantidade} onChange={e => setQuantidade(parseInt(e.target.value))} required />
                    </div>
                    <div className="mo-form-group">
                        <label htmlFor="descricao">Especificações</label>
                        <textarea id="descricao" value={descricao} onChange={e => setDescricao(e.target.value)} rows={4}></textarea>
                    </div>

                    <button type="submit" className="mo-submit-button">
                        Enviar Solicitação
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ModalOrcamento;