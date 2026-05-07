import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="display-4 hero-title">Quiz de Trânsito</h1>
        <p className="lead mt-3">
          Prepare-se para sua prova de habilitação com simulados e conteúdo atualizado sobre as novas regras de trânsito.
        </p>
        <Link to="/quiz" className="btn btn-primary btn-lg mt-4 px-5 py-2">
          Começar Simulado
        </Link>
      </div>

      <div className="row mt-5 g-4">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body d-flex flex-column align-items-center">
              <h5 className="card-title fw-bold mb-3">Simulados</h5>
              <p className="card-text mb-4">Teste seus conhecimentos com questões sobre placas, legislação e direção defensiva.</p>
              <Link to="/quiz" className="btn btn-outline-primary mt-auto w-100">Fazer Quiz</Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body d-flex flex-column align-items-center">
              <h5 className="card-title fw-bold mb-3">Estude</h5>
              <p className="card-text mb-4">Acesse informações sobre o processo de habilitação, custos e categorias de CNH disponíveis.</p>
              <Link to="/info" className="btn btn-outline-primary mt-auto w-100">Ver Informações</Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body d-flex flex-column align-items-center">
              <h5 className="card-title fw-bold mb-3">Administração</h5>
              <p className="card-text mb-4">Área restrita para gerenciar questões, informações e conteúdo do sistema.</p>
              <Link to="/login" className="btn btn-outline-primary mt-auto w-100">Acessar Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;