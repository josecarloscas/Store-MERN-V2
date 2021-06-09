import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NavBar = props => {
  return (
    <nav className="navbar bg-dark navbar-dark flex-row-reverse mb-4">
      {/* Barra de navegación*/}
      <Link to="/user/cart" className="navbar-brand">
        <FontAwesomeIcon icon="shopping-cart" />
      </Link>

      {/* Logo de la aplicación */}
      <h3 className="mt-1">
        <Link to="/" className="text-white">
          <FontAwesomeIcon icon="store" />
        </Link>
      </h3>

      {/* Botón tipo hamburguesa de la barra de navegación*/}
      <button
        className="navbar-toggler"
        data-toggle="collapse"
        data-target="#navbarToggler"
        aria-controls="navbarToggler"
        aria-expanded="false"
        aria-label="Navigation Bar Toggler"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarToggler">
        {/* Enlaces de la Navbar */}
        <ul className="navbar-nav">
          {localStorage.getItem('name') && (
            <span className="navbar-text text-muted">
              {localStorage.getItem('name')}
            </span>
          )}
          {/*Enlaces a la pagina de inicio, LogIn, SignUp y Admin*/}
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Inicio
            </Link>
          </li>
          {!localStorage.getItem('token') && (
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Iniciar Sesion
              </Link>
            </li>
          )}
          {!localStorage.getItem('token') && (
            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Registrarse
              </Link>
            </li>
          )}
          {!localStorage.getItem('token') && (
            <li className="nav-item">
              <Link className="nav-link" to="/admin">
                Admin
              </Link>
            </li>
          )}
          {localStorage.getItem('token') && (
            <li className="nav-item">
              <a
                className="nav-link"
                href="/"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('name');
                }}
              >
                Cerrar Sesion
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default withRouter(NavBar);
