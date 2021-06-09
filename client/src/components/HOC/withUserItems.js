import React, { Component } from 'react';

// El HOC permite recibir un componente y devolver un nuevo componente
// En este caso se recibe una vista del carro y se obtiene una nueva si 
// se le aplican cambios a los productos o su cantidad
export default function withUserItems(WrappedComponent) {
  return class extends Component {
    _isMounted = false;
    constructor(props) {
      super(props);
      this.state = {
        userItems: [],
        totalPrice: 0,
        isLoading: false,
      };
    }

    componentDidMount() {
      this._isMounted = true;
      this.retrieveUserItems();
    }

    componentWillUnmount() {
      this._isMounted = false;
    }
    // Se reciben los articulos que están en el carro del usuario
    retrieveUserItems = () => {
      if (localStorage.getItem('token')) {
        this.setState({ isLoading: true });
        this.getData('/user/items')
          .then(data => {
            if (this._isMounted) {
              this.setState({
                userItems: data.items,
                totalPrice: data.totalPrice,
                isLoading: false,
              });
            }
          })
          .catch(err => console.error(err));
      }
    };
    // Se establece la logica de la acción que permite aumentar la cantidad de un producto
    increaseQuantity = async itemId => {
      try {
        const data = await this.postData('/items/add', { itemId });
        if (data.userItems) {
          if (this._isMounted) {
            this.setState({
              userItems: data.userItems,
              totalPrice: data.totalPrice,
            });
          }
        } else {
          console.error('No se puede aumentar la cantidad.');
        }
      } catch (error) {
        console.error(error);
      }
    };
    // Se establece la logica de la acción que permite disminuir la cantidad de un producto
    decreaseQuantity = async itemId => {
      try {
        const data = await this.postData('/items/remove', {
          itemId,
          removeItem: false,
        });

        if (data.userItems) {
          if (this._isMounted) {
            this.setState({
              userItems: data.userItems,
              totalPrice: data.totalPrice,
            });
          }
        } else {
          console.error('No se puede disminuir la cantidad.');
        }
      } catch (error) {
        console.error(error);
      }
    };
    // Se establece la logica de la acción que permite eliminar un producto del carro del usuario
    removeItem = async itemId => {
      try {
        const data = await this.postData('/items/remove', {
          itemId,
          removeItem: true,
        });

        if (data.userItems) {
          if (this._isMounted) {
            this.setState({
              userItems: data.userItems,
              totalPrice: data.totalPrice,
            });
          }
        } else {
          console.error('No se puede eliminar el producto.');
        }
      } catch (error) {
        console.error(error);
      }
    };
    // Se obtienen los datos del carro dependienfo del token del usuario que este logeado
    getData = async url => {
      const response = await fetch(url, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      return await response.json();
    };
    //Llamada al metodo Post al cambiar las propiedades de los productos en el carro 
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
    //Se muestra el nuevo componente
    render() {
      return (
        <WrappedComponent
          isLoading={this.state.isLoading}
          userItems={this.state.userItems}
          itemsNum={this.state.userItems.length}
          totalPrice={this.state.totalPrice}
          increaseQuantity={this.increaseQuantity}
          decreaseQuantity={this.decreaseQuantity}
          removeItem={this.removeItem}
          {...this.props}
        />
      );
    }
  };
}
