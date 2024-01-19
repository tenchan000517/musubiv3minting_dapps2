import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="container">
        <img src="/logo192.png" alt="kurimaro logo" className="logo" />
        <h1>kurimaro collection</h1>
      </div>
    </header>
  );
}

export default Header;
