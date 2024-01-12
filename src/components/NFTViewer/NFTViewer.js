import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCollectionData } from '../../redux/dataActions'; // dataActions のインポート
import WalletConnect from '../WalletConnect';
import './NFTViewer.css';
import { FaRedo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NFTViewer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { account } = useSelector((state) => state.blockchain);
    const nfts = useSelector((state) => state.data.nftData);

    useEffect(() => {
        console.log('アカウントアドレス:', account);
        if (account) {
            console.log('NFTデータを取得中...');
            dispatch(fetchCollectionData(account))
                .catch((error) => {
                    console.error('NFTデータの取得中にエラーが発生:', error);
                });
        }
    }, [account, dispatch]);

    const handleDownloadClick = () => {
        navigate('/download-nft');
    };

    const handleReload = () => {
        console.log('リロードボタンがクリックされました');
        if (account) {
            console.log('リロード中...');
            dispatch(fetchCollectionData(account))
                .catch((error) => {
                    console.error('リロード中にエラーが発生:', error);
                });
        }
    };

    return (
        <div>
            <div className="wallet-and-buttons">
                <WalletConnect />
                <button className="reload-button" onClick={handleReload}>
                    <FaRedo className="faRedo" />
                </button>
                <button onClick={handleDownloadClick}>STEP3 NFT画像をダウンロードしよう！</button>
            </div>
            {nfts.length === 0 ? (
                <p>You don't own any NFTs.</p>
            ) : (
                <div className="nft-grid">
                    {nfts.map((nft, index) => (
                        <div key={index} className="nft-item">
                            <strong>TokenID:</strong> {nft.tokenId} <br />
                            <strong>Name:</strong> {nft.name} <br />
                            <strong>Description:</strong> {nft.description} <br />
                            <img src={nft.image} alt={nft.name} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NFTViewer;
