import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function InfoHabilitacao() {
    const [informacoes, setInformacoes] = useState({});
    const [categoriasOrdenadas, setCategoriasOrdenadas] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // NOVO: Estado para controlar qual Accordion está aberto
    const [categoriaAberta, setCategoriaAberta] = useState(null);

    useEffect(() => {
        carregarInformacoes();
    }, []);

    const carregarInformacoes = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/informacoes');
            
            const dadosOrdenados = response.data.sort((a, b) => {
                if (a.categoria === b.categoria) {
                    return a.ordem - b.ordem;
                }
                const ordemCategorias = { 'processo': 1, 'regras': 2, 'categorias': 3, 'custos': 4, 'dicas': 5 };
                return (ordemCategorias[a.categoria] || 99) - (ordemCategorias[b.categoria] || 99);
            });

            const agrupado = dadosOrdenados.reduce((acc, item) => {
                if (!acc[item.categoria]) acc[item.categoria] = [];
                acc[item.categoria].push(item);
                return acc;
            }, {});

            Object.keys(agrupado).forEach(categoria => {
                agrupado[categoria].sort((a, b) => a.ordem - b.ordem);
            });

            setInformacoes(agrupado);
            
            const ordemCategorias = ['processo', 'regras', 'categorias', 'custos', 'dicas'];
            const categoriasExistentes = Object.keys(agrupado);
            const ordenado = ordemCategorias.filter(cat => categoriasExistentes.includes(cat));
            
            setCategoriasOrdenadas(ordenado);
            
            // Abre a primeira categoria por padrão assim que carregar
            if (ordenado.length > 0) {
                setCategoriaAberta(ordenado[0]);
            }
            
        } catch (error) {
            console.error('Erro ao carregar informações:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoriaTitulo = (categoria) => {
        const titulos = {
            'processo': '📋 Processo para Primeira Habilitação (PPD)',
            'regras': '🚗 Novas Regras 2024',
            'categorias': '🚦 Categorias de CNH',
            'custos': '💰 Custos Estimados',
            'dicas': '📚 Dicas para a Prova'
        };
        return titulos[categoria] || categoria;
    };

    // NOVO: Função para alternar as abas
    const toggleAccordion = (categoria) => {
        if (categoriaAberta === categoria) {
            setCategoriaAberta(null); // Fecha se clicar na que já está aberta
        } else {
            setCategoriaAberta(categoria); // Abre a nova categoria
        }
    };

    if (loading) {
        return <div className="text-center">Carregando informações...</div>;
    }

    return (
        <div className="info-container">
            <h2>Informações sobre a Habilitação - Novas Regras 2024</h2>
            
            <div className="accordion mt-4">
                {categoriasOrdenadas.map((categoria) => {
                    const isOpen = categoriaAberta === categoria;
                    
                    return (
                        <div className="accordion-item" key={categoria}>
                            <h2 className="accordion-header">
                                <button 
                                    className={`accordion-button ${isOpen ? '' : 'collapsed'}`} 
                                    type="button" 
                                    onClick={() => toggleAccordion(categoria)}
                                >
                                    {getCategoriaTitulo(categoria)}
                                </button>
                            </h2>
                            {/* A classe 'show' é o que faz o conteúdo aparecer no Bootstrap */}
                            <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
                                <div className="accordion-body">
                                    {informacoes[categoria].map((item, itemIndex) => (
                                        <div key={item.id} className="mb-4">
                                            <h5>{item.titulo}</h5>
                                            <ReactMarkdown>{item.conteudo}</ReactMarkdown>
                                            {itemIndex < informacoes[categoria].length - 1 && <hr />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* O script perigoso do Bootstrap foi removido daqui! */}
        </div>
    );
}

export default InfoHabilitacao;