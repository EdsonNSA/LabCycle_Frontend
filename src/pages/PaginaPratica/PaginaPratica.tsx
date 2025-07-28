import React from 'react';
import './PaginaPratica.css'; // Criaremos este arquivo a seguir

// Importando os ícones
import {
    LayoutDashboard, FlaskConical, Users, BookCopy, LogOut, Bell, ArrowLeft,
    Clock, BarChart, Video, ShieldAlert, Check, List, Trash2, Clipboard, Printer
} from 'lucide-react';

// --- Dados de Exemplo (Mock Data) ---
const professorInfo = {
    nome: 'Edson Nunes',
    departamento: 'Departamento de Química',
    avatarUrl: 'https://placehold.co/40x40/2a5b4a/FFFFFF?text=E'
};

const praticaInfo = {
    titulo: 'Prática 03: Titulação Ácido-Base',
    disciplina: 'Química Geral',
    turma: '2025.1',
    objetivos: [
        'Compreender o conceito de neutralização.',
        'Determinar a concentração de uma solução desconhecida.',
        'Utilizar corretamente a vidraria de titulação (bureta, pipeta).',
    ],
    duracao: '90 min',
    dificuldade: 'Intermediário',
    videoUrl: 'https://www.youtube.com/embed/SSQIx0cfaHQ',
    seguranca: {
        epis: ['Jaleco', 'Óculos de Segurança', 'Luvas Nitrílicas'],
        cuidados: [
            'Manusear ácidos e bases com cuidado.',
            'Nunca pipetar com a boca.',
            'Descartar resíduos nos locais indicados.'
        ]
    },
    materiais: [
        { nome: 'Bureta de 50 mL', qtd: 1 },
        { nome: 'Erlenmeyer de 250 mL', qtd: 3 },
        { nome: 'Pipeta Volumétrica de 25 mL', qtd: 1 },
        { nome: 'Béquer de 100 mL', qtd: 2 },
        { nome: 'Pêra de sucção', qtd: 1 },
    ],
    reagentes: [
        { nome: 'Solução de HCl ~0.1M (amostra)', qtd: '25 mL' },
        { nome: 'Solução Padrão de NaOH 0.1M', qtd: 'Aprox. 100 mL' },
        { nome: 'Indicador Fenolftaleína', qtd: '3-4 gotas' },
    ],
    procedimento: [
        'Lave e ambiente a bureta com a solução padrão de NaOH 0.1M.',
        'Preencha a bureta com a solução de NaOH, acerte o menisco no zero e anote o volume inicial.',
        'Com a pipeta volumétrica, transfira 25 mL da solução de HCl para um erlenmeyer.',
        'Adicione 3 gotas do indicador fenolftaleína ao erlenmeyer. A solução deve permanecer incolor.',
        'Inicie a titulação, adicionando a solução de NaOH da bureta ao erlenmeyer sob agitação constante.',
        'O ponto final é atingido quando a solução no erlenmeyer adquire uma coloração rosa pálido persistente por 30 segundos.',
        'Anote o volume final da bureta e calcule o volume de NaOH gasto.',
        'Repita o procedimento mais duas vezes para obter resultados em triplicata.'
    ],
    descarte: 'A solução final neutralizada no erlenmeyer pode ser descartada na pia com água corrente. Lave toda a vidraria.'
};

const PaginaPratica: React.FC = () => {
    return (
        <div className="painel-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1 className="logo-text">LabCycle</h1>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li><a href="#" className="nav-link"><LayoutDashboard className="nav-icon" />Painel</a></li>
                        <li><a href="#" className="nav-link"><FlaskConical className="nav-icon" />Inventário</a></li>
                        <li><a href="#" className="nav-link active"><Users className="nav-icon" />Lista de Turmas</a></li>
                        <li><a href="#" className="nav-link"><BookCopy className="nav-icon" />Catálogo</a></li>
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <a href="#" className="nav-link"><LogOut className="nav-icon" />Sair</a>
                </div>
            </aside>

            <div className="main-content">
                <header className="main-header">
                    <div className="breadcrumb">
                        <a href="#"><Users size={16} /> Lista de Turmas</a>
                        <span>/</span>
                        <a href="#">{praticaInfo.disciplina}</a>
                        <span>/</span>
                        <p>{praticaInfo.titulo}</p>
                    </div>
                    <div className="header-user-info">
                        <Bell className="notification-icon" />
                        <div className="user-details">
                            <img src={professorInfo.avatarUrl} alt="Avatar" className="user-avatar" />
                            <div>
                                <p className="user-name">{professorInfo.nome}</p>
                                <p className="user-course">{professorInfo.departamento}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="content-area">
                    <div className="pratica-header">
                        <div>
                            <h2 className="pratica-title">{praticaInfo.titulo}</h2>
                            <div className="pratica-meta">
                                <span><Clock size={16} /> {praticaInfo.duracao}</span>
                                <span><BarChart size={16} /> {praticaInfo.dificuldade}</span>
                            </div>
                        </div>
                        <div className="pratica-actions">
                            <button className="action-button secondary"><Printer size={16} /> Imprimir Roteiro</button>
                        </div>
                    </div>

                    <div className="card overview-card">
                        <div className="overview-text">
                            <h3 className="section-title">Objetivos de Aprendizagem</h3>
                            <ul className="objetivos-list">
                                {praticaInfo.objetivos.map(obj => <li key={obj}><Check size={16} /> {obj}</li>)}
                            </ul>
                        </div>
                        <div className="video-wrapper">
                            <iframe
                                src={praticaInfo.videoUrl}
                                title="Vídeo da Prática"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                    
                    <div className="pratica-grid">
                        <div className="procedimento-coluna">
                            <div className="card">
                                <h3 className="section-title">Procedimento Experimental</h3>
                                <ol className="procedimento-list">
                                    {praticaInfo.procedimento.map((passo, index) => (
                                        <li key={index}>
                                            <div className="passo-numero">{index + 1}</div>
                                            <p>{passo}</p>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            <div className="card">
                                <h3 className="section-title">Anotações e Resultados</h3>
                                <textarea className="anotacoes-textarea" placeholder="Anote aqui suas observações, dados coletados e cálculos..."></textarea>
                            </div>
                        </div>

                        <div className="apoio-coluna">
                            <div className="card seguranca-card">
                                <h3 className="section-title-icon"><ShieldAlert /> Segurança Primeiro!</h3>
                                <h4>EPIs Obrigatórios:</h4>
                                <ul className="apoio-list">
                                    {praticaInfo.seguranca.epis.map(epi => <li key={epi}>{epi}</li>)}
                                </ul>
                                <h4>Cuidados Específicos:</h4>
                                <ul className="apoio-list">
                                    {praticaInfo.seguranca.cuidados.map(cuidado => <li key={cuidado}>{cuidado}</li>)}
                                </ul>
                            </div>
                            <div className="card">
                                <h3 className="section-title-icon"><List /> Materiais e Reagentes</h3>
                                <h4>Vidrarias e Equipamentos:</h4>
                                <ul className="apoio-list">
                                    {praticaInfo.materiais.map(mat => <li key={mat.nome}>{mat.qtd}x - {mat.nome}</li>)}
                                </ul>
                                <h4>Reagentes:</h4>
                                <ul className="apoio-list">
                                    {praticaInfo.reagentes.map(reag => <li key={reag.nome}>{reag.qtd} - {reag.nome}</li>)}
                                </ul>
                            </div>
                            <div className="card descarte-card">
                                <h3 className="section-title-icon"><Trash2 /> Descarte de Resíduos</h3>
                                <p>{praticaInfo.descarte}</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PaginaPratica;