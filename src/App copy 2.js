import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMintData, fetchBurninData, fetchNewMintCount, fetchUserBurnedAmount } from './redux/dataActions';
import { disconnect } from './redux/blockchainActions';

import Header from './components/Header';
import Footer from './components/Footer';
import WalletConnect from './components/WalletConnect';
import Mint from './components/MintNFT';
import Burnin from './components/Burnin';
import BurninInfo from './components/BurninInfo';

import CartButton1 from './components/CartButton1';
import CartButton2 from './components/CartButton2';
import CartButton3 from './components/CartButton3';
import CartButton4 from './components/CartButton4';

import { metamaskWallet, coinbaseWallet, walletConnect, localWallet, embeddedWallet } from "@thirdweb-dev/react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import './App.css';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

function App() {
  const [config, setConfig] = useState(null);
  const [shopifyClient, setShopifyClient] = useState(null);

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const { mintData, burninData } = useSelector((state) => state.data);

  const isConnected = !!blockchain.account;
  




  useEffect(() => {
    if (blockchain.account) {
      dispatch(fetchMintData(blockchain.account));
      dispatch(fetchBurninData(blockchain.account));
      dispatch(fetchNewMintCount(blockchain.account));
      dispatch(fetchUserBurnedAmount(blockchain.account));
    } else {
      dispatch(disconnect());
    }
  }, [blockchain.account, dispatch]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/config/config.json');
        const configData = await response.json();
        setConfig(configData);
      } catch (error) {
        console.error('Failed to load Config.json', error);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const client = window.ShopifyBuy.buildClient({
        domain: 'ec386d-2.myshopify.com',
        storefrontAccessToken: 'cf7e35e09c0becda21776c116cf9e69d',
      });

      setShopifyClient(client);
    };
  }, []);

  if (!config) {
    return <div>Loading...</div>;
  }

  const totalSupply = mintData.totalSupply ? mintData.totalSupply.toNumber() : config ? config.MAX_SUPPLY : 0;

  const sectionStyle = {
    backgroundImage: `url(/config/images/musubiv3_bg.png)`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'repeat',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };
  


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

  const mintframeSideStyle = isConnected ? {} : {
    backgroundColor: 'rgba(255, 255, 255, 0)',
  };

  const newMintCount = parseInt(mintData.userMintedAmount || 0, 10);
  const burninCount = parseInt(burninData.userBurnedAmount || 0, 10);

  const renderGoodsSpecialButton = () => {
    const totalCount = newMintCount + burninCount;
    const components = [];
  
    if (totalCount >= 1) {
      components.push(<div id="cartbutton1" key="1"><CartButton1 client={shopifyClient} /></div>);
    }
    if (totalCount >= 2) {
      components.push(<div id="cartbutton2" key="2"><CartButton2 client={shopifyClient} /></div>);
    }
    if (totalCount >= 3) {
      components.push(<div id="cartbutton3" key="3"><CartButton3 client={shopifyClient} /></div>);
    }
    if (totalCount >= 4) {
      components.push(<div id="cartbutton4" key="4"><CartButton4 client={shopifyClient} /></div>);
    }

    return components.length > 0 ? (
      <div className="cart-button-container">
        {components.map((component, index) => (
          <div key={index}>{component}</div>
        ))}
      </div>
    ) : null;
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
      <div className="App" style={{ ...sectionStyle, ...contentStyle }}>
        <Header />

        <main className="main-content" style={walletConnectStyle}>
        <div className="left-side">
            <div className="inner-frame" style={{ backgroundColor: 'rgba(255, 255, 255, 0)', border: 'none' }}>
              <img src="/config/images/left.png" alt="NFT" className="nft-image" />
              <div className='info'>
                <h3>Mint Price : {config.DISPLAY_COST} {config.NETWORK.SYMBOL}</h3>
                <span>{totalSupply} / {config.MAX_SUPPLY}</span>
              </div>
            </div>
          </div>

          <div className="right-side">
            <div className='mint-frame'>
              <div className='wallet-connect'>
                <WalletConnect />
              </div>

              {isConnected && (
                <>
                  <div className="mint-container">
                    <div className="mint-image-container">
                    <img src="/config/images/MusubiV3_generative.gif" alt="NFT" />
                    </div>

                    <Mint />
                  </div>
                  <div className="burnin-container">
                   <Burnin />
                  </div>
                  <div className="burnin-form-container">
                    <BurninInfo
                      newMintCount={mintData.newMintCount}
                      burninCount={burninData.userBurnedAmount}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {(newMintCount >= 1 || burninCount >= 1) && renderGoodsSpecialButton()}
        </main>
        <Footer />

      </div>
    </ThirdwebProvider>
  );
}

export default App;