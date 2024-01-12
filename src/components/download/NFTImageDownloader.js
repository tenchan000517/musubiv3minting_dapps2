import React, { useState, useEffect } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { ethers } from 'ethers';
import abi from '../../config/abi.js';
import { useSDK, useSigner } from "@thirdweb-dev/react";
import axios from 'axios';
import WalletConnect from '../WalletConnect';
import './NFTImageDownloader.css';
import { FaRedo } from 'react-icons/fa';
import { useProgress } from '../../contexts/ProgressContext';
import { saveAs } from 'file-saver';

const NFTcontract = process.env.REACT_APP_NFTCONTRACT;
const proxyServerUrl = process.env.REACT_APP_PROXY_SERVER_URL;

const NFTImageDownloader = () => {
    const { state } = useWallet();
    const [nftImages, setNftImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const sdk = useSDK();
    const thirdwebSigner = useSigner();
    const { dispatch } = useProgress();

    useEffect(() => {
        const fetchNFTImages = async () => {
            if (!state.address) {
                console.log('No wallet address found');
                return;
            }
    
            let signer, address;
            if (thirdwebSigner && thirdwebSigner.originalSigner) {
                signer = thirdwebSigner.originalSigner;
                address = await signer.getAddress();
            } else {
                signer = thirdwebSigner || sdk.getProvider().getSigner();
                address = state.address;
            }
    
            const contract = new ethers.Contract(NFTcontract, abi, signer);
            const transferEventFilter = contract.filters.Transfer(null, address);
            const transferEvents = await contract.queryFilter(transferEventFilter);
    
            let imageUrls = [];
            for (const event of transferEvents) {
                const tokenId = event.args[2].toString();
                try {
                    const tokenURI = await contract.tokenURI(tokenId);
                    const proxyUrl = `${proxyServerUrl}/proxy?url=${encodeURIComponent(tokenURI)}`;
                    const metaDataResponse = await axios.get(proxyUrl);
                    const metaData = metaDataResponse.data;
                    imageUrls.push(metaData.image);
                } catch (error) {
                    console.error(`Error fetching metadata for token ID ${tokenId}:`, error);
                }
            }
        
            setNftImages(imageUrls);
        };
    
        fetchNFTImages();
    }, [state.address, sdk, thirdwebSigner]);
    

    const showNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % nftImages.length);
    };

    const showPreviousImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + nftImages.length) % nftImages.length);
    };

    const downloadImage = () => {
        if (!nftImages[currentImageIndex]) return;
    
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
        if (isIOS) {
            alert('iOSデバイスでは、画像を長押しして保存してください。');
        } else {
            const imageUrl = `${proxyServerUrl}/proxy?url=${encodeURIComponent(nftImages[currentImageIndex])}`;
            fetch(imageUrl)
                .then(response => response.blob())
                .then(blob => {
                    saveAs(blob, `NFTImage_${currentImageIndex}.png`);
                })
                .catch(error => console.error('Error downloading the image:', error));
        }
    };
    
    return (
        <div className="nft-image-downloader">
            <div className="connect-wallet-prompt">
                <WalletConnect />
            </div>
            <div className="reload-button-container">
                <button className="reload-button" onClick={() => window.location.reload()}>
                    <FaRedo className="faRedo" />
                </button>
            </div>
            {nftImages.length === 0 ? (
                <p>You don't own any NFTs.</p>
            ) : (
                <div className="slider">
                    <button className="slider-button" onClick={showPreviousImage}>&lt;</button>
                    <div className="image-container">
                        <img src={nftImages[currentImageIndex]} alt={`NFT ${currentImageIndex}`} />
                    </div>
                    <button className="slider-button" onClick={showNextImage}>&gt;</button>
                </div>
            )}
            <div className="download-button-container">
                <button className="download-button" onClick={downloadImage}>Download Image</button>
            </div>
        </div>
    );
};

export default NFTImageDownloader;
