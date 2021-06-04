import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { validateLogin } from '../helpers/validators';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    const { state } = props.history.location;
    this.state = {
      email: '',
      password: '',
      passedMessage: state ? state.message : undefined,
    };

    if (localStorage.getItem('token')) {
      this.props.history.push('/');
    }
  }

  saveUserInput = e => {
    const { name, value } = e.target;

    // Código para eliminar clases de validación cuando el usuario está escribiendo
    if (name) {
      const inputElement = document.querySelector(`[name=${name}]`);
      const msgElement = document.querySelector(`.${name}`);
      if (inputElement && msgElement) {
        inputElement.classList.remove('is-invalid');
        inputElement.classList.remove('is-valid');
        msgElement.innerHTML = '';
      }
    }

    // Se almacena la entrada del usuario en el estado
    this.setState({
      [name]: value,
    });
  };

  submitUserInput = e => {
    e.preventDefault();
    const { email, password } = this.state;

    let allValid = true;

    if (!validateLogin(email, password)) {
      allValid = false;
    }

    if (allValid) {
      const jsonResponse = this.postData('/user/signin', {
        email,
        password,
      });

      jsonResponse.then(data => {
        if (data.error) {
          this.showServerResponseMessage(data.error, true);
        }

        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('name', data.name);
          this.props.history.push('/');
        }
      });
    }
  };

  showServerResponseMessage = (message = '', isError = false) => {
    if (isError) {
      // Llenado del elemento de mensaje de error
      document.querySelector('#errorResponse').innerHTML = message;
      document
        .querySelector('#errorResponse')
        .classList.replace('d-none', 'd-block');
    } else {
      document
        .querySelector('#errorResponse')
        .classList.replace('d-block', 'd-none');
    }
  };

  postData = async (url, data = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  };

  render() {
    return (
      <div className="container">
        {this.state.passedMessage && (
          <div className="alert alert-secondary">
            {this.state.passedMessage}
          </div>
        )}
        <form noValidate>
          <div className="alert alert-danger d-none" id="errorResponse" />
          <fieldset>
            <legend className="text-center text-info">
              Ingrese a su cuenta
            </legend>

            <div className="form-group">
              <label htmlFor="emailInput" className="form-control-label">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="emailInput"
                className="form-control"
                placeholder="Email"
                required
                value={this.state.email}
                onChange={this.saveUserInput}
              />
              <small className="text-danger email" />
            </div>

            <div className="form-group">
              <label htmlFor="passwordInput" className="form-control-label">
                Contraseña <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                name="password"
                id="passwordInput"
                className="form-control"
                placeholder="Contraseña"
                required
                value={this.state.password}
                onChange={this.saveUserInput}
              />
              <small className="text-danger password" />
            </div>

            <div className="custom-control custom-checkbox mb-3">
              <input
                type="checkbox"
                name="keep_signed"
                id="keepme"
                className="custom-control-input"
                checked
                disabled
              />
              <label htmlFor="keepme" className="custom-control-label">
                Mantener la sesion iniciada
              </label>
            </div>
            <div className="form-group">
              <input
                type="submit"
                value="Login"
                className="btn btn-primary"
                onClick={this.submitUserInput}
              />
            </div>
            <div className="text-muted">
              No tienes una cuenta?
              <Link className="ml-1" to="/register">
                Registrate aqui
              </Link>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}
