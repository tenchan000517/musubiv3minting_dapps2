import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData } from './redux/dataActions'; // fetchData をインポート
import { disconnect } from './redux/blockchainActions'; // disconnect アクションをインポート

import Header from './components/Header';
import Footer from './components/Footer';
import WalletConnect from './components/WalletConnect';
import useMetaData from './Hook/useMetaData';
import Mint from './components/MintNFT';
import { metamaskWallet, coinbaseWallet, walletConnect, localWallet, embeddedWallet } from "@thirdweb-dev/react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import './App.css';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

function App() {
  const [config, setConfig] = useState(null);

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

    console.log("App: WalletAddress", blockchain.account);

  const isConnected = !!blockchain.account;
  
  useMetaData(); // Appコンポーネントでメタデータフックを使用

  // コンポーネントがマウントされたときにウォレット接続を試みる
  useEffect(() => {
    console.log("App: blockchain.account 変更検出", blockchain.account);

    if (blockchain.account) {
      dispatch(fetchData(blockchain.account));
    } else {
      dispatch(disconnect()); // アカウントが null になった場合、disconnect アクションをディスパッチ
    }
  }, [blockchain.account, dispatch]); 

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/config/Config.json');
        const configData = await response.json();
        setConfig(configData); // Configデータをローカル状態に設定
        console.log("Configデータ:", configData); // ログ出力を追加

      } catch (error) {
        console.error('Config.jsonの読み込みに失敗しました', error);
      }
    };

    fetchConfig();
  }, []);

    // configの状態を使用してUIをレンダリング
    if (!config) {
      return <div>Loading...</div>;
    }

    // BigNumber形式のTotalSupplyを数値に変換
    const totalSupply = data.totalSupply ? data.totalSupply.toNumber() : config ? config.MAX_SUPPLY : 0;
    console.log("Total Supply (BigNumber):", totalSupply);

  const sectionStyle = {
    backgroundImage: `url(/config/images/bg.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  };
  
  // const overlayStyle = {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   backgroundColor: 'rgba(255, 255, 255, 0.3)',
  //   zIndex: -1
  // };
  
  const contentStyle = {
    position: 'relative',
    zIndex: 2
  };

  const walletConnectStyle = isConnected ? {} : {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  };

  const leftSideStyle = isConnected ? {} : { maxWidth: '400px', margin: 'auto', marginTop: '100px' };
  const rightSideStyle = isConnected ? {} : { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50%', backgroundColor: 'rgba(255, 255, 255, 0)' };


  const mintframeSideStyle = isConnected ? {} : {
    backgroundColor: 'rgba(255, 255, 255, 0)',
  };

return (
  <ThirdwebProvider 
      clientId={CLIENT_ID} 
      activeChain={config.CHAIN}
      supportedWallets={[
        metamaskWallet({ recommended: true }),
        coinbaseWallet(),
        walletConnect(),
        localWallet(),
        embeddedWallet(),
      ]}
  >

    <div className="App"style={{ ...sectionStyle, ...contentStyle }}>
                  {/* <div style={overlayStyle}></div> */}

                  <Header />

      <main className="main-content" style={walletConnectStyle}>
       
          <div className="left-side" style={leftSideStyle}>
          <img src="/config/images/left.png" alt="NFT" className="nft-image" />
                <div className='info'>
                <h3>Mint Price : {config.DISPLAY_COST} {config.NETWORK.SYMBOL}</h3>
                <span>{totalSupply} / {config.MAX_SUPPLY}</span>
                </div>
          </div>
          
          
          <div className="right-side" style={rightSideStyle}>
            <div className='mint-frame' style={mintframeSideStyle}>

                    <div className='wallet-connect'>
                    <WalletConnect />
                    </div>

                  {isConnected && (
                    <div className="mint-container">

                      <Mint />

                    </div>
                  )}
            </div>
          </div>

      </main>
        <Footer />
    </div>
  </ThirdwebProvider>
  );
}

export default App;