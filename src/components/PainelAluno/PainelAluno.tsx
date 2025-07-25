import React from 'react';
import './PainelAluno.css';

import { 
    LayoutDashboard, 
    Users, 
    GraduationCap, 
    BookCopy, 
    LogOut, 
    Bell, 
    CalendarCheck, 
    Calendar, 
    MapPin, 
    FileText, 
    CheckCircle, 
    ShieldCheck, 
    Beaker, 
    BookOpen 
} from 'lucide-react';

const alunoInfo = {
    nome: 'Emilly Audryn',
    curso: 'Engenharia Química',
    avatarUrl: 'https://placehold.co/40x40/7fbf7f/FFFFFF?text=E'
};

const proximaAulaInfo = {
    pratica: 'Prática 03: Titulação Ácido-Base',
    disciplina: 'Química Geral',
    data: '22 de Julho',
    local: 'Lab 101'
};

const progressoCurso = {
    nome: 'Química Geral',
    progresso: 60,
    praticasTotal: 10,
    concluidas: 6,
    pendentes: 4,
    media: 8.5
};

const PainelAluno: React.FC = () => {
    return (
        <div className="painel-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1 className="logo-text">LabCycle</h1>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <a href="#" className="nav-link active">
                                <LayoutDashboard className="nav-icon" />
                                Painel Principal
                            </a>
                        </li>
                        <li>
                            <a href="#" className="nav-link">
                                <Users className="nav-icon" />
                                Minhas Turmas
                            </a>
                        </li>
                        <li>
                            <a href="#" className="nav-link">
                                <GraduationCap className="nav-icon" />
                                Minhas Notas
                            </a>
                        </li>
                        <li>
                            <a href="#" className="nav-link">
                                <BookCopy className="nav-icon" />
                                Biblioteca
                            </a>
                        </li>
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <a href="#" className="nav-link">
                        <LogOut className="nav-icon" />
                        Sair
                    </a>
                </div>
            </aside>

            <div className="main-content">
                <header className="main-header">
                    <div>
                        <h2 className="header-title">Painel do Aluno</h2>
                    </div>
                    <div className="header-user-info">
                        <Bell className="notification-icon" />
                        <div className="user-details">
                            <img src={alunoInfo.avatarUrl} alt="Avatar do aluno" className="user-avatar" />
                            <div>
                                <p className="user-name">{alunoInfo.nome}</p>
                                <p className="user-course">{alunoInfo.curso}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="content-area">
                    <div className="greeting">
                        <h3 className="greeting-title">Olá, {alunoInfo.nome.split(' ')[0]}! 👋</h3>
                        <p className="greeting-subtitle">Bem-vinda de volta. Vamos continuar aprendendo!</p>
                    </div>

                    <div className="main-grid">
                        <div className="main-column">
                            <div className="card proxima-aula-card">
                                <div className="card-header">
                                    <CalendarCheck />
                                    <h4>Sua Próxima Aula Prática</h4>
                                </div>
                                <h3 className="proxima-aula-title">{proximaAulaInfo.pratica}</h3>
                                <p className="proxima-aula-disciplina">Disciplina: {proximaAulaInfo.disciplina}</p>
                                <div className="proxima-aula-details">
                                    <span><Calendar size={16} />{proximaAulaInfo.data}</span>
                                    <span><MapPin size={16} />{proximaAulaInfo.local}</span>
                                </div>
                                <button className="cta-button">
                                    Acessar Roteiro e Materiais
                                </button>
                            </div>

                            <div className="card progresso-card">
                                <h4 className="card-title">Progresso em {progressoCurso.nome}</h4>
                                <div className="progress-bar-info">
                                    <span>Progresso Geral</span>
                                    <span className="progress-percentage">{progressoCurso.progresso}%</span>
                                </div>
                                <div className="progress-bar-container">
                                    <div className="progress-bar-fill" style={{ width: `${progressoCurso.progresso}%` }}></div>
                                </div>
                                <div className="progresso-stats">
                                    <div><p>{progressoCurso.praticasTotal}</p><span>Práticas no Total</span></div>
                                    <div><p className="text-green-600">{progressoCurso.concluidas}</p><span>Concluídas</span></div>
                                    <div><p className="text-yellow-600">{progressoCurso.pendentes}</p><span>Pendentes</span></div>
                                    <div><p>{progressoCurso.media}</p><span>Média Parcial</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-column">
                            <div className="card notificacoes-card">
                                <h4 className="card-title">Notificações Recentes</h4>
                                <ul>
                                    <li>
                                        <div className="notification-icon-wrapper bg-blue-100 text-blue-600"><FileText size={16} /></div>
                                        <div>
                                            <p>Lembrete: Relatório da Prática 02 vence amanhã.</p>
                                            <span>Há 1 dia</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="notification-icon-wrapper bg-green-100 text-green-600"><CheckCircle size={16} /></div>
                                        <div>
                                            <p>Sua nota da Prática 01 foi lançada: 9.0</p>
                                            <span>Há 3 dias</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="card biblioteca-card">
                                <h4 className="card-title">Biblioteca de Recursos</h4>
                                <ul>
                                    <li><a href="#"><ShieldCheck size={16} />Guia de Segurança</a></li>
                                    <li><a href="#"><Beaker size={16} />Técnicas de Pipetagem</a></li>
                                    <li><a href="#"><BookOpen size={16} />Glossário de Termos</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PainelAluno;