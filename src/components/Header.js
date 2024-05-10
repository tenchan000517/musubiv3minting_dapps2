// Header.js
import React, { useState, useEffect } from 'react';
import './Header.css';

function Header() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/config/Config.json');
        const configData = await response.json();
        setConfig(configData.HEADER);
      } catch (error) {
        console.error('Config.jsonの読み込みに失敗しました', error);
      }
    };

    fetchConfig();
  }, []);

  return (
    <header className="app-header">
      <div className="container">
        <div className='logo-container'>
          <img src="/config/images/musubiv3_header_character.png" alt="Header Character" className="header-character" />
        </div>
        <div className="header-right">
          <img src="/config/images/musubiv3_header_right.png" alt="Header Right Logo" className="header-right-logo" />
        </div>
      </div>
    </header>
  );
}

export default Header;