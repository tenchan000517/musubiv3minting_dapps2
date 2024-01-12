import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import GuideCharacter from './components/GuideCharacter';
import ProgressBar from './components/ProgressBar';
import HomePage from './pages/index';
import MintNftPage from './pages/mint-nft';
import MintNftView from './pages/view-nft';
import NFTImageDownloader from './pages/download-nft';
import { ProgressProvider } from './contexts/ProgressContext';
import OCRComponent from './components/OCRComponent';

import NotFound from './pages/NotFound';

import { Goerli } from "@thirdweb-dev/chains";
import { smartWallet, metamaskWallet, coinbaseWallet, walletConnect, localWallet, embeddedWallet } from "@thirdweb-dev/react";
import { WalletProvider } from './contexts/WalletContext'; // WalletProviderをインポート
import { ThirdwebProvider } from "@thirdweb-dev/react";


import './App.css';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
const FACTORY_ADDRESS = process.env.REACT_APP_FACTORY_ADDRESS;

const smartWalletOptions = {
    factoryAddress: FACTORY_ADDRESS,
    gasless: true,
};

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const location = useLocation();

  useEffect(() => {
    switch(location.pathname) {
      case "/":
        setCurrentStep(1);
        break;
      case "/mint-nft":
        setCurrentStep(2);
        break;
      case "/view-nft":
        setCurrentStep(3); // ここが重要です！
        break;
      case "/download-nft":
        setCurrentStep(4);
        break;
      default:
        setCurrentStep(1);
    }
  }, [location]);

  return (
            <ThirdwebProvider 
                clientId={CLIENT_ID} 
                secretKey={SECRET_KEY} 
                supportedChains={[Goerli]} 
                supportedWallets={[
                    smartWallet(metamaskWallet({ recommended: true }), smartWalletOptions),
                    smartWallet(coinbaseWallet(), smartWalletOptions),
                    smartWallet(walletConnect(), smartWalletOptions),
                    smartWallet(localWallet(), smartWalletOptions),
                    embeddedWallet(),
                ]}
            >

<WalletProvider>

    <div className="App">
      <Header />
      <GuideCharacter currentStep={currentStep} />
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage currentStep={currentStep} setCurrentStep={setCurrentStep} />} />
          <Route path="/mint-nft" element={<MintNftPage currentStep={currentStep} setCurrentStep={setCurrentStep} />} />
          <Route path="/view-nft" element={<MintNftView currentStep={currentStep} setCurrentStep={setCurrentStep} />} />
          <Route path="/download-nft" element={<NFTImageDownloader currentStep={currentStep} setCurrentStep={setCurrentStep} />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/ocr" element={<OCRComponent />} />

        </Routes>
      </main>
      <Footer />
    </div>
    
</WalletProvider>

    </ThirdwebProvider>
  );
}

// Routerコンポーネントを使用するために、Appをラップする別のコンポーネントを作成
function AppWrapper() {
  return (
    <ProgressProvider>
      <Router>
        <App />
      </Router>
    </ProgressProvider>
  );
}


export default AppWrapper;
