import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/login';
import Register from './pages/register/register';
import PainelAluno from './pages/PainelAluno/PainelAluno'; 
import PainelResponsavel from './pages/PainelResponsavel/PainelResponsavel';
import CatalogoKits from './pages/CatalogoKits/CatalogoKits';
import GestaoInventario from './pages/GestaoInventario/GestaoInventario';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/painel-aluno" element={<PainelAluno />} />
                <Route path="/painel-responsavel" element={<PainelResponsavel />} />
                <Route path="/catalogo-kits" element={<CatalogoKits />} />
                <Route path="/gestao-inventario" element={<GestaoInventario />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};


export default App;
