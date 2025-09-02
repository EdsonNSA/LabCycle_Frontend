import React, { useState, useEffect } from 'react';
import './GestaoInventario.css';
import {
    Search, ChevronDown, PlusCircle, Filter, Edit, Trash2, X
} from 'lucide-react';

import { buscarReagentes, criarReagente, atualizarReagente, deletarReagente, DadosReagente } from '../../services/reagenteService';

const GestaoInventario: React.FC = () => {
    const [reagentes, setReagentes] = useState<DadosReagente[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [reagenteAtual, setReagenteAtual] = useState<DadosReagente | null>(null);
    const userRole = localStorage.getItem('userRole');
    const isManager = userRole === 'ADMIN';

    const carregarReagentes = async () => {
        try {
            setCarregando(true);
            const dados = await buscarReagentes();
            setReagentes(dados);
            setErro(null);
        } catch (error) {
            console.error(error);
            setErro('Não foi possível carregar o inventário. Tente novamente mais tarde.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarReagentes();
    }, []);

    const abrirModalParaCriar = () => {
        setReagenteAtual(null);
        setModalAberto(true);
    };

    const abrirModalParaEditar = (reagente: DadosReagente) => {
        setReagenteAtual(reagente);
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setReagenteAtual(null);
    };

    const handleSalvar = async (dadosDoFormulario: DadosReagente) => {
        try {
            if (reagenteAtual && reagenteAtual.id) {
                await atualizarReagente(reagenteAtual.id, dadosDoFormulario);
            } else {
                await criarReagente(dadosDoFormulario);
            }
            fecharModal();
            carregarReagentes();
        } catch (error) {
            console.error(error);
            alert('Ocorreu um erro ao salvar o reagente.');
        }
    };
    
    const handleDeletar = async (id: string) => {
        if (window.confirm('Tem certeza que deseja deletar este reagente?')) {
            try {
                await deletarReagente(id);
                carregarReagentes();
            } catch (error) {
                console.error(error);
                alert('Ocorreu um erro ao deletar o reagente.');
            }
        }
    };

    return (
        <>
            <div className="gi-page-header">
                <div className="gi-search-wrapper">
                    <Search className="gi-search-icon" />
                    <input type="text" placeholder="Buscar reagente por nome ou CAS..." className="gi-search-input" />
                </div>
                {isManager && (
                    <div className="gi-filters-wrapper">
                        <button className="gi-filter-button">
                            <Filter size={16} /> Status <ChevronDown size={16} />
                        </button>
                        <button className="gi-action-button" onClick={abrirModalParaCriar}>
                            <PlusCircle size={18} /> Adicionar Novo Reagente
                        </button>
                    </div>
                )}
            </div>

            <div className="gi-table-container">
                {carregando && <p>Carregando inventário...</p>}
                {erro && <p className="gi-error-message">{erro}</p>}
                {!carregando && !erro && (
                    <table className="gi-inventory-table">
                        <thead>
                            <tr>
                                <th>Reagente</th>
                                <th>Quantidade</th>
                                <th>Validade</th>
                                <th>Status</th>
                                <th>Localização</th>
                                {isManager && <th>Ações</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {reagentes.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="gi-reagente-info">
                                            <span className="gi-reagente-nome">{item.nome}</span>
                                            <span className="gi-reagente-cas">CAS: {item.numeroCas}</span>
                                        </div>
                                    </td>
                                    <td>{item.quantidade} {item.unidade}</td>
                                    <td>{new Date(item.dataValidade).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`gi-status-badge status-${item.status.toLowerCase().replace('_', '-')}`}>
                                            {item.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td>{item.localizacao}</td>
                                    {isManager && (
                                        <td>
                                            <div className="gi-actions-cell">
                                                <button onClick={() => abrirModalParaEditar(item)} className="gi-table-action-button"><Edit size={16} /></button>
                                                <button onClick={() => handleDeletar(item.id!)} className="gi-table-action-button action-delete"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {modalAberto && (
                <ModalReagente
                    reagente={reagenteAtual}
                    onSave={handleSalvar}
                    onClose={fecharModal}
                />
            )}
        </>
    );
};

interface ModalReagenteProps {
    reagente: DadosReagente | null;
    onSave: (dados: DadosReagente) => void;
    onClose: () => void;
}

const ModalReagente: React.FC<ModalReagenteProps> = ({ reagente, onSave, onClose }) => {
    const [formData, setFormData] = useState<DadosReagente>({
        nome: reagente?.nome || '',
        numeroCas: reagente?.numeroCas || '',
        quantidade: reagente?.quantidade || 0,
        unidade: reagente?.unidade || 'mL',
        dataValidade: reagente?.dataValidade || '',
        localizacao: reagente?.localizacao || '',
        status: reagente?.status || 'OK',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'quantidade' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    return (
        <div className="gi-modal-overlay">
            <div className="gi-modal-content">
                <div className="gi-modal-header">
                    <h3>{reagente ? 'Editar Reagente' : 'Adicionar Novo Reagente'}</h3>
                    <button onClick={onClose} className="gi-modal-close-button"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="gi-modal-form">
                    <div className="gi-form-group">
                        <label htmlFor="nome">Nome do Reagente</label>
                        <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
                    </div>
                     <div className="gi-form-group">
                        <label htmlFor="numeroCas">Número CAS</label>
                        <input type="text" id="numeroCas" name="numeroCas" value={formData.numeroCas} onChange={handleChange} required />
                    </div>
                    <div className="gi-form-row">
                        <div className="gi-form-group">
                            <label htmlFor="quantidade">Quantidade</label>
                            <input type="number" id="quantidade" name="quantidade" value={formData.quantidade} onChange={handleChange} required />
                        </div>
                        <div className="gi-form-group">
                            <label htmlFor="unidade">Unidade</label>
                            <select id="unidade" name="unidade" value={formData.unidade} onChange={handleChange} required>
                                <option value="mL">mL</option>
                                <option value="L">L</option>
                                <option value="g">g</option>
                                <option value="kg">kg</option>
                            </select>
                        </div>
                    </div>
                    <div className="gi-form-group">
                        <label htmlFor="dataValidade">Data de Validade</label>
                        <input type="date" id="dataValidade" name="dataValidade" value={formData.dataValidade} onChange={handleChange} required />
                    </div>
                    <div className="gi-form-group">
                        <label htmlFor="localizacao">Localização</label>
                        <input type="text" id="localizacao" name="localizacao" value={formData.localizacao} onChange={handleChange} required />
                    </div>
                    <div className="gi-form-group">
                        <label htmlFor="status">Status</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange} required>
                            <option value="OK">OK</option>
                            <option value="BAIXO_ESTOQUE">Baixo Estoque</option>
                            <option value="VENCENDO">Vencendo</option>
                            <option value="VENCIDO">Vencido</option>
                        </select>
                    </div>
                    <div className="gi-modal-footer">
                        <button type="button" onClick={onClose} className="gi-button-secondary">Cancelar</button>
                        <button type="submit" className="gi-button-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default GestaoInventario;