import React from 'react';
import './PaginaPratica.css';
import {
    Users, Clock, BarChart, Check, List, Trash2, ShieldAlert, Printer
} from 'lucide-react';

const praticaInfo = {
    titulo: 'Prática 03: Titulação Ácido-Base',
    disciplina: 'Química Geral',
    objetivos: [
        'Compreender o conceito de neutralização.',
        'Determinar a concentração de uma solução desconhecida.',
        'Utilizar corretamente a vidraria de titulação (bureta, pipeta).',
    ],
    duracao: '90 min',
    dificuldade: 'Intermediário',
    videoUrl: 'https://www.youtube.com/embed/WMV0-3BZWrw',
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
    ],
    reagentes: [
        { nome: 'Solução de HCl ~0.1M (amostra)', qtd: '25 mL' },
        { nome: 'Solução Padrão de NaOH 0.1M', qtd: 'Aprox. 100 mL' },
        { nome: 'Indicador Fenolftaleína', qtd: '3-4 gotas' },
    ],
    procedimento: [
        'Lave e ambiente a bureta com a solução padrão de NaOH 0.1M.',
        'Preencha a bureta com a solução de NaOH e acerte o menisco no zero.',
        'Com a pipeta volumétrica, transfira 25 mL da solução de HCl para um erlenmeyer.',
        'Adicione 3 gotas do indicador fenolftaleína ao erlenmeyer.',
        'Inicie a titulação, adicionando a solução de NaOH sob agitação constante.',
        'O ponto final é atingido quando a solução adquire uma coloração rosa pálido persistente.',
        'Anote o volume final da bureta e calcule o volume gasto.',
        'Repita o procedimento mais duas vezes para obter resultados em triplicata.'
    ],
    descarte: 'A solução final neutralizada no erlenmeyer pode ser descartada na pia com água corrente.'
};

const PaginaPratica: React.FC = () => {
    return (
        <>
            <div className="pp-pratica-header">
                <div>
                    <h2 className="pp-pratica-title">{praticaInfo.titulo}</h2>
                    <div className="pp-pratica-meta">
                        <span><Clock size={16} /> {praticaInfo.duracao}</span>
                        <span><BarChart size={16} /> {praticaInfo.dificuldade}</span>
                    </div>
                </div>
                <div className="pp-pratica-actions">
                    <button className="action-button secondary"><Printer size={16} /> Imprimir Roteiro</button>
                </div>
            </div>

            <div className="pp-card pp-overview-card">
                <div className="pp-overview-text">
                    <h3 className="pp-section-title">Objetivos de Aprendizagem</h3>
                    <ul className="pp-objetivos-list">
                        {praticaInfo.objetivos.map(obj => <li key={obj}><Check size={16} /> {obj}</li>)}
                    </ul>
                </div>
                <div className="pp-video-wrapper">
                    <iframe
                        src={praticaInfo.videoUrl}
                        title="Vídeo da Prática"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
            
            <div className="pp-pratica-grid">
                <div className="pp-procedimento-coluna">
                    <div className="pp-card">
                        <h3 className="pp-section-title">Procedimento Experimental</h3>
                        <ol className="pp-procedimento-list">
                            {praticaInfo.procedimento.map((passo, index) => (
                                <li key={index}>
                                    <div className="pp-passo-numero">{index + 1}</div>
                                    <p>{passo}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div className="pp-card">
                        <h3 className="pp-section-title">Anotações e Resultados</h3>
                        <textarea className="pp-anotacoes-textarea" placeholder="Anote aqui suas observações, dados coletados e cálculos..."></textarea>
                    </div>
                </div>

                <div className="pp-apoio-coluna">
                    <div className="pp-card pp-seguranca-card">
                        <h3 className="pp-section-title-icon"><ShieldAlert /> Segurança Primeiro!</h3>
                        <h4>EPIs Obrigatórios:</h4>
                        <ul className="pp-apoio-list">
                            {praticaInfo.seguranca.epis.map(epi => <li key={epi}>{epi}</li>)}
                        </ul>
                        <h4>Cuidados Específicos:</h4>
                        <ul className="pp-apoio-list">
                            {praticaInfo.seguranca.cuidados.map(cuidado => <li key={cuidado}>{cuidado}</li>)}
                        </ul>
                    </div>
                    <div className="pp-card">
                        <h3 className="pp-section-title-icon"><List /> Materiais e Reagentes</h3>
                        <h4>Vidrarias e Equipamentos:</h4>
                        <ul className="pp-apoio-list">
                            {praticaInfo.materiais.map(mat => <li key={mat.nome}>{mat.qtd}x - {mat.nome}</li>)}
                        </ul>
                        <h4>Reagentes:</h4>
                        <ul className="pp-apoio-list">
                            {praticaInfo.reagentes.map(reag => <li key={reag.nome}>{reag.qtd} - {reag.nome}</li>)}
                        </ul>
                    </div>
                    <div className="pp-card pp-descarte-card">
                        <h3 className="pp-section-title-icon"><Trash2 /> Descarte de Resíduos</h3>
                        <p>{praticaInfo.descarte}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaginaPratica;