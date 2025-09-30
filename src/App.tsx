import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/login';
// import Register from './pages/register/register';
import Layout from './components/Layout/Layout';
import PainelAluno from './pages/PainelAluno/PainelAluno'; 
import PainelResponsavel from './pages/PainelResponsavel/PainelResponsavel';
import CatalogoKits from './pages/CatalogoKits/CatalogoKits';
import GestaoInventario from './pages/GestaoInventario/GestaoInventario';
import ListaTurmas from './pages/ListaTurmas/ListaTurmas';
import PaginaPratica from './pages/PaginaPratica/PaginaPratica';
import GerenciarPraticas from './pages/PaginaPratica/GerenciarPraticas'; 
import GestaoPraticas from './pages/PaginaPratica/GestaoPraticas';


const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                {/* <Route path="/register" element={<Register />} /> */}
                <Route path="/painel-aluno" element={<Layout><PainelAluno /></Layout>} />
                <Route path="/painel-responsavel" element={<Layout><PainelResponsavel /></Layout>} />
                <Route path="/catalogo-kits" element={<Layout><CatalogoKits /></Layout>} />
                <Route path="/gestao-inventario" element={<Layout><GestaoInventario /></Layout>} />
                <Route path="/minhas-turmas" element={<Layout><ListaTurmas /></Layout>} />
                <Route path="/minhas-turmas/:turmaId/praticas" element={<Layout><GerenciarPraticas /></Layout>} />
                <Route path="/gestao-praticas" element={<Layout><GestaoPraticas /></Layout>} />
                <Route path="/praticas/:praticaId" element={<Layout><PaginaPratica /></Layout>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;