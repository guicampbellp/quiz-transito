import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [perguntas, setPerguntas] = useState([]);
  const [formData, setFormData] = useState({
    pergunta: '',
    opcao_a: '',
    opcao_b: '',
    opcao_c: '',
    opcao_d: '',
    resposta_correta: 'A',
    explicacao: '',
    categoria: 'placas'
  });
  const [editando, setEditando] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    carregarPerguntas();
  }, []);

  const carregarPerguntas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/perguntas');
      setPerguntas(response.data);
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editando) {
        await axios.put(`http://localhost:3001/api/perguntas/${editId}`, formData);
        alert('Pergunta atualizada com sucesso!');
      } else {
        await axios.post('http://localhost:3001/api/perguntas', formData);
        alert('Pergunta adicionada com sucesso!');
      }
      
      setFormData({
        pergunta: '',
        opcao_a: '',
        opcao_b: '',
        opcao_c: '',
        opcao_d: '',
        resposta_correta: 'A',
        explicacao: '',
        categoria: 'placas'
      });
      setEditando(false);
      setEditId(null);
      carregarPerguntas();
    } catch (error) {
      console.error('Erro ao salvar pergunta:', error);
      alert('Erro ao salvar pergunta');
    }
  };

  const handleEdit = (pergunta) => {
    setFormData({
      pergunta: pergunta.pergunta,
      opcao_a: pergunta.opcao_a,
      opcao_b: pergunta.opcao_b,
      opcao_c: pergunta.opcao_c,
      opcao_d: pergunta.opcao_d,
      resposta_correta: pergunta.resposta_correta,
      explicacao: pergunta.explicacao || '',
      categoria: pergunta.categoria || 'placas'
    });
    setEditando(true);
    setEditId(pergunta.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      try {
        await axios.delete(`http://localhost:3001/api/perguntas/${id}`);
        alert('Pergunta excluída com sucesso!');
        carregarPerguntas();
      } catch (error) {
        console.error('Erro ao excluir pergunta:', error);
        alert('Erro ao excluir pergunta');
      }
    }
  };

  return (
    <div className="admin-container">
      <h2>Área Administrativa</h2>
      
      <div className="row">
        <div className="col-md-5">
          <div className="card">
            <div className="card-header">
              <h4>{editando ? 'Editar Pergunta' : 'Adicionar Nova Pergunta'}</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Pergunta:</label>
                  <textarea 
                    className="form-control" 
                    name="pergunta" 
                    value={formData.pergunta} 
                    onChange={handleInputChange}
                    required
                    rows="3"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Opção A:</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="opcao_a" 
                    value={formData.opcao_a} 
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Opção B:</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="opcao_b" 
                    value={formData.opcao_b} 
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Opção C:</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="opcao_c" 
                    value={formData.opcao_c} 
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Opção D:</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="opcao_d" 
                    value={formData.opcao_d} 
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Resposta Correta:</label>
                  <select 
                    className="form-select" 
                    name="resposta_correta" 
                    value={formData.resposta_correta} 
                    onChange={handleInputChange}
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
                    value={formData.explicacao} 
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Categoria:</label>
                  <select 
                    className="form-select" 
                    name="categoria" 
                    value={formData.categoria} 
                    onChange={handleInputChange}
                  >
                    <option value="placas">Placas de Trânsito</option>
                    <option value="legislacao">Legislação</option>
                    <option value="direcao">Direção Defensiva</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary">
                  {editando ? 'Atualizar Pergunta' : 'Adicionar Pergunta'}
                </button>
                {editando && (
                  <button 
                    type="button" 
                    className="btn btn-secondary ms-2"
                    onClick={() => {
                      setEditando(false);
                      setFormData({
                        pergunta: '',
                        opcao_a: '',
                        opcao_b: '',
                        opcao_c: '',
                        opcao_d: '',
                        resposta_correta: 'A',
                        explicacao: '',
                        categoria: 'placas'
                      });
                    }}
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
              {perguntas.length === 0 ? (
                <p>Nenhuma pergunta cadastrada.</p>
              ) : (
                perguntas.map((pergunta, index) => (
                  <div key={pergunta.id} className="card mb-3">
                    <div className="card-body">
                      <h6 className="card-title">Pergunta {index + 1}</h6>
                      <p className="card-text">{pergunta.pergunta}</p>
                      <p className="card-text small">
                        <strong>Resposta correta:</strong> {pergunta.resposta_correta}<br />
                        <strong>Categoria:</strong> {pergunta.categoria}
                      </p>
                      <button 
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(pergunta)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(pergunta.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;