import React, { Component } from 'react';
//Se importa el componente Item que permite saber si el producto esta o no en el carro y a su vez agregar los productos 
import Item from './Item';
//Definiendo el componente ItemsList que permite la vista general de los productos en la pagina de inicio
class ItemsList extends Component {
  _isMounted = false;

  state = {
    items: [],
    loadingItems: false,
  };
  //En el caso de que los productos se esten cargando se le muestra un mensaje al usuario 
  componentDidMount() {
    this._isMounted = true;

    this.setState({ loadingItems: true });
    fetch('/items')
      .then(response => response.json())
      .then(data => {
        if (this._isMounted) {
          this.setState({
            items: data.items,
            loadingItems: false,
          });
        }
      })
      .catch(() => {
        if (this._isMounted) {
          this.setState({
            loadingItems: false,
          });
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  //Renderizamos el mensaje en el caso de que los productos se esten cargando y a su vez se muestra la vista general de cada producto en el inicio  
  render() {
    if (this.state.loadingItems) {
      return <h3 className="text-center">Cargando productos...</h3>;
    }

    if (this.state.items.length > 0) {
      const itemComponents = this.state.items.map(item => {
        const { name, description, price, imageUrl } = item;
        return (
          <Item
            key={item._id}
            id={item._id}
            name={name}
            description={description}
            price={price}
            imageUrl={imageUrl}
          />
        );
      });
      //Retornamos un contenedor con el titulo productos diponibles cuando se carge la lista de productos
      return (
        <React.Fragment>
          <div
            className="container-fluid text-center alert alert-success d-none"
            id="addConfirmAlert"
          />
          <h1 className="text-center my-3 text-danger">Productos disponibles</h1>
          <div className="container-fluid  grid-container">
            {itemComponents}
          </div>
        </React.Fragment>
      );
    }
    //En caso de que los productos no puedan ser cargados se muestra el mensaje de que no se tienen productos 
    return <h3 className="text-center">De momento no hay productos disponibles</h3>;
  }
}

export default ItemsList;
