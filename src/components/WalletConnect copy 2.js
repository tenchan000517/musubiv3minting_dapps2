import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAddress, useWallet, useSigner, ConnectWallet } from "@thirdweb-dev/react";
import { connect, disconnect } from '../redux/blockchainActions';
import { ethers } from 'ethers';

const WalletConnect = ({ children }) => {
  const address = useAddress();
  const walletInstance = useWallet();
  const signer = useSigner();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (address && signer) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const walletSigner = provider.getSigner();
        dispatch(connect({ account: address, signer: walletSigner, walletInstance }));
      } else {
        dispatch(disconnect());
      }
    };

    checkWalletConnection();
}, [address, signer, walletInstance, dispatch]);

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const walletSigner = provider.getSigner();
        console.log("WalletConnect useEffect triggered");
        console.log("address:", address);
        console.log("signer:", signer);
        console.log("walletInstance:", walletInstance);

        dispatch(connect({ walletInstance, account: address, signer: walletSigner }));
      } catch (error) {
        console.error('Failed to connect wallet', error);
      }
    } else {
      console.error('Ethereum not found');
    }
  };

  const buttonClass = address ? "" : "custom-web3-button";

  return (
    <>
      <ConnectWallet theme={"dark"} modalSize={"compact"} onConnect={handleConnect} className={buttonClass}>
        {children}
      </ConnectWallet>
    </>
  );
};

export default WalletConnect;