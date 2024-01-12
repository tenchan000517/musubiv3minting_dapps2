import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  // NavLinkのclassNameを関数で定義する
  const getNavLinkClass = isActive => isActive ? 'nav-item active' : 'nav-item';

  return (
    <header className="app-header">
      <div className="container">
        <Link to="/" className="logo">
          <img src="/logo192.png" alt="NecoGene Logo" />
          NecoGene NFT超入門
        </Link>
        <div className="hamburger-icon" onClick={handleMenuToggle}>
          ☰
        </div>
        <nav className={isNavOpen ? 'nav-open' : 'nav-closed'}>
        <NavLink to="/" className={({ isActive }) => getNavLinkClass(isActive)}>トップ</NavLink>
        <NavLink to="/restart" className={({ isActive }) => getNavLinkClass(isActive)}>途中からリスタート</NavLink>
          <NavLink to="/metamask-users" className={({ isActive }) => getNavLinkClass(isActive)}>メタマスクを持ってる人</NavLink>
          <NavLink to="/get-nft-first" className={({ isActive }) => getNavLinkClass(isActive)}>先にNFTを入手</NavLink>
          <NavLink to="/import-later" className={({ isActive }) => getNavLinkClass(isActive)}>後からインポート</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
