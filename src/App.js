import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectToBlockchain } from './redux/blockchainActions';
import Header from './components/Header';
import Footer from './components/Footer';
import OCRComponent from './components/OCRComponent';
import WalletConnect from './components/WalletConnect';
import ContractDataFetcher from './components/ContractDataFetcher';
import { metamaskWallet, coinbaseWallet, walletConnect, localWallet, embeddedWallet } from "@thirdweb-dev/react";
import { WalletProvider } from './contexts/WalletContext';
import { ThirdwebProvider, Web3Button,useContract, useContractRead } from "@thirdweb-dev/react";
import './App.css';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

function App() {
  const [mintAmount, setMintAmount] = useState(1);
  const walletAddress = useSelector((state) => state.blockchain.walletData?.address);
  const isConnected = !!walletAddress;
  const [creditCardButtonText, setCreditCardButtonText] = useState("クレジットカードで決済");

  const incrementMintAmount = () => {
    setMintAmount(mintAmount + 1);
  };

  const decrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  };

  const paymentUrl = `https://paypiement.xyz/ja/projects/0e483200-a017-4961-9bce-457f2da1cdc8?recipientAddress=${walletAddress}&quantity=${mintAmount}`;

  const handleSuccess = (tx) => {
    console.log("Transaction successful!", tx);
  };

  const sectionStyle = {
    backgroundImage: `url(/logo512.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed' /* パララックス効果を適用 */
  };
  
  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // 白基調の半透明オーバーレイ
    zIndex: -1 // 背景の後ろに配置
  };
  
  const contentStyle = {
    position: 'relative',
    zIndex: 2 // オーバーレイよりも前に配置
  };

  const walletConnectStyle = isConnected ? {} : {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%' // 高さを100%に設定
  };

  const leftSideStyle = isConnected ? {} : { maxWidth: '400px', margin: 'auto', marginTop: '100px' };
  const rightSideStyle = isConnected ? {} : { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50%', backgroundColor: 'rgba(255, 255, 255, 0)' };


  const mintframeSideStyle = isConnected ? {} : {
    backgroundColor: 'rgba(255, 255, 255, 0)', // 半透明の白色
  };

    // Reduxストアからデータを取得
    const smartContractData = useSelector((state) => state.data.smartContractData);


    // データが更新されたときにコンソールに出力
    useEffect(() => {
      if (smartContractData) {
        console.log('Smart Contract Data:', smartContractData);
      }
    }, [smartContractData]);

    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 768 && window.innerWidth <= 1080) {
          setCreditCardButtonText("クレカ決済");
        } else {
          setCreditCardButtonText("クレジットカード　決済");
        }
      };
    
      // イベントリスナーを設定
      window.addEventListener("resize", handleResize);
    
      // 初期ロード時にもチェック
      handleResize();
    
      // クリーンアップ関数
      return () => window.removeEventListener("resize", handleResize);
    }, []);

return (
  <ThirdwebProvider 
      clientId={CLIENT_ID} 
      activeChain={"polygon"}
      supportedWallets={[
        metamaskWallet({ recommended: true }),
        coinbaseWallet(),
        walletConnect(),
        localWallet(),
        embeddedWallet(),
      ]}
  >
    <WalletProvider>
        <ContractDataFetcher contractAddress="0xA982c7045EEeA4705da14611BFaA10e18dea90cE" />

    <div className="App"style={{ ...sectionStyle, ...contentStyle }}>
                  <div style={overlayStyle}></div>

                  <Header />

      <main className="main-content" style={walletConnectStyle}>
       
          <div className="left-side" style={leftSideStyle}>
              <img src="/logo192.jpg" alt="NFT" className="nft-image" />
                <div className='info'>
                    <h3>Mint Price : 0.03ETH</h3>
                    <span>{"8"} / 10</span>
                </div>
          </div>
          
          
          <div className="right-side" style={rightSideStyle}>
            <div className='mint-frame' style={mintframeSideStyle}>

                    <div className='wallet-connect'>
                    <WalletConnect />
                    </div>

                  {isConnected && (
                    <div className="mint-container">

                      <h3>Mint Amount</h3>

                      <div className="mint-controls">

                          <button className="controls-button" onClick={decrementMintAmount}>-</button>
                          <span className='mint-amount'>{mintAmount}</span>
                          <button className="controls-button" onClick={incrementMintAmount}>+</button>
                      
                      </div>

                      <div className='web3button-container'>
                          <Web3Button
                            contractAddress="0xA982c7045EEeA4705da14611BFaA10e18dea90cE"
                            action={async (contract) => {
                              await contract.erc721.claim(mintAmount);
                            }}
                            className="custom-web3-button"
                            onSuccess={handleSuccess}
                          >
                            Mint（0.03ETH）
                          </Web3Button>
                      </div>

                      <div className='credit-card-container'>
                          <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="credit-card-button">
                          {creditCardButtonText}
                          </a>
                      </div>

                    </div>
                  )}
            </div>
          </div>

      </main>
        <Footer />
    </div>
    </WalletProvider>
  </ThirdwebProvider>
  );
}

export default App;