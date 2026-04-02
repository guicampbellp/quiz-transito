import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Quiz from './components/Quiz';
import AdminDashboard from './components/AdminDashboard';
import InfoHabilitacao from './components/InfoHabilitacao';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userSaved = localStorage.getItem('user');
        if (userSaved) {
            setUser(JSON.parse(userSaved));
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <Router>
            <div className="App">
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                    <div className="container">
                        <Link className="navbar-brand" to="/">
                            <span className="me-2">🚗</span>
                            Quiz Trânsito
                        </Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Início</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/quiz">Fazer Quiz</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/info">Info Habilitação</Link>
                                </li>
                                {user ? (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/admin/dashboard">Admin</Link>
                                        </li>
                                        <li className="nav-item">
                                            <button 
                                                className="btn btn-link nav-link" 
                                                onClick={handleLogout}
                                            >
                                                Sair ({user.nome})
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">Login Admin</Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/info" element={<InfoHabilitacao />} />
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        <Route 
                            path="/admin/dashboard" 
                            element={
                                user ? <AdminDashboard /> : <Navigate to="/login" />
                            } 
                        />
                    </Routes>
                </div>

                <footer className="bg-light text-center text-lg-start mt-5">
                    <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                        © 2024 Quiz Trânsito - Aprenda as placas e prepare-se para a habilitação
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;