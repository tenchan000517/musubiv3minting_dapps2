import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      <main>
        <h1>NFTミントガイド</h1>
        <p>このサイトでは、NFTのミントまでの手順をステップバイステップでガイドします。</p>
        
        <section>
          <h2>NFTミントステップ</h2>
          <ol>
          <li><button onClick={() => handleNavigation('/mint-nft')}>1. NFTのミント</button></li>
          <li><button onClick={() => handleNavigation('/view-nft')}>2. ウォレットの中のNFTの確認</button></li>
          <li><button onClick={() => handleNavigation('/download-nft')}>3. アイコン画像のダウンロード</button></li>

          </ol>
        </section>

        <section>
          <h2>このサイトの特徴</h2>
          <p>初心者でも迷わずにNFTのミントができるように、詳細な手順とガイドを提供しています。また、ガスレスでのミントや後からウォレットを作成する流れもサポートしています。</p>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
