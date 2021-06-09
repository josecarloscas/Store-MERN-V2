import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//Espaciado de columnas y estilo 
import './css/App.css';
//Cabecera
import Header from './components/layout/Header';
//Lista de priductos
import ItemsList from './components/ItemsList';
//Componente con el formulario de inicio de sesión
import LoginForm from './components/LoginForm';
//Componente con el mensaje de error 404
import NotFound from './components/layout/NotFound';
//Componente con el formulario de registro
import RegisterForm from './components/RegisterForm';
//Componente con la vista del carro
import Cart from './components/Cart';
//Componente con la vista del pie de pagina con el enlace el proyecto
import Footer from './components/layout/Footer';

//Se define la estructura general de la vista de la aplicación 
function App() {
  return (
    <div>
      <Router>
        <div className="App">
          <Header />
          <Switch>
            <Route exact path="/" component={ItemsList} />
            <Route path="/login" component={LoginForm} />
            <Route path="/register" component={RegisterForm} />
            <Route path="/user/cart" component={Cart} />
            <Route component={NotFound} />
          </Switch>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
