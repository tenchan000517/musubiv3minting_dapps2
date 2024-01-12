import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import ExternalMinterABI from '../config/ExternalABI.json';
import ForwarderContractABI from '../config/ForwarderABI.json';
import { useSelector, useDispatch } from 'react-redux'; // Redux を使用するためのインポート
import { useNavigate } from 'react-router-dom';
import { FaRedo } from 'react-icons/fa';
import { useProgress } from '../contexts/ProgressContext';
import './MintNFT.css';
import { connectToBlockchain } from '../redux/blockchainActions';
import { useSDK, useSigner } from "@thirdweb-dev/react"; // useSDK と useSigner のインポートを追加

const MintNFT = () => {
    const [minting, setMinting] = useState(false);
    const [mintSuccess, setMintSuccess] = useState(false);
    const navigate = useNavigate();
    const { dispatch: progressDispatch } = useProgress(); // useProgress からの dispatch を progressDispatch としてリネーム

    // Redux ストアから blockchain ステートを取得
    const walletData = useSelector(state => state.blockchain.walletData);
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     if (!account) {
    //         dispatch(connectToBlockchain());
    //     }
    // }, [dispatch, account]);

    // console.log('blockchain state:', blockchain);


    // コントラクトアドレスの設定
    const forwarderAddress = "0x7aCF6170a893c8a5b50d42482b0c32583649e370";
    const externalMinterAddress = "0x20914713c0B26cB8108f71E46dAF37166e9e6838";

    const mintNFT = async () => {
        console.log("MintNFT: mintNFT function triggered");

        if (!walletData || !walletData.signer) {
            console.error("Nowallet connected");
            return;
            }

        setMinting(true);
        setMintSuccess(false);

        try {
            const signer = walletData.signer;

            const signerAddress = await signer.getAddress();
            console.log("Signer:", signerAddress);
  
          // 署名者をログに出力
          console.log("Signer:", signer);

            // Nonceの取得 (リレイヤーのアドレスから)
            const forwarder = new ethers.Contract(forwarderAddress, ForwarderContractABI, signer);
            const nonce = await forwarder.getNonce(signerAddress);
            console.log(forwarder)

            console.log("Nonce:", nonce.toString());

            // metamint関数のデータをエンコード
            const mintAmount = 1;
            const maxMintAmount = 10;
            const merkleProof = []; // メルクルプルーフ
            const receiver = signerAddress; // ミントを受け取るアドレス

            // metamint関数のデータエンコード
            const externalMinter = new ethers.Contract(externalMinterAddress, ExternalMinterABI, signer);
           console.log(externalMinter)
            
            const metamintData = externalMinter.interface.encodeFunctionData("metamint", [
                mintAmount,
                maxMintAmount,
                merkleProof,
                receiver
            ]);
            console.log("Encoded Data:", metamintData);

            // フォワードリクエストの作成
            const forwardRequest = {
                from: signerAddress,
                to: externalMinterAddress,
                value: 0,
                gas: 200000,
                nonce,
                data: metamintData
            };
            console.log("Forward Request:", forwardRequest);

            // 署名の生成
            const signature = await signer.signMessage(ethers.utils.arrayify(ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
                ['address', 'address', 'uint256', 'uint256', 'uint256', 'bytes'],
                [forwardRequest.from, forwardRequest.to, forwardRequest.value, forwardRequest.gas, forwardRequest.nonce, forwardRequest.data]
            ))));
            console.log("Signature:", signature);

            // リレイヤーへのリクエスト送信
            const response = await axios.post('https://api.defender.openzeppelin.com/autotasks/dc788211-3ad1-489f-9ed8-4324d3f8c02a/runs/webhook/b0cf1309-d404-4478-a668-56fb34386738/LN9diJhNN9NvUCNu8McMfJ', {
                type: 'forward',
                request: forwardRequest,
                signature,
                forwarderAddress // forwarderAddressを設定
            });

            console.log('Response:', response.data);

            // フォワードリクエストの値をログに出力
            console.log(JSON.stringify([
                forwardRequest.from,
                forwardRequest.to,
                forwardRequest.value.toString(),
                forwardRequest.gas.toString(),
                forwardRequest.nonce.toString(),
                forwardRequest.data
            ]));

            setMinting(false);
            setMintSuccess(true); // 追加: ミントが成功したら、成功状態をtrueに設定
            progressDispatch({ type: 'SET_PROGRESS', payload: 2 }); // 進捗を2に設定

        } catch (error) {
            console.error('Error:', error);
            setMinting(false);
        }
        // dispatch(fetchDataFromBaseURI('https://nft-mint.xyz/data/ngstmetadata/'));

        
    };

    const handleViewNFTClick = () => {
        navigate('/view-nft'); // 「/view-nft」へ遷移
    };

    // // ウォレット情報の再取得
    // const fetchWalletInfo = async () => {
    //     if (!account) {
    //         console.log("No wallet address found");
    //         return;
    //     }
    //     console.log("Wallet is ready for minting. Address:", account);
    // };

    // const handleReload = () => {
    //     fetchWalletInfo();
    // };

    return (
        <div className="buttons-container">
            {/* <button className="reload-button" onClick={handleReload}>
                <FaRedo className="faRedo" />
            </button> */}

            <button onClick={mintNFT} disabled={minting}>
                {minting ? 'Minting...' : 'Mint NFT'}
            </button>

            {mintSuccess && (
                <div className="mint-success-message">
                    <p>Mint Success!!</p>
                    <p>※反映には少し時間がかかります</p>
                    <button onClick={handleViewNFTClick}>STEP2 NFTを確認しよう！</button>
                </div>
            )}
        </div>
    );
};

export default MintNFT;
