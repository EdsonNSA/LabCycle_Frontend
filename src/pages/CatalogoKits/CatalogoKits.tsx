import React from 'react';
import './CatalogoKits.css';
import {
    Search, ChevronDown, Package, Info, ShoppingCart
} from 'lucide-react';

const kitsData = [
    {
        id: 1,
        moduloTematico: 'Ciclo de Vida dos Reagentes',
        objetivoPedagogico: 'Visualizar a trajetória dos reagentes e refletir sobre os impactos ambientais de cada etapa.',
        itensInclusos: ['Cards com etapas ilustradas', 'Mini frascos com etiquetas simuladas', 'Painel interativo "Mapa do Ciclo"'],
        publicoAlvo: 'Kit Universitário',
        imgUrl: 'https://placehold.co/600x400/a7f3d0/2a5b4a?text=Ciclo+de+Vida'
    },
    {
        id: 2,
        moduloTematico: 'Boas Práticas em Laboratório',
        objetivoPedagogico: 'Refletir sobre práticas seguras e sustentáveis no ambiente laboratorial de forma interativa.',
        itensInclusos: ['Cartas-desafio de situações', 'Painel dobrável com checklist', 'Simulador com mini EPIs'],
        publicoAlvo: 'Kit Escolar',
        imgUrl: 'https://placehold.co/600x400/a7f3d0/2a5b4a?text=Boas+Práticas'
    },
    {
        id: 3,
        moduloTematico: 'Gestão e Descarte de Resíduos',
        objetivoPedagogico: 'Aprender a classificar diferentes tipos de resíduos e aplicar as diretrizes corretas de descarte.',
        itensInclusos: ['Mini lixeiras sinalizadas', 'Cartelas de resíduos ilustradas', 'Fluxograma de descarte'],
        publicoAlvo: 'Kit Oficina/Extensão',
        imgUrl: 'https://placehold.co/600x400/a7f3d0/2a5b4a?text=Gestão+de+Resíduos'
    },
    {
        id: 4,
        moduloTematico: 'Reuso e Economia Circular',
        objetivoPedagogico: 'Estimular a criatividade e o pensamento crítico para o reaproveitamento seguro de materiais.',
        itensInclusos: ['Cartões com propostas de reuso', 'Diário do cientista sustentável', 'Materiais para experimento fictício'],
        publicoAlvo: 'Kit Universitário',
        imgUrl: 'https://placehold.co/600x400/a7f3d0/2a5b4a?text=Economia+Circular'
    },
];

const CatalogoKits: React.FC = () => {
    return (
        <>
            <div className="ck-catalogo-header">
                <div className="ck-search-wrapper">
                    <Search className="ck-search-icon" />
                    <input type="text" placeholder="Buscar por módulo ou tema..." className="ck-search-input" />
                </div>
                <div className="ck-filters-wrapper">
                    <button className="ck-filter-button">
                        Formato do Kit <ChevronDown size={16} />
                    </button>
                </div>
            </div>

            <div className="ck-kits-grid">
                {kitsData.map(kit => (
                    <div key={kit.id} className="ck-kit-card">
                        <div className="ck-kit-image-wrapper">
                            <img src={kit.imgUrl} alt={kit.moduloTematico} className="ck-kit-image" />
                            <span className={`ck-kit-audience-badge audience-${kit.publicoAlvo.split(' ')[0].toLowerCase()}`}>
                                {kit.publicoAlvo}
                            </span>
                        </div>
                        <div className="ck-kit-content">
                            <h3 className="ck-kit-title">{kit.moduloTematico}</h3>
                            <p className="ck-kit-description">{kit.objetivoPedagogico}</p>
                            
                            <div className="ck-kit-items-section">
                                <h4 className="ck-kit-items-title">Itens Inclusos:</h4>
                                <ul className="ck-kit-items-list">
                                    {kit.itensInclusos.map(item => (
                                        <li key={item}><Package size={14} /> {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="ck-kit-footer">
                                <button className="ck-kit-button secondary">
                                    <Info size={16} />
                                    Saber Mais
                                </button>
                                <button className="ck-kit-button primary">
                                    <ShoppingCart size={16} />
                                    Solicitar Orçamento
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default CatalogoKits;