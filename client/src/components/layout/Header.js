import React from 'react';
import NavBar from './NavBar';
// cabecera de la aplicación
const Header = props => {
  return (
    <header className="sticky-top">
      <NavBar />
    </header>
  );
};

export default Header;
