import React, { useState } from 'react';
import './CatalogoKits.css';
import {
    Search, ChevronDown, Package, Info, ShoppingCart
} from 'lucide-react';
import ModalOrcamento from './ModalOrcamento';
import ModalDetalhes from './ModalDetalhes';

interface Kit {
    id: number;
    moduloTematico: string;
    objetivoPedagogico: string;
    itensInclusos: string[];
    publicoAlvo: string;
    imgUrl: string;
    descricaoDetalhada: string;
}

const kitsData: Kit[] = [
    {
        id: 1,
        moduloTematico: 'Ciclo de Vida dos Reagentes',
        objetivoPedagogico: 'Visualizar a trajetória dos reagentes e refletir sobre os impactos ambientais de cada etapa.',
        itensInclusos: ['Cards com etapas ilustradas', 'Mini frascos com etiquetas simuladas', 'Painel interativo "Mapa do Ciclo"'],
        publicoAlvo: 'Kit Universitário',
        imgUrl: 'https://placehold.co/600x400/a7f3d0/2a5b4a?text=Ciclo+de+Vida',
        descricaoDetalhada: `
            <p>Este kit foi desenhado para proporcionar uma imersão completa no ciclo de vida de um reagente químico, desde sua fabricação até o descarte final. É uma ferramenta essencial para estudantes universitários de Química, Engenharia e áreas ambientais.</p>
            <p><strong>Como funciona:</strong> Através de um mapa interativo e cards ilustrados, os participantes seguem a jornada de um reagente, identificando os insumos necessários para sua produção, os processos de transporte, as formas de uso seguro em laboratório e, crucialmente, as diferentes rotas de descarte e tratamento de resíduos. O objetivo é desenvolver uma consciência crítica sobre a responsabilidade ambiental do cientista.</p>
            <p><strong>Ideal para:</strong> Aulas de gestão de resíduos, química ambiental, segurança em laboratório e projetos de extensão focados em sustentabilidade.</p>
        `
    },
    {
        id: 2,
        moduloTematico: 'Boas Práticas em Laboratório',
        objetivoPedagogico: 'Refletir sobre práticas seguras e sustentáveis no ambiente laboratorial de forma interativa.',
        itensInclusos: ['Cartas-desafio de situações', 'Painel dobrável com checklist', 'Simulador com mini EPIs'],
        publicoAlvo: 'Kit Escolar',
        imgUrl: 'https://placehold.co/600x400/a7f3d0/2a5b4a?text=Boas+Práticas',
        descricaoDetalhada: `
            <p>A segurança é o pilar de qualquer atividade científica. Este kit gamificado transforma o aprendizado sobre Boas Práticas Laboratoriais (BPL) em uma atividade dinâmica e memorável para estudantes do ensino médio e técnico.</p>
            <p><strong>Como funciona:</strong> Os participantes recebem "cartas-desafio" que apresentam cenários comuns em laboratórios (ex: derramamento de reagente, uso incorreto de equipamento). Utilizando o checklist de boas práticas e os mini Equipamentos de Proteção Individual (EPIs), eles devem discutir e encontrar a solução mais segura. É uma forma lúdica de fixar procedimentos que salvam vidas e evitam acidentes.</p>
            <p><strong>Ideal para:</strong> Feiras de ciências, aulas introdutórias de laboratório e programas de conscientização sobre segurança para jovens cientistas.</p>
        `
    },
    {
        id: 3,
        moduloTematico: 'Gestão e Descarte de Resíduos',
        objetivoPedagogico: 'Aprender a classificar diferentes tipos de resíduos e aplicar as diretrizes corretas de descarte.',
        itensInclusos: ['Mini lixeiras sinalizadas', 'Cartelas de resíduos ilustradas', 'Fluxograma de descarte'],
        publicoAlvo: 'Kit Oficina/Extensão',
        imgUrl: 'https://placehold.co/600x400/a7f3d0/2a5b4a?text=Gestão+de+Resíduos',
        descricaoDetalhada: `
            <p>O que fazer com o que sobra? Este kit prático é uma ferramenta poderosa para ensinar o correto gerenciamento de resíduos em qualquer ambiente que gere lixo químico, biológico ou perfurocortante, como laboratórios, oficinas e estúdios.</p>
            <p><strong>Como funciona:</strong> Os participantes recebem cartelas com ilustrações de diversos tipos de resíduos e devem classificá-los, depositando-os nas mini lixeiras sinalizadas conforme as normas técnicas (ABNT NBR 10004). O fluxograma de descarte serve como um guia de consulta rápida, ajudando a solidificar o conhecimento sobre cada classe de resíduo e seu destino correto.</p>
            <p><strong>Ideal para:</strong> Treinamentos de equipes, oficinas de sustentabilidade e como material didático para cursos técnicos e de graduação.</p>
        `
    },
    {
        id: 4,
        moduloTematico: 'Reuso e Economia Circular',
        objetivoPedagogico: 'Estimular a criatividade e o pensamento crítico para o reaproveitamento seguro de materiais.',
        itensInclusos: ['Cartões com propostas de reuso', 'Diário do cientista sustentável', 'Materiais para experimento fictício'],
        publicoAlvo: 'Kit Universitário',
        imgUrl: 'https://placehold.co/600x400/a7f3d0/2a5b4a?text=Economia+Circular',
        descricaoDetalhada: `
            <p>Este kit desafia o modelo linear de "usar e descartar", introduzindo os conceitos de economia circular de forma criativa e aplicada. O foco é inspirar estudantes a enxergarem resíduos como recursos e a desenvolverem soluções inovadoras.</p>
            <p><strong>Como funciona:</strong> Os participantes recebem cartões com desafios, como "Proponha um método seguro para reutilizar frascos de solventes" ou "Crie um novo produto a partir de plásticos laboratoriais descartados". Com o auxílio do "Diário do Cientista Sustentável" para registrar suas ideias e os materiais fictícios para prototipagem, eles são estimulados a pensar fora da caixa, sempre considerando a segurança e a viabilidade técnica.</p>
            <p><strong>Ideal para:</strong> Workshops de inovação, disciplinas de empreendedorismo científico e projetos que conectam a universidade com desafios da indústria sustentável.</p>
        `
    }
];


const CatalogoKits: React.FC = () => {
    const [kits] = useState(kitsData);
    const [termoBusca, setTermoBusca] = useState('');

    const [modalOrcamentoAberto, setModalOrcamentoAberto] = useState(false);
    const [kitSelecionado, setKitSelecionado] = useState<Kit | null>(null);

    const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);

    const handleAbrirModalOrcamento = (kit: Kit) => {
        setKitSelecionado(kit);
        setModalOrcamentoAberto(true);
    };
    const handleFecharModalOrcamento = () => {
        setModalOrcamentoAberto(false);
    };
    
    const handleAbrirModalDetalhes = (kit: Kit) => {
        setKitSelecionado(kit);
        setModalDetalhesAberto(true);
    };
    const handleFecharModalDetalhes = () => {
        setModalDetalhesAberto(false);
    };

    const kitsFiltrados = kits.filter(kit => 
        kit.moduloTematico.toLowerCase().includes(termoBusca.toLowerCase())
    );

    return (
        <>
            <div className="ck-catalogo-header">
                <div className="ck-search-wrapper">
                    <Search className="ck-search-icon" />
                    <input 
                        type="text" 
                        placeholder="Buscar por módulo ou tema..." 
                        className="ck-search-input"
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                    />
                </div>
                <div className="ck-filters-wrapper">
                    <button className="ck-filter-button">
                        Formato do Kit <ChevronDown size={16} />
                    </button>
                </div>
            </div>

            <div className="ck-kits-grid">
                {kitsFiltrados.map(kit => (
                    <div key={kit.id} className="ck-kit-card">
                        <div className="ck-kit-image-wrapper">
                            <img src={kit.imgUrl} alt={kit.moduloTematico} className="ck-kit-image" />
                            <span className={`ck-kit-audience-badge audience-${kit.publicoAlvo.split(' ')[0].toLowerCase().replace('/', '\\/')}`}>
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
                                <button 
                                    className="ck-kit-button secondary"
                                    onClick={() => handleAbrirModalDetalhes(kit)}
                                >
                                    <Info size={16} />
                                    Saber Mais
                                </button>
                                <button 
                                    className="ck-kit-button primary"
                                    onClick={() => handleAbrirModalOrcamento(kit)}
                                >
                                    <ShoppingCart size={16} />
                                    Solicitar Orçamento
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ModalOrcamento 
                isOpen={modalOrcamentoAberto}
                onClose={handleFecharModalOrcamento}
                kit={kitSelecionado}
            />

            <ModalDetalhes
                isOpen={modalDetalhesAberto}
                onClose={handleFecharModalDetalhes}
                kit={kitSelecionado}
            />
        </>
    );
};

export default CatalogoKits;