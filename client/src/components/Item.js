import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Item extends Component {
  _isMounted = false;

  state = {
    isInCart: false,
  };

  componentDidMount() {
    this._isMounted = true;

    this.userHasItem(this.props.id);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  userHasItem = itemId => {
    if (localStorage.getItem('token')) {
      fetch(`/user/items/${itemId}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.item) {
            if (this._isMounted) {
              this.setState({
                isInCart: true,
              });
            }
          }
        });
    }
  };

  addItemToCart = async () => {
    if (!localStorage.getItem('token')) {
      this.props.history.push('/login', {
        message: 'Inicia sesion para agregar productos al carrito.',
      });
    } else {
      const { id } = this.props;
      const data = await this.postData('/items/add', { itemId: id });

      // Caso en el que el producto fue añadido de forma exitosa.
      if (data.userItems) {
        this.showAlertMessage(
          `El producto ${this.props.name} fue añadido a tu carrito. `
        );
        this.setState({
          isInCart: true,
        });
      }
    }
  };

  showAlertMessage = message => {
    const alertDiv = document.getElementById('addConfirmAlert');
    const messageNode = document.createTextNode(message);

    if (alertDiv) {
      alertDiv.innerHTML = '';
      alertDiv.appendChild(messageNode);

      alertDiv.classList.replace('d-none', 'd-block');
    }
  };

  postData = async (url, data = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  };


  render() {
    const { name, description, price, imageUrl } = this.props;
    return (
      <React.Fragment>
        {/* card - s*/}
        <div className="card text-center mb-3">
          <img className="card-img-top" src={imageUrl} alt={`${name} item`} />
          <div className="card-body">
            <h3 className="card-title">{name}</h3>
            <p className="card-text">
              {description && description.substring(0, 70) + '...'}
            </p>
            <em>${price}</em>
          </div>

          {/* Card links*/}
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              {this.state.isInCart ? (
                <FontAwesomeIcon
                  icon="check"
                  className="text-dark"
                  data-toggle="tooltip"
                  title="In cart"
                />
              ) : (
                <button className="btn" onClick={this.addItemToCart}>
                  <FontAwesomeIcon
                    icon="cart-plus"
                    className="text-dark"
                    data-toggle="tooltip"
                    title="Add to cart"
                  />
                </button>
              )}
            </li>
          </ul>
          {/* Card links f*/}
        </div>
        {/*card f*/}
      </React.Fragment>
    );
  }
}

export default withRouter(Item);
