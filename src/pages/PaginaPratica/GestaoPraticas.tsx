import React, { useState, useEffect, useCallback } from 'react'; // 1. useCallback importado
import { buscarPraticas, criarPratica, atualizarPratica, deletarPratica, Pratica, DadosCadastroPratica } from '../../services/PraticaService';
import ModalPratica from './ModalPratica';
import './GestaoPraticas.css';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const toArray = (data: any): data is any[] => Array.isArray(data);

const GestaoPraticas: React.FC = () => {
    const [praticas, setPraticas] = useState<Pratica[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [modalAberto, setModalAberto] = useState(false);
    const [praticaEmEdicao, setPraticaEmEdicao] = useState<Pratica | null>(null);
    
    const userEmail = localStorage.getItem('userEmail');
    const isDemoMode = userEmail === 'admin@email.com';

    const userRole = localStorage.getItem('userRole');
    const isManager = userRole === 'ADMIN';

    const carregarPraticas = useCallback(async () => {
        try {
            setCarregando(true);
            let dados: Pratica[];

            if (isDemoMode) {
                const dadosLocais = localStorage.getItem('demoPraticas');
                if (dadosLocais) {
                    dados = toArray(JSON.parse(dadosLocais)) ? JSON.parse(dadosLocais) : [];
                } else {
                    const dadosApi = await buscarPraticas();
                    dados = toArray(dadosApi) ? dadosApi : [];
                    localStorage.setItem('demoPraticas', JSON.stringify(dados));
                }
            } else {
                const dadosApi = await buscarPraticas();
                dados = toArray(dadosApi) ? dadosApi : [];
            }
            setPraticas(dados);
        } catch (error) {
            console.error("Falha ao carregar práticas", error);
            alert("Não foi possível carregar a lista de práticas.");
        } finally {
            setCarregando(false);
        }
    }, [isDemoMode]); 

    useEffect(() => {
        carregarPraticas();
    }, [carregarPraticas]);

    const handleSave = async (dados: DadosCadastroPratica, id?: string) => {
        if (isDemoMode) {
            const praticasAtuais = toArray(JSON.parse(localStorage.getItem('demoPraticas') || '[]')) ? JSON.parse(localStorage.getItem('demoPraticas') || '[]') : [];
            let praticasAtualizadas;

            if (id) {
                praticasAtualizadas = praticasAtuais.map((p: Pratica) => p.id === id ? { ...p, ...dados } : p);
            } else {
                const novaPratica = { ...dados, id: `temp_${Date.now()}` };
                praticasAtualizadas = [...praticasAtuais, novaPratica];
            }
            localStorage.setItem('demoPraticas', JSON.stringify(praticasAtualizadas));
            setPraticas(praticasAtualizadas);
            setModalAberto(false);
            alert('Demonstração: Prática salva!');
            return;
        }

        try {
            if (id) {
                const praticaAtualizada = await atualizarPratica(id, dados);
                setPraticas(praticas.map(p => p.id === id ? praticaAtualizada : p));
            } else {
                const novaPratica = await criarPratica(dados);
                setPraticas([...praticas, novaPratica]);
            }
            setModalAberto(false);
        } catch (error) {
            alert("Falha ao salvar a prática.");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta prática? Esta ação é irreversível.")) {
            if (isDemoMode) {
                const praticasAtuais = toArray(JSON.parse(localStorage.getItem('demoPraticas') || '[]')) ? JSON.parse(localStorage.getItem('demoPraticas') || '[]') : [];
                const praticasAtualizadas = praticasAtuais.filter((p: Pratica) => p.id !== id);
                localStorage.setItem('demoPraticas', JSON.stringify(praticasAtualizadas));
                setPraticas(praticasAtualizadas);
                alert('Demonstração: Prática excluída!');
                return;
            }

            try {
                await deletarPratica(id);
                setPraticas(praticas.filter(p => p.id !== id));
            } catch (error) {
                alert("Falha ao excluir a prática.");
            }
        }
    };

    const abrirModalParaCriar = () => {
        setPraticaEmEdicao(null);
        setModalAberto(true);
    };

    const abrirModalParaEditar = (pratica: Pratica) => {
        setPraticaEmEdicao(pratica);
        setModalAberto(true);
    };

    if (carregando) return <p>Carregando práticas...</p>;

    return (
        <>
            <div className="gp-page-header">
                <h3 className="gp-page-title">Gerenciamento de Roteiros de Práticas</h3>
                {isManager && (
                    <button className="action-button" onClick={abrirModalParaCriar}>
                        <PlusCircle size={18} /> Criar Nova Prática
                    </button>
                )}
            </div>

            <table className="gp-lista-table">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Disciplina</th>
                        <th>Dificuldade</th>
                        {isManager && <th>Ações</th>}
                    </tr>
                </thead>
                <tbody>
                    {praticas.map((p: Pratica) => (
                        <tr key={p.id}>
                            <td>{p.titulo}</td>
                            <td>{p.disciplina}</td>
                            <td>{p.dificuldade}</td>
                            {isManager && (
                                <td className="gp-actions-cell">
                                    <button title="Editar" onClick={() => abrirModalParaEditar(p)}><Edit size={16} /></button>
                                    <button title="Excluir" onClick={() => handleDelete(p.id)}><Trash2 size={16} /></button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalAberto && (
                <ModalPratica
                    isOpen={modalAberto}
                    pratica={praticaEmEdicao}
                    onClose={() => setModalAberto(false)}
                    onSave={handleSave}
                />
            )}
        </>
    );
};

export default GestaoPraticas;