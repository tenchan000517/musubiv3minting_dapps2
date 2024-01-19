import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="container">
          
          <div className='logo-container'>
          <img src="/logo192.png" alt="kurimaro logo" className="logo" />
          </div>

          <div className="navi-container">
            <img src="/navi1.png" alt="Navi 1" className="navi-image"/>
            <img src="/navi2.png" alt="Navi 2" className="navi-image"/>
            <img src="/navi3.png" alt="Navi 3" className="navi-image"/>
            <img src="/navi4.png" alt="Navi 4" className="navi-image"/>
          </div>

          <div className="header-content">
          <h1>kurimaro collection</h1>
          </div>

      </div>
    </header>
  );
}

export default Header;
