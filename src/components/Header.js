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
          <img src="/config/images/logo.png" alt={config?.LOGO_ALT || 'Logo'} className="logo" />
          </div>

          <div className="navi-container">
          {["navi1.png", "navi2.png", "navi3.png", "navi4.png"].map((image, index) => (
              <img key={index} src={`/${image}`} alt={config?.NAV_ALTS?.[index] || `Navi ${index + 1}`} className="navi-image"/>
              ))}
          </div>

          <div className="header-content">
            <h1>{config?.TITLE}</h1>
          </div>

      </div>
    </header>
  );
}

export default Header;
