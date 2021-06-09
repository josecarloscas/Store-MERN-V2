import React, { Component } from 'react';
// importamos el componente cartitem que permite la vista individual por cada producto en el carro 
import CartItem from './CartItem';
//Importamos el HOC que permite obtener un nuevo componente cada vez que se realice un cambio de los productos en el carro 
import withUserItems from './HOC/withUserItems';

// se define el componente cart que permite obtener los productos en el carro dependiendo del token del usuario
class Cart extends Component {
  constructor(props) {
    super(props);
    if (!localStorage.getItem('token')) {
      this.props.history.push('/login', {
        message: 'Primero debes iniciar sesion.', // como se hace uso del token será necesario iniciar sesión
      });
    }
  }
  // Por cada producto en el carro se le permite el aumentar la cantidad, disminuirla y eliminar el producto
  increaseQuantity = itemId => {
    this.props.increaseQuantity(itemId); 
  };

  decreaseQuantity = itemId => {
    this.props.decreaseQuantity(itemId);
  };

  removeItem = itemId => {
    this.props.removeItem(itemId);
  };
  //Renderizamos la vista si está cargando productos, los productos en el carro, el numero por cada producto y el precio total  
  render() {
    const { isLoading, userItems, itemsNum, totalPrice } = this.props;

    if (isLoading) {
      return (
        <div className="container">
          <h3 className="text-center">Cargando tus productos...</h3>
        </div>
      );
    }

    if (userItems.length === 0) {
      return (
        <div className="container">
          <h3 className="text-center">Tu carrito esta vacio</h3>
        </div>
      );
    }
    // Mapeamos la lista de los productos, mostrando asi las siguientes propiedades por cada producto 
    const itemsComponents = userItems.map(item => {
      return (
        <CartItem
          id={item.id}
          key={item.id}
          name={item.name}
          description={item.description}
          price={item.price}
          imageUrl={item.imageUrl}
          quantity={item.quantity}
          increaseQuantity={this.increaseQuantity}
          decreaseQuantity={this.decreaseQuantity}
          removeItem={this.removeItem}
        />
      );
    });
    // Se retorna el precio total, un textfield para aplicar un cupon y el botón de pago 
    return (
      <div className="container">
        <h3 className="mb-3">Tu carrito ({itemsNum})</h3>

        <div className="row">
          <div className="col-md-8">{itemsComponents}</div>
          <div className="col-md-4">
            <h2>Total: ${totalPrice}</h2>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Ingresa un cupon de descuento"
              onFocus={e => e.target.removeAttribute('readOnly')}
              onBlur={e => e.target.setAttribute('readOnly', true)}
              readOnly
            />
            <form  action="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=2DYWLN6K3MK9J" method="post" target="_blank">
            <input class="btn btn-outline-secondary" type="submit" value="Realizar compra"></input>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withUserItems(Cart);
