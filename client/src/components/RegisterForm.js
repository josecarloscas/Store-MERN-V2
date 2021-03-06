import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//Importamos las funciones que permiten validar el registro y si las contraseñas coinciden 
import {
  validateRegisteration,
  validatePasswords,
} from '../helpers/validators';
// Se define el componente RegisterForm que permite la vista del formulario que permite el registro de un nuevo usuario 
export default class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password1: '',
      password2: '',
    };
    if (localStorage.getItem('token')) {
      this.props.history.push('/');
    }
  }
  //Se guardan los datos ingresados por el usuario 
  saveUserInput = e => {
    const { name, value } = e.target;

    // Eliminar las clases de validacion cuando se esta escribiendo 
    if (name) {
      const inputElement = document.querySelector(`[name=${name}]`);
      const msgElement = document.querySelector(`.${name}`);
      if (inputElement && msgElement) {
        inputElement.classList.remove('is-invalid');
        inputElement.classList.remove('is-valid');
        msgElement.innerHTML = '';
      }
    }

    // Almacenar la entrada del usuario en un estado.
    this.setState({
      [name]: value,
    });
  };
  //Enviamos el imput del usuario y si todo es valido los datos son almacenados en la DB mediante una perición POST
  submitUserInput = e => {
    const { name, email, password1, password2 } = this.state;
    e.preventDefault();

    let allValid = true;

    if (!validateRegisteration(name, email)) {
      allValid = false;
    }

    if (!validatePasswords(password1, password2)) {
      allValid = false;
    }

    if (allValid) {
      const jsonResponse = this.postData('/user/signup', {
        name,
        email,
        password: password1,
      });

      jsonResponse.then(data => {
        if (data.error) {
          this.showServerResponseMessage(data.error, true);
        }

        if (data.message) {
          this.showServerResponseMessage(data.message);
        }
      });
    }
  };
    //Mostrar mensajes de error y exito 
  showServerResponseMessage = (message = '', isError = false) => {
    if (isError) {
      // Oculatar el elemento de mensaje de exito.
      document
        .querySelector('#successResponse')
        .classList.replace('d-block', 'd-none');

      // Llenar el elemento de mensaje de erorr.
      document.querySelector('#errorResponse').innerHTML = message;
      document
        .querySelector('#errorResponse')
        .classList.replace('d-none', 'd-block');
    } else {
      // Ocultar elemento de mensaje de error.
      document
        .querySelector('#errorResponse')
        .classList.replace('d-block', 'd-none');

      // Llenado del mensaje de exito.
      document.querySelector('#successResponse').innerHTML = message;
      document
        .querySelector('#successResponse')
        .classList.replace('d-none', 'd-block');
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
  //Renderizamos el formulario de resgistro con los campos de nombre, Email, contraseña, confirmar contraseña y el boton de registro
  //Se genera tambien un enlace a la ruta de inicio de sesión en caso de estar registrado 
  render() {
    return (
      <div className="container">
        <div className="alert alert-danger d-none" id="errorResponse" />
        <div className="alert alert-success d-none" id="successResponse" />
        <form
          className="needs-validation"
          id="registerationForm"
          method="POST"
          noValidate
        >
          <fieldset>
            <legend className="text-center text-info mb-3">
              Crear una nueva cuenta 
            </legend>

            <div className="form-group">
              <label htmlFor="nameInput" className="form-control-label">
                Nombre <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="nameInput"
                className="form-control"
                placeholder="Ingresa tu nombre"
                minLength="5"
                required
                value={this.state.name}
                onChange={this.saveUserInput}
              />
              <small className="text-muted">
                El nombre debe tener 5 o mas caracteres.
              </small>
              <div>
                <small className="text-danger name" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="emailInput" className="form-control-label">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="emailInput"
                className="form-control"
                placeholder="Ingresa tu correo"
                required
                value={this.state.email}
                onChange={this.saveUserInput}
                onInput={this.validateInputs}
              />
              <small className="text-danger email" />
            </div>
            <div className="form-row">
              <div className="form-group col-sm-6">
                <input
                  type="password"
                  name="password1"
                  className="form-control"
                  placeholder="Ingresa tu contraseña"
                  required
                  value={this.state.email.password2}
                  onChange={this.saveUserInput}
                />
                <small className="text-muted">
                  Tu contraseña debe tener 8 o mas caracteres.
                </small>
                <div>
                  <small className="text-danger password1" />
                </div>
              </div>

              <div className="form-group col-sm-6">
                <input
                  type="password"
                  name="password2"
                  className="form-control"
                  placeholder="Vuelve a escribir tu contraseña"
                  required
                  value={this.state.password2}
                  onChange={this.saveUserInput}
                />
                <small className="text-danger password2" />
                <small className="text-danger password2" />
                <small className="text-danger" id="matching-password-msg" />
              </div>
            </div>
            <div className="form-group">
              <input
                type="submit"
                value="Register"
                className="btn btn-primary"
                onClick={this.submitUserInput}
              />
            </div>
            <div className="text-muted mb-3">
              Ya tienes una cuenta?
              <Link className="ml-1" to="/login">
                Inicia sesion aqui
              </Link>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}
