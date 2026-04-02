import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="display-4 hero-title">Bem-vindo ao Quiz Trânsito!</h1>
        <p className="lead text-secondary mt-3">
          Sua jornada para a habilitação começa aqui. Aprenda sobre placas, sinalizações e prepare-se com as novas regras de trânsito.
        </p>
        <hr className="my-4 mx-auto w-50" style={{borderColor: '#cbd5e1'}} />
        <Link to="/quiz" className="btn btn-primary btn-lg mt-2 px-5 py-3 rounded-pill shadow">
          Começar a Praticar 🚀
        </Link>
      </div>

      <div className="row mt-5 g-4">
        <div className="col-md-4">
          <div className="card h-100 text-center border-0 bg-white">
            <div className="card-body d-flex flex-column align-items-center">
              <div className="display-4 mb-3" style={{fontSize: '3rem'}}>📝</div>
              <h5 className="card-title fw-bold">Simulados Interativos</h5>
              <p className="card-text text-muted mb-4">Teste seus conhecimentos com dezenas de perguntas sobre legislação e direção defensiva.</p>
              <Link to="/quiz" className="btn btn-outline-primary mt-auto w-100">Fazer Quiz</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100 text-center border-0 bg-white">
            <div className="card-body d-flex flex-column align-items-center">
              <div className="display-4 mb-3" style={{fontSize: '3rem'}}>📚</div>
              <h5 className="card-title fw-bold">Material de Estudo</h5>
              <p className="card-text text-muted mb-4">Entenda o processo da primeira CNH, custos estimados e categorias disponíveis.</p>
              <Link to="/info" className="btn btn-outline-success mt-auto w-100">Ver Informações</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100 text-center border-0 bg-white">
            <div className="card-body d-flex flex-column align-items-center">
              <div className="display-4 mb-3" style={{fontSize: '3rem'}}>⚙️</div>
              <h5 className="card-title fw-bold">Gestão de Conteúdo</h5>
              <p className="card-text text-muted mb-4">Acesso exclusivo para instrutores adicionarem novas perguntas e atualizarem leis.</p>
              <Link to="/admin" className="btn btn-outline-warning mt-auto w-100">Acessar Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;