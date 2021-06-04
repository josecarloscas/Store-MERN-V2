import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  validateRegisteration,
  validatePasswords,
  validateItemdb,
} from '../helpers/validators';

export default class AdminForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      price: '',
      imageUrl: '',
    };
    if (localStorage.getItem('token')) {
      this.props.history.push('/');
    }
  }

  saveItemInput = e => {
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

  submitProductInput = e => {
    const { name, description, price, imageUrl } = this.state;
    e.preventDefault();

    let allValid = true;

    if (!validateItemdb(name, description)) {
      allValid = false;
    }

    if (allValid) {
      const jsonResponse = this.postData('/additemdb', {
        name,
        description,
        price,
        imageUrl,
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

  showServerResponseMessage = (message = '', isError = false) => {
    if (isError) {
      // Ocultar el elemento de mensaje de exito.
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
              Ingresar un nuevo producto 
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
                placeholder="Ingresa el nombre del producto"
                minLength="5"
                required
                value={this.state.name}
                onChange={this.saveItemInput}
              />
              <small className="text-muted">
                El nombre debe tener 5 o más caracteres.
              </small>
              <div>
                <small className="text-danger name" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="descriptionInput" className="form-control-label">
                Descripción <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="description"
                id="descriptionInput"
                className="form-control"
                placeholder="Ingresa la descripción del producto"
                required
                value={this.state.description}
                onChange={this.saveItemInput}
              />
              <small className="text-danger description" />
            </div>

            <div className="form-group">
              <label htmlFor="priceInput" className="form-control-label">
                Precio <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                name="price"
                id="priceInput"
                className="form-control"
                placeholder="Ingresa el precio"
                minLength="1"
                required
                value={this.state.price}
                onChange={this.saveItemInput}
              />
              <small className="text-muted">
                El campo no puede quedar vacío.
              </small>
              <div>
                <small className="text-danger price" />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="priceInput" className="form-control-label">
                Dirección de imagen <span className="text-danger">*</span>
              </label>
              <input
                type="url"
                name="imageUrl"
                id="imageurlInput"
                className="form-control"
                placeholder="Ingresa la dirección de la imagen"
                minLength="5"
                required
                value={this.state.imageUrl}
                onChange={this.saveItemInput}
              />
              <small className="text-muted">
                El campo no puede quedar vacío.
              </small>
              <div>
                <small className="text-danger imageUrl" />
              </div>
            </div>

            <div className="form-group">
              <input
                type="submit"
                value="Agregar"
                className="btn btn-primary"
                onClick={this.submitProductInput}
              />
            </div>
      
          </fieldset>
        </form>
      </div>
    );
  }
}
