import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Quiz() {
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [quantidadePerguntas, setQuantidadePerguntas] = useState(10);
    const [quizIniciado, setQuizIniciado] = useState(false);
    const [todasPerguntas, setTodasPerguntas] = useState([]);
    const [perguntasSelecionadas, setPerguntasSelecionadas] = useState([]);
    const [perguntaAtual, setPerguntaAtual] = useState(0);
    const [respostas, setRespostas] = useState({});
    const [mostrarResultado, setMostrarResultado] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [historico, setHistorico] = useState([]);

    useEffect(() => {
        carregarPerguntas();
        carregarHistorico();
    }, []);

    const carregarPerguntas = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/perguntas');
            setTodasPerguntas(response.data);
            setLoading(false);
        } catch (err) {
            setError('Erro ao carregar perguntas');
            setLoading(false);
        }
    };

    const carregarHistorico = () => {
        const historicoSalvo = localStorage.getItem('quizHistorico');
        if (historicoSalvo) {
            setHistorico(JSON.parse(historicoSalvo));
        }
    };

    const salvarResultado = (acertos, total) => {
        const novoResultado = {
            id: Date.now(),
            nome: nomeUsuario,
            data: new Date().toLocaleString(),
            acertos,
            total,
            quantidade: total,
            porcentagem: ((acertos / total) * 100).toFixed(1)
        };

        const novoHistorico = [novoResultado, ...historico].slice(0, 10);
        setHistorico(novoHistorico);
        localStorage.setItem('quizHistorico', JSON.stringify(novoHistorico));
    };

    const handleIniciarQuiz = (e) => {
        e.preventDefault();
        if (nomeUsuario.trim()) {
            // Selecionar perguntas aleatórias
            const perguntasEmbaralhadas = [...todasPerguntas].sort(() => Math.random() - 0.5);
            const selecionadas = perguntasEmbaralhadas.slice(0, quantidadePerguntas);
            setPerguntasSelecionadas(selecionadas);
            setQuizIniciado(true);
        }
    };

    const handleResposta = (perguntaId, resposta) => {
        setRespostas({
            ...respostas,
            [perguntaId]: resposta
        });
    };

    const proximaPergunta = () => {
        if (perguntaAtual < perguntasSelecionadas.length - 1) {
            setPerguntaAtual(perguntaAtual + 1);
        } else {
            const resultado = calcularPontuacao();
            salvarResultado(resultado.acertos, resultado.total);
            setMostrarResultado(true);
        }
    };

    const calcularPontuacao = () => {
        let acertos = 0;
        perguntasSelecionadas.forEach(pergunta => {
            if (respostas[pergunta.id] === pergunta.resposta_correta) {
                acertos++;
            }
        });
        return {
            acertos,
            total: perguntasSelecionadas.length,
            porcentagem: (acertos / perguntasSelecionadas.length) * 100
        };
    };

    const resetQuiz = () => {
        setNomeUsuario('');
        setQuantidadePerguntas(10);
        setQuizIniciado(false);
        setPerguntaAtual(0);
        setRespostas({});
        setMostrarResultado(false);
        setPerguntasSelecionadas([]);
    };

    if (loading) return <div className="text-center">Carregando perguntas...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    if (!quizIniciado) {
        return (
            <div className="quiz-container">
                <h2>Quiz de Trânsito</h2>
                <div className="card mt-4">
                    <div className="card-body">
                        <h4>Bem-vindo ao Quiz!</h4>
                        <p>Configure seu quiz:</p>
                        <form onSubmit={handleIniciarQuiz}>
                            <div className="mb-3">
                                <label className="form-label">Seu nome:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Digite seu nome"
                                    value={nomeUsuario}
                                    onChange={(e) => setNomeUsuario(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label">Quantidade de perguntas:</label>
                                <select 
                                    className="form-select"
                                    value={quantidadePerguntas}
                                    onChange={(e) => setQuantidadePerguntas(Number(e.target.value))}
                                >
                                    <option value={5}>5 perguntas</option>
                                    <option value={10}>10 perguntas</option>
                                    <option value={15}>15 perguntas</option>
                                    <option value={20}>20 perguntas</option>
                                </select>
                                <small className="text-muted">
                                    Total disponível: {todasPerguntas.length} perguntas
                                </small>
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={todasPerguntas.length < quantidadePerguntas}
                            >
                                Iniciar Quiz
                            </button>
                            
                            {todasPerguntas.length < quantidadePerguntas && (
                                <div className="alert alert-warning mt-2">
                                    Não há perguntas suficientes. Cadastre mais perguntas no admin.
                                </div>
                            )}
                        </form>

                        {historico.length > 0 && (
                            <div className="mt-4">
                                <h5>Últimos resultados:</h5>
                                <div className="list-group">
                                    {historico.map((item) => (
                                        <div key={item.id} className="list-group-item">
                                            <strong>{item.nome}</strong> - {item.data}<br/>
                                            Acertou {item.acertos} de {item.total} ({item.porcentagem}%) - {item.quantidade} perguntas
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (mostrarResultado) {
        const resultado = calcularPontuacao();
        return (
            <div className="quiz-resultado">
                <h2>Resultado do Quiz - {nomeUsuario}</h2>
                <div className="card mt-4">
                    <div className="card-body">
                        <h3 className="text-center">
                            Você acertou {resultado.acertos} de {resultado.total} perguntas!
                        </h3>
                        <div className="progress mt-3">
                            <div 
                                className="progress-bar bg-success" 
                                role="progressbar" 
                                style={{ width: `${resultado.porcentagem}%` }}
                                aria-valuenow={resultado.porcentagem} 
                                aria-valuemin="0" 
                                aria-valuemax="100"
                            >
                                {resultado.porcentagem.toFixed(1)}%
                            </div>
                        </div>

                        <div className="mt-4">
                            <h4>Revisão das respostas:</h4>
                            {perguntasSelecionadas.map((pergunta, index) => (
                                <div key={pergunta.id} className="card mt-3">
                                    <div className="card-header">
                                        Pergunta {index + 1}
                                        {pergunta.imagem_url && (
                                            <img 
                                                src={pergunta.imagem_url} 
                                                alt="Placa" 
                                                style={{ maxWidth: '50px', maxHeight: '50px', float: 'right' }} 
                                            />
                                        )}
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">{pergunta.pergunta}</p>
                                        <p>
                                            <strong>Sua resposta:</strong> {respostas[pergunta.id] || 'Não respondida'} - 
                                            {respostas[pergunta.id] === pergunta.resposta_correta ? 
                                                <span className="text-success"> Correta ✓</span> : 
                                                <span className="text-danger"> Incorreta ✗</span>
                                            }
                                        </p>
                                        <p><strong>Resposta correta:</strong> {pergunta.resposta_correta}</p>
                                        {pergunta.explicacao && (
                                            <div className="alert alert-info">
                                                <strong>Explicação:</strong> {pergunta.explicacao}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="btn btn-primary mt-4" onClick={resetQuiz}>
                            Novo Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ... (mantenha a lógica do início do arquivo Quiz.js)

    const pergunta = perguntasSelecionadas[perguntaAtual];

    return (
        <div className="quiz-container max-w-3xl mx-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold text-primary m-0">Olá, {nomeUsuario}</h4>
                <span className="badge bg-primary rounded-pill px-3 py-2 fs-6">
                    {perguntaAtual + 1} / {perguntasSelecionadas.length}
                </span>
            </div>

            <div className="progress mb-4 rounded-pill bg-light" style={{ height: '12px' }}>
                <div 
                    className="progress-bar bg-primary rounded-pill transition-all" 
                    role="progressbar" 
                    style={{ width: `${((perguntaAtual + 1) / perguntasSelecionadas.length) * 100}%` }}
                ></div>
            </div>

            <div className="card border-0 shadow-lg">
                <div className="card-body p-4 p-md-5">
                    <h3 className="fw-bold mb-4 text-center">{pergunta.pergunta}</h3>
                    
                    {pergunta.imagem_url && (
                        <div className="text-center mb-4">
                            <img 
                                src={pergunta.imagem_url} 
                                alt="Imagem da pergunta" 
                                className="img-fluid rounded shadow-sm border"
                                style={{ maxHeight: '250px', objectFit: 'contain' }} 
                            />
                        </div>
                    )}

                    <div className="d-flex flex-column mt-4">
                        {['A', 'B', 'C', 'D'].map(letra => {
                            const opcao = pergunta[`opcao_${letra.toLowerCase()}`];
                            const isSelected = respostas[pergunta.id] === letra;
                            return (
                                <button
                                    key={letra}
                                    className={`quiz-option ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleResposta(pergunta.id, letra)}
                                >
                                    <span className="option-letter">{letra}</span>
                                    <span className="flex-grow-1">{opcao}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-5 text-end">
                        <button 
                            className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold w-100 w-md-auto"
                            onClick={proximaPergunta}
                            disabled={!respostas[pergunta.id]}
                        >
                            {perguntaAtual < perguntasSelecionadas.length - 1 ? 'Avançar ➔' : 'Finalizar Quiz ✓'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Quiz;