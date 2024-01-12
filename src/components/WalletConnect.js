import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAddress, useWallet, useSigner } from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";

const SET_WALLET_DATA = 'SET_WALLET_DATA';

const WalletConnect = ({ children }) => {
    const address = useAddress();
    const walletInstance = useWallet();
    const signer = useSigner();
    const dispatch = useDispatch();
    const currentAddress = useSelector((state) => state.blockchain.address);

    useEffect(() => {
        console.log("WalletConnect: useEffect triggered", { address, walletInstance, signer });

        if (address && walletInstance && signer && address !== currentAddress) {
            dispatch({
                type: SET_WALLET_DATA,
                payload: { address, walletInstance, signer }
            });
       
        console.log("WalletConnect: Dispatched SET_WALLET_DATA");

        }
    }, [address, walletInstance, signer, dispatch, currentAddress]);

    function handleConnect(walletData) {
        dispatch({ type: SET_WALLET_DATA, payload: walletData });
    }

    return (
        <>
            <ConnectWallet theme={"dark"} modalSize={"compact"} onConnect={handleConnect} />
            {children}
        </>
    );
};

export default WalletConnect;
