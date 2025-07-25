import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/login';
import Register from './pages/register/register';

// Importe os componentes dos painéis
import PainelAluno from './components/PainelAluno/PainelAluno'; 
import PainelResponsavel from './components/PainelResponsavel/PainelResponsavel'; // 1. Importe o painel do professor

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Rotas de Autenticação */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Rotas dos Painéis */}
                <Route path="/painel-aluno" element={<PainelAluno />} />
                <Route path="/painel-responsavel" element={<PainelResponsavel />} /> {/* 2. Adicione a nova rota */}

                {/* Rota de Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};


export default App;