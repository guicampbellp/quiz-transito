import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('perguntas');
    const [perguntas, setPerguntas] = useState([]);
    const [informacoes, setInformacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formPergunta, setFormPergunta] = useState({
        pergunta: '',
        opcao_a: '',
        opcao_b: '',
        opcao_c: '',
        opcao_d: '',
        resposta_correta: 'A',
        explicacao: '',
        categoria: 'placas',
        imagem: null
    });
    const [formInfo, setFormInfo] = useState({
        titulo: '',
        conteudo: '',
        categoria: 'processo',
        ordem: 0
    });
    const [editandoId, setEditandoId] = useState(null);
    const [editandoInfoId, setEditandoInfoId] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const [perguntasRes, infoRes] = await Promise.all([
                axios.get('http://localhost:3001/api/perguntas'),
                axios.get('http://localhost:3001/api/informacoes')
            ]);
            setPerguntas(perguntasRes.data);
            setInformacoes(infoRes.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // CRUD Perguntas
    const handlePerguntaChange = (e) => {
        const { name, value } = e.target;
        setFormPergunta({ ...formPergunta, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormPergunta({ ...formPergunta, imagem: file });
        
        // Preview da imagem
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const handlePerguntaSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        Object.keys(formPergunta).forEach(key => {
            if (key === 'imagem' && formPergunta[key]) {
                formData.append(key, formPergunta[key]);
            } else if (key !== 'imagem') {
                formData.append(key, formPergunta[key]);
            }
        });

        try {
            if (editandoId) {
                await axios.put(`http://localhost:3001/api/perguntas/${editandoId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
                alert('Pergunta atualizada com sucesso!');
            } else {
                await axios.post('http://localhost:3001/api/perguntas', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
                alert('Pergunta adicionada com sucesso!');
            }
            
            resetFormPergunta();
            carregarDados();
        } catch (error) {
            console.error('Erro ao salvar pergunta:', error);
            alert('Erro ao salvar pergunta');
        }
    };

    const handleEditPergunta = (pergunta) => {
        setFormPergunta({
            pergunta: pergunta.pergunta,
            opcao_a: pergunta.opcao_a,
            opcao_b: pergunta.opcao_b,
            opcao_c: pergunta.opcao_c,
            opcao_d: pergunta.opcao_d,
            resposta_correta: pergunta.resposta_correta,
            explicacao: pergunta.explicacao || '',
            categoria: pergunta.categoria,
            imagem: null
        });
        setPreviewImage(pergunta.imagem_url);
        setEditandoId(pergunta.id);
    };

    const handleDeletePergunta = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
            try {
                await axios.delete(`http://localhost:3001/api/perguntas/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert('Pergunta excluída com sucesso!');
                carregarDados();
            } catch (error) {
                console.error('Erro ao excluir pergunta:', error);
                alert('Erro ao excluir pergunta');
            }
        }
    };

    const resetFormPergunta = () => {
        setFormPergunta({
            pergunta: '',
            opcao_a: '',
            opcao_b: '',
            opcao_c: '',
            opcao_d: '',
            resposta_correta: 'A',
            explicacao: '',
            categoria: 'placas',
            imagem: null
        });
        setPreviewImage(null);
        setEditandoId(null);
    };

    // CRUD Informações
    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        setFormInfo({ ...formInfo, [name]: value });
    };

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editandoInfoId) {
                await axios.put(`http://localhost:3001/api/informacoes/${editandoInfoId}`, formInfo, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert('Informação atualizada com sucesso!');
            } else {
                await axios.post('http://localhost:3001/api/informacoes', formInfo, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert('Informação adicionada com sucesso!');
            }
            
            resetFormInfo();
            carregarDados();
        } catch (error) {
            console.error('Erro ao salvar informação:', error);
            alert('Erro ao salvar informação');
        }
    };

    const handleEditInfo = (info) => {
        setFormInfo({
            titulo: info.titulo,
            conteudo: info.conteudo,
            categoria: info.categoria,
            ordem: info.ordem
        });
        setEditandoInfoId(info.id);
    };

    const handleDeleteInfo = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta informação?')) {
            try {
                await axios.delete(`http://localhost:3001/api/informacoes/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert('Informação excluída com sucesso!');
                carregarDados();
            } catch (error) {
                console.error('Erro ao excluir informação:', error);
                alert('Erro ao excluir informação');
            }
        }
    };

    const resetFormInfo = () => {
        setFormInfo({
            titulo: '',
            conteudo: '',
            categoria: 'processo',
            ordem: 0
        });
        setEditandoInfoId(null);
    };

    if (loading) {
        return <div className="text-center mt-5">Carregando...</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Painel Administrativo</h2>
                <button className="btn btn-danger" onClick={handleLogout}>
                    Sair
                </button>
            </div>

            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'perguntas' ? 'active' : ''}`}
                        onClick={() => setActiveTab('perguntas')}
                    >
                        Perguntas do Quiz
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'informacoes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('informacoes')}
                    >
                        Informações da Habilitação
                    </button>
                </li>
            </ul>

            {activeTab === 'perguntas' && (
                <div className="row">
                    <div className="col-md-5">
                        <div className="card mb-4">
                            <div className="card-header">
                                <h4>{editandoId ? 'Editar Pergunta' : 'Nova Pergunta'}</h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handlePerguntaSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Pergunta:</label>
                                        <textarea 
                                            className="form-control" 
                                            name="pergunta" 
                                            value={formPergunta.pergunta} 
                                            onChange={handlePerguntaChange}
                                            required
                                            rows="3"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Imagem da Placa (opcional):</label>
                                        <input 
                                            type="file" 
                                            className="form-control" 
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        {previewImage && (
                                            <div className="mt-2">
                                                <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px' }} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Opção A:</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="opcao_a" 
                                            value={formPergunta.opcao_a} 
                                            onChange={handlePerguntaChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Opção B:</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="opcao_b" 
                                            value={formPergunta.opcao_b} 
                                            onChange={handlePerguntaChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Opção C:</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="opcao_c" 
                                            value={formPergunta.opcao_c} 
                                            onChange={handlePerguntaChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Opção D:</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="opcao_d" 
                                            value={formPergunta.opcao_d} 
                                            onChange={handlePerguntaChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Resposta Correta:</label>
                                        <select 
                                            className="form-select" 
                                            name="resposta_correta" 
                                            value={formPergunta.resposta_correta} 
                                            onChange={handlePerguntaChange}
                                        >
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="C">C</option>
                                            <option value="D">D</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Explicação:</label>
                                        <textarea 
                                            className="form-control" 
                                            name="explicacao" 
                                            value={formPergunta.explicacao} 
                                            onChange={handlePerguntaChange}
                                            rows="3"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Categoria:</label>
                                        <select 
                                            className="form-select" 
                                            name="categoria" 
                                            value={formPergunta.categoria} 
                                            onChange={handlePerguntaChange}
                                        >
                                            <option value="placas">Placas de Trânsito</option>
                                            <option value="legislacao">Legislação</option>
                                            <option value="direcao">Direção Defensiva</option>
                                        </select>
                                    </div>

                                    <button type="submit" className="btn btn-primary">
                                        {editandoId ? 'Atualizar' : 'Adicionar'}
                                    </button>
                                    {editandoId && (
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary ms-2"
                                            onClick={resetFormPergunta}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-7">
                        <div className="card">
                            <div className="card-header">
                                <h4>Perguntas Cadastradas</h4>
                            </div>
                            <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                {perguntas.map((p, index) => (
                                    <div key={p.id} className="card mb-3">
                                        <div className="card-body">
                                            {p.imagem_url && (
                                                <img 
                                                    src={p.imagem_url} 
                                                    alt="Placa" 
                                                    style={{ maxWidth: '100px', maxHeight: '100px', float: 'right' }} 
                                                />
                                            )}
                                            <h6>Pergunta {index + 1}</h6>
                                            <p>{p.pergunta}</p>
                                            <div className="small">
                                                <strong>Categoria:</strong> {p.categoria}<br/>
                                                <strong>Resposta:</strong> {p.resposta_correta}
                                            </div>
                                            <button 
                                                className="btn btn-sm btn-warning me-2 mt-2"
                                                onClick={() => handleEditPergunta(p)}
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-danger mt-2"
                                                onClick={() => handleDeletePergunta(p.id)}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'informacoes' && (
                <div className="row">
                    <div className="col-md-5">
                        <div className="card mb-4">
                            <div className="card-header">
                                <h4>{editandoInfoId ? 'Editar Informação' : 'Nova Informação'}</h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleInfoSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Título:</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="titulo" 
                                            value={formInfo.titulo} 
                                            onChange={handleInfoChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Conteúdo (use ** para negrito):</label>
                                        <textarea 
                                            className="form-control" 
                                            name="conteudo" 
                                            value={formInfo.conteudo} 
                                            onChange={handleInfoChange}
                                            required
                                            rows="8"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Categoria:</label>
                                        <select 
                                            className="form-select" 
                                            name="categoria" 
                                            value={formInfo.categoria} 
                                            onChange={handleInfoChange}
                                        >
                                            <option value="processo">Processo</option>
                                            <option value="regras">Novas Regras</option>
                                            <option value="categorias">Categorias</option>
                                            <option value="custos">Custos</option>
                                            <option value="dicas">Dicas</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Ordem:</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            name="ordem" 
                                            value={formInfo.ordem} 
                                            onChange={handleInfoChange}
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary">
                                        {editandoInfoId ? 'Atualizar' : 'Adicionar'}
                                    </button>
                                    {editandoInfoId && (
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary ms-2"
                                            onClick={resetFormInfo}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-7">
                        <div className="card">
                            <div className="card-header">
                                <h4>Informações Cadastradas</h4>
                            </div>
                            <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                {informacoes.map((info) => (
                                    <div key={info.id} className="card mb-3">
                                        <div className="card-body">
                                            <h6>{info.titulo}</h6>
                                            <p className="small text-muted">Categoria: {info.categoria} | Ordem: {info.ordem}</p>
                                            <div className="small">
                                                {info.conteudo.substring(0, 150)}...
                                            </div>
                                            <button 
                                                className="btn btn-sm btn-warning me-2 mt-2"
                                                onClick={() => handleEditInfo(info)}
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-danger mt-2"
                                                onClick={() => handleDeleteInfo(info.id)}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;