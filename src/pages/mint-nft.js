import React from 'react';
import WalletConnect from '../components/WalletConnect';
import MintNFT from '../components/MintNFT'; // MintNFTコンポーネントをインポート
import './mint-nft.css';

const MintNftPage = () => {
    return (
                
                <div className="component-container">
                <WalletConnect />
                <MintNFT /> {/* MintNFTコンポーネントを追加 */}
                {/* <NFTViewer /> */}
                </div>

    );
};

export default MintNftPage;

