import React from 'react';
import { X, Package } from 'lucide-react';
import './ModalDetalhes.css';

interface Kit {
    id: number;
    moduloTematico: string;
    publicoAlvo: string;
    itensInclusos: string[];
    descricaoDetalhada: string;
    imgUrl: string;
}

interface ModalDetalhesProps {
    isOpen: boolean;
    onClose: () => void;
    kit: Kit | null;
}

const ModalDetalhes: React.FC<ModalDetalhesProps> = ({ isOpen, onClose, kit }) => {
    if (!isOpen || !kit) return null;

    return (
        <div className="md-modal-overlay" onClick={onClose}>
            <div className="md-modal-content" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="md-close-button">
                    <X size={24} />
                </button>
                
                <img src={kit.imgUrl} alt={kit.moduloTematico} className="md-kit-image" />

                <div className="md-kit-header">
                    <h2 className="md-modal-title">{kit.moduloTematico}</h2>
                    <span className="md-kit-audience">{kit.publicoAlvo}</span>
                </div>

                <div className="md-kit-body">
                    <div 
                        className="md-kit-description"
                        dangerouslySetInnerHTML={{ __html: kit.descricaoDetalhada }}
                    />

                    <div className="md-kit-items-section">
                        <h4 className="md-kit-items-title">Itens Inclusos:</h4>
                        <ul className="md-kit-items-list">
                            {kit.itensInclusos.map(item => (
                                <li key={item}><Package size={16} /> {item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalDetalhes;