import React from 'react';
import './CatalogoKits.css';
import {
    LayoutDashboard, FlaskConical, Users, BookCopy, LogOut, Bell, Search, ChevronDown,
    Recycle, Beaker, Shield, Package, Info, ShoppingCart
} from 'lucide-react';

const professorInfo = {
    nome: 'Edson Nunes',
    departamento: 'Departamento de Química',
    avatarUrl: 'https://placehold.co/40x40/2a5b4a/FFFFFF?text=E'
};

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
        <div className="painel-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1 className="logo-text">LabCycle</h1>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li><a href="#" className="nav-link"><LayoutDashboard className="nav-icon" />Painel Principal</a></li>
                        <li><a href="#" className="nav-link"><FlaskConical className="nav-icon" />Inventário</a></li>
                        <li><a href="#" className="nav-link"><Users className="nav-icon" />Minhas Turmas</a></li>
                        <li><a href="#" className="nav-link active"><BookCopy className="nav-icon" />Catálogo de Kits</a></li>
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <a href="#" className="nav-link"><LogOut className="nav-icon" />Sair</a>
                </div>
            </aside>

            <div className="main-content">
                <header className="main-header">
                    <div>
                        <h2 className="header-title">Kits Educacionais</h2>
                    </div>
                    <div className="header-user-info">
                        <Bell className="notification-icon" />
                        <div className="user-details">
                            <img src={professorInfo.avatarUrl} alt="Avatar do professor" className="user-avatar" />
                            <div>
                                <p className="user-name">{professorInfo.nome}</p>
                                <p className="user-course">{professorInfo.departamento}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="content-area">
                    <div className="catalogo-header">
                        <div className="search-wrapper">
                            <Search className="search-icon" />
                            <input type="text" placeholder="Buscar por módulo ou tema..." className="search-input" />
                        </div>
                        <div className="filters-wrapper">
                            <button className="filter-button">
                                Formato do Kit <ChevronDown size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="kits-grid">
                        {kitsData.map(kit => (
                            <div key={kit.id} className="kit-card">
                                <div className="kit-image-wrapper">
                                    <img src={kit.imgUrl} alt={kit.moduloTematico} className="kit-image" />
                                    <span className={`kit-audience-badge audience-${kit.publicoAlvo.split(' ')[0].toLowerCase()}`}>
                                        {kit.publicoAlvo}
                                    </span>
                                </div>
                                <div className="kit-content">
                                    <h3 className="kit-title">{kit.moduloTematico}</h3>
                                    <p className="kit-description">{kit.objetivoPedagogico}</p>
                                    
                                    <div className="kit-items-section">
                                        <h4 className="kit-items-title">Itens Inclusos:</h4>
                                        <ul className="kit-items-list">
                                            {kit.itensInclusos.map(item => (
                                                <li key={item}><Package size={14} /> {item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="kit-footer">
                                        <button className="kit-button secondary">
                                            <Info size={16} />
                                            Saber Mais
                                        </button>
                                        <button className="kit-button primary">
                                            <ShoppingCart size={16} />
                                            Solicitar Orçamento
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CatalogoKits;