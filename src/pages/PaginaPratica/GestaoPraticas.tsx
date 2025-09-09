import React, { useState, useEffect } from 'react';
import { buscarPraticas, criarPratica, atualizarPratica, deletarPratica, Pratica, DadosCadastroPratica } from '../../services/PraticaService';
import ModalPratica from './ModalPratica';
import './GestaoPraticas.css';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const GestaoPraticas: React.FC = () => {
    const [praticas, setPraticas] = useState<Pratica[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [modalAberto, setModalAberto] = useState(false);
    const [praticaEmEdicao, setPraticaEmEdicao] = useState<Pratica | null>(null);

    const userRole = localStorage.getItem('userRole');
    const isManager = userRole === 'ADMIN';

    const carregarPraticas = async () => {
        try {
            setCarregando(true);
            const dados = await buscarPraticas();
            setPraticas(dados);
        } catch (error) {
            console.error("Falha ao carregar práticas", error);
            alert("Não foi possível carregar a lista de práticas.");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarPraticas();
    }, []);

    const handleSave = async (dados: DadosCadastroPratica, id?: string) => {
        try {
            if (id) {
                await atualizarPratica(id, dados);
            } else {
                await criarPratica(dados);
            }
            setModalAberto(false);
            carregarPraticas(); 
        } catch (error) {
            alert("Falha ao salvar a prática.");
        }
    };


    const handleDelete = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta prática? Esta ação é irreversível.")) {
            try {
                await deletarPratica(id);
                carregarPraticas(); 
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
                    {praticas.map(p => (
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