import React from 'react';
import './PainelAluno.css';
import { 
    CalendarCheck, 
    Calendar, 
    MapPin, 
    FileText, 
    CheckCircle, 
    ShieldCheck, 
    Beaker, 
    BookOpen 
} from 'lucide-react';

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
        <>
            <div className="pa-greeting">
                <h3 className="pa-greeting-title">Olá! 👋</h3>
                <p className="pa-greeting-subtitle">Bem-vindo(a) de volta. Vamos continuar aprendendo!</p>
            </div>

            <div className="pa-main-grid">
                <div className="pa-main-column">
                    <div className="pa-card pa-proxima-aula-card">
                        <div className="pa-card-header">
                            <CalendarCheck />
                            <h4>Sua Próxima Aula Prática</h4>
                        </div>
                        <h3 className="pa-proxima-aula-title">{proximaAulaInfo.pratica}</h3>
                        <p className="pa-proxima-aula-disciplina">Disciplina: {proximaAulaInfo.disciplina}</p>
                        <div className="pa-proxima-aula-details">
                            <span><Calendar size={16} />{proximaAulaInfo.data}</span>
                            <span><MapPin size={16} />{proximaAulaInfo.local}</span>
                        </div>
                        <button className="pa-cta-button">
                            Acessar Roteiro e Materiais
                        </button>
                    </div>

                    <div className="pa-card pa-progresso-card">
                        <h4 className="pa-card-title">Progresso em {progressoCurso.nome}</h4>
                        <div className="pa-progress-bar-info">
                            <span>Progresso Geral</span>
                            <span className="pa-progress-percentage">{progressoCurso.progresso}%</span>
                        </div>
                        <div className="pa-progress-bar-container">
                            <div className="pa-progress-bar-fill" style={{ width: `${progressoCurso.progresso}%` }}></div>
                        </div>
                        <div className="pa-progresso-stats">
                            <div><p>{progressoCurso.praticasTotal}</p><span>Práticas no Total</span></div>
                            <div><p className="text-green-600">{progressoCurso.concluidas}</p><span>Concluídas</span></div>
                            <div><p className="text-yellow-600">{progressoCurso.pendentes}</p><span>Pendentes</span></div>
                            <div><p>{progressoCurso.media}</p><span>Média Parcial</span></div>
                        </div>
                    </div>
                </div>

                <div className="pa-sidebar-column">
                    <div className="pa-card pa-notificacoes-card">
                        <h4 className="pa-card-title">Notificações Recentes</h4>
                        <ul>
                            <li>
                                <div className="pa-notification-icon-wrapper bg-blue-100 text-blue-600"><FileText size={16} /></div>
                                <div>
                                    <p>Lembrete: Relatório da Prática 02 vence amanhã.</p>
                                    <span>Há 1 dia</span>
                                </div>
                            </li>
                            <li>
                                <div className="pa-notification-icon-wrapper bg-green-100 text-green-600"><CheckCircle size={16} /></div>
                                <div>
                                    <p>Sua nota da Prática 01 foi lançada: 9.0</p>
                                    <span>Há 3 dias</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="pa-card pa-biblioteca-card">
                        <h4 className="pa-card-title">Biblioteca de Recursos</h4>
                        <ul>
                            <li><a href="#"><ShieldCheck size={16} />Guia de Segurança</a></li>
                            <li><a href="#"><Beaker size={16} />Técnicas de Pipetagem</a></li>
                            <li><a href="#"><BookOpen size={16} />Glossário de Termos</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PainelAluno;