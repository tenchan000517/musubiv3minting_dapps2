import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAddress, useWallet, useSigner, ConnectWallet } from "@thirdweb-dev/react";
import { connect, disconnect } from '../redux/blockchainActions';

const WalletConnect = ({ children }) => {
    const address = useAddress();
    const walletInstance = useWallet();
    const signer = useSigner();
    const dispatch = useDispatch();
    const currentAddress = useSelector((state) => state.blockchain.address);

    // ログを追加
    console.log("WalletConnect: Address", address);
    console.log("WalletConnect: WalletInstance", walletInstance);
    console.log("WalletConnect: Signer", signer);
    console.log("WalletConnect: CurrentAddress", currentAddress);

    useEffect(() => {
        // アドレスとサイナーが有効かどうかをチェック
        if (address && signer) {
            dispatch(connect({ account: address, signer })); // account として address を渡す
            console.log("WalletConnect: Dispatched connect action", { address, signer });
        } else {
          console.log("WalletConnect: Missing values", { address, signer });
          dispatch(disconnect()); // address が undefined の場合、disconnect アクションをディスパッチ
          console.log("WalletConnect: Dispatched disconnect action");
        }
      }, [address, signer, dispatch]);

    const handleConnect = () => {
        console.log("WalletConnect: handleConnect called");
        console.log("handleConnect: Address", address);
        console.log("handleConnect: WalletInstance", walletInstance);
        console.log("handleConnect: Signer", signer);
        dispatch(connect({ walletInstance, account: address, signer })); // ここでも account として address を渡す
    };

    const buttonClass = address ? "" : "custom-web3-button";

    return (
        <>
        <ConnectWallet
            theme={"dark"}
            modalSize={"compact"}
            onConnect={handleConnect}
            className={buttonClass}
        >
            {children}
            </ConnectWallet>

        </>
    );
};

export default WalletConnect;
