// MintNFT.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connect } from '../redux/blockchainActions'; // connect を blockchainActions からインポート
import { fetchData } from '../redux/dataActions'; // fetchData を dataActions からインポート
import { allowlistAddresses }  from "../allowlist";

const { MerkleTree } = require('merkletreejs');
const { ethers } = require('ethers')
const keccak256 = require('keccak256');


function Mint() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`MINTボタンを押してNFTをミントしてください。`);
  const [mintAmount, setMintAmount] = useState(1);
  const [mintSuccess, setMintSuccess] = useState(false); // ミント成功状態の追加
  const [allowlistUserAmountData, setAllowlistUserAmountData] = useState(0);
  const [currentNetworkId, setCurrentNetworkId] = useState(null);
  const [creditCardButtonText, setCreditCardButtonText] = useState("クレジットカードで決済");

  const nameMapRef = useRef([]);
  const addressIdRef = useRef(-1);

  useEffect(() => {
    console.log("MintNFT: blockchain state", blockchain);
  }, [blockchain]);

  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
    SINGLE_MINT_MODE: false,
  });
  let nameMap;
  let leafNodes;
  let merkleTree;
  let addressId = -1;
  let claimingAddress;
  let hexProof;

  const connectFunc = () => {
    console.log("MintNFT: Connect button clicked");
    dispatch(connect());
  };

  // ロギングの追加
  useEffect(() => {
    console.log("MintNFT: blockchain state", blockchain);
    console.log("MintNFT: data state", data);
  }, [blockchain, data]);



  // claimNFTs 関数を追加
  const claimNFTs = async () => {  // asyncキーワードを追加
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    let allowlistMaxMintAmount;
    let burnId = 0;

    console.log(CONFIG.CONTRACT_ADDRESS)
    console.log(CONFIG.WEI_COST)
  
    // アローリストのアドレスとマッピング
    nameMap = allowlistAddresses.map( list => list[0] );
    leafNodes = allowlistAddresses.map(addr => ethers.utils.solidityKeccak256(['address', 'uint256'], [addr[0] , addr[1]]));
    merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true});
    addressId = nameMap.indexOf(blockchain.account);

    if( addressId == -1){
      //data.whitelistUserAmount = 0;
      allowlistMaxMintAmount = 0;
      claimingAddress = ethers.utils.solidityKeccak256(['address', 'uint256'], [allowlistAddresses[0][0] , allowlistAddresses[0][1]]);
      hexProof = merkleTree.getHexProof(claimingAddress);    
    }else{
      //data.whitelistUserAmount = allowlistAddresses[addressId][1];
      allowlistMaxMintAmount = allowlistAddresses[addressId][1];
      claimingAddress = ethers.utils.solidityKeccak256(['address', 'uint256'], [allowlistAddresses[addressId][0] , allowlistAddresses[addressId][1]]);
      hexProof = merkleTree.getHexProof(claimingAddress);    
    }
  
    // コントラクトへの送金とミント処理
    console.log("MintNFT: Claiming NFTs with amount:", mintAmount);
    console.log("Total Cost (Wei):", totalCostWei);
    console.log("Total Gas Limit:", totalGasLimit);
    console.log("Allowlist Max Mint Amount:", allowlistMaxMintAmount);
    console.log("Hex Proof:", hexProof);
    console.log("burnId:", burnId);

  
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);

    setFeedback(` ${CONFIG.NFT_NAME} をミントしています。しばらくお待ちください。`);
    setClaimingNft(true);

    console.log("Smart Contract Instance", blockchain.smartContract)
    
      // スマートコントラクトのメソッド呼び出しを確認
      try {
        // トランザクションの実行
        const transaction = await blockchain.smartContract.mint(
          mintAmount, 
          allowlistMaxMintAmount, 
          hexProof, 
          burnId, 
          {
            value: totalCostWei,
          }
        );
    
        // トランザクションの確定を待つ
        const receipt = await transaction.wait();
    
        // トランザクション成功後の処理
        console.log("MintNFT: Minting successful", receipt);
        setFeedback(
          `${CONFIG.NFT_NAME}がミントできました! Opensea.io で確認してみましょう。`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
    
      } catch (err) {
        // エラーハンドリング
        console.error("MintNFT: Error in minting NFT", err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      }
    };

    // 数量を減らす関数
    const decrementMintAmount = () => {
        let newMintAmount = mintAmount - 1;
        if (newMintAmount < 1) {
          newMintAmount = 1;
        }
        setMintAmount(newMintAmount);
      };
    
      // 数量を10減らす関数
      const decrementMintAmount10 = () => {
        let newMintAmount = mintAmount - 10;
        if (newMintAmount < 1) {
          newMintAmount = 1;
        }
        setMintAmount(newMintAmount);
      };
    
      // 数量を増やす関数
      const incrementMintAmount = () => {
        let newMintAmount = mintAmount + 1;

        if(newMintAmount == 0 ){
          newMintAmount = 1;
        }
        setMintAmount(newMintAmount);
      };
    
      // 数量を10増やす関数
      const incrementMintAmount10 = () => {
        let newMintAmount = mintAmount + 10;

        if(newMintAmount == 0 ){
          newMintAmount = 1;
        }
        setMintAmount(newMintAmount);
      };

      const handleSuccess = (tx) => {
        console.log("Transaction successful!", tx);
        setMintSuccess(true);
      };

      const getMerkleData = useCallback(() => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
          nameMapRef.current = allowlistAddresses.map(list => list[0]);
          addressIdRef.current = nameMapRef.current.indexOf(blockchain.account);
          if (data.allowlistType == 0) {
            if (addressIdRef.current === -1) {
              setAllowlistUserAmountData(0);
            } else {
              setAllowlistUserAmountData(allowlistAddresses[addressIdRef.current][1]);
            }
          } else if (data.allowlistType == 1) {
            setAllowlistUserAmountData(data.allowlistUserAmount);
          }
        }
      }, [blockchain.account, blockchain.smartContract, data.allowlistType, data.allowlistUserAmount]);
      
      console.log("MintNFT: Calculated allowlistUserAmountData", allowlistUserAmountData);

      const getData = useCallback(() => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
          dispatch(fetchData(blockchain.account));
        }
      }, [blockchain.account, blockchain.smartContract, dispatch]);

      // Config.jsonを読み込むuseEffectを追加
      useEffect(() => {
        const fetchConfig = async () => {
          try {
            const response = await fetch('/config/Config.json');
            const configData = await response.json();
            SET_CONFIG(configData); // Configデータを状態に設定
          } catch (error) {
            console.error('Config.jsonの読み込みに失敗しました', error);
          }
        };

        fetchConfig();
      }, []);

        // 現在のネットワークIDを取得するuseEffect
        useEffect(() => {
          if (window.ethereum) {
            window.ethereum.request({ method: 'eth_chainId' })
              .then(chainId => setCurrentNetworkId(parseInt(chainId, 16)))
              .catch(err => console.error('Failed to get network ID', err));
          }
        }, []);
    
      useEffect(() => {
        getData();
      }, [blockchain.account, getData]);
      
      useEffect(() => {
        getMerkleData();
      }, [data.loading, getMerkleData]);

        // ネットワークを切り替える関数
        const switchNetwork = async () => {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${CONFIG.NETWORK.ID.toString(16)}` }],
            });
          } catch (switchError) {
            console.error('Failed to switch network', switchError);
          }
        };


  return (
        <>
        {blockchain.account === "" || blockchain.smartContract === null ? (
          <div>
            <p>{CONFIG.NETWORK.NAME} Network のウォレットを接続してください。</p>
            <button onClick={connectFunc}>接続</button>
            {blockchain.errorMsg !== "" && <p>{blockchain.errorMsg}</p>}
          </div>
        ) : (
        <div>

            <div className="mint-feedback-container">

            <p>{feedback}</p>

            </div>


          <div className="mint-container">

            <h3>Mint Amount</h3>

            <div className="mint-controls">

              <button className="controls-button" disabled={claimingNft} onClick={decrementMintAmount10}>-10</button>
              <button className="controls-button" disabled={claimingNft} onClick={decrementMintAmount}>-1</button>
              <span className='mint-amount'>{mintAmount}</span>
              <button className="controls-button" disabled={claimingNft} onClick={incrementMintAmount}>+1</button>
              <button className="controls-button" disabled={claimingNft} onClick={incrementMintAmount10}>+10</button>

            </div>

        </div>

        <div className='web3button-container'>
        {currentNetworkId === CONFIG.NETWORK.ID ? (

            <button 
              disabled={claimingNft || isMintButtonDisabled(data, allowlistUserAmountData, claimingNft)}
              onClick={() => {
                claimNFTs();
                getData();
              }}
              className="custom-web3-button"
              onSuccess={handleSuccess}
            >
              {getMintButtonText(data, claimingNft, allowlistUserAmountData)}
            </button>
       ) : (
        <button
          onClick={switchNetwork}
          className="custom-web3-button"
        >
          Switch Network
        </button>
      )}
        </div>

        <div className='credit-card-container'>

            <button 
              hidden={!CONFIG.CREDIT_CARD_MODE}
              disabled={claimingNft || isMintButtonDisabled(data, allowlistUserAmountData)}
              onClick={() => {
                window.location.href = CONFIG.CREDIT_CARD_LINK + "Address=" + blockchain.account + "&quantity=" + mintAmount;
              }}
              className="credit-card-button"
            >
              {getCreditCardMintButtonText(data, claimingNft, allowlistUserAmountData)}
            </button>
        </div>

        {mintSuccess && (
          <div className="mint-success-message">
            🎉ミントが成功しました！🎉
          </div>
        )}

          </div>

        )}
      </>
    );
  }

export default Mint;

// ミントボタンが無効かどうかを決定する関数
function isMintButtonDisabled(data, allowlistUserAmountData, claimingNft) {
  console.log("MintNFT: Checking if mint button should be disabled", {
    claimingNft,
    paused: data.paused,
    onlyAllowlisted: data.onlyAllowlisted,
    allowlistUserAmountData,
    userMintedAmount: data.userMintedAmount.toString(),
    mintCount: data.mintCount,
  });

  if (claimingNft) return true; // ミント中はボタン無効
  if (data.paused) return true; // ミントが一時停止中はボタン無効

  const userMintedAmountNum = parseInt(data.userMintedAmount, 10);
  const allowlistUserAmountNum = parseInt(allowlistUserAmountData, 10);
  const publicSaleMaxMintAmountPerAddressNum = parseInt(data.publicSaleMaxMintAmountPerAddress, 10);

  // アローリスト限定ミントでユーザーがアローリストに含まれていない場合は無効
  if (data.onlyAllowlisted && allowlistUserAmountData === 0) return true;

  // アローリスト限定ミントでユーザーのミント数が上限に達している
  if (data.onlyAllowlisted && data.mintCount && userMintedAmountNum >= allowlistUserAmountNum) return true;
  
  // パブリックセールでユーザーのミント数が上限に達している
  if (!data.onlyAllowlisted && data.mintCount && userMintedAmountNum >= publicSaleMaxMintAmountPerAddressNum) return true;

  return false; // それ以外の場合はボタン有効
}

  
  // ミントボタンのテキストを決定する関数
  function getMintButtonText(data, claimingNft, allowlistUserAmountData) {
    if (claimingNft) return "読み込み中";
    if (data.paused) return "停止中";
    if (data.onlyAllowlisted && allowlistUserAmountData === 0) return "アローリスト限定";

    const userMintedAmountNum = parseInt(data.userMintedAmount, 10);
    const allowlistUserAmountNum = parseInt(allowlistUserAmountData, 10);
    const publicSaleMaxMintAmountPerAddressNum = parseInt(data.publicSaleMaxMintAmountPerAddress, 10);

    if (data.mintCount && ((data.onlyAllowlisted && userMintedAmountNum >= allowlistUserAmountNum) || (!data.onlyAllowlisted && userMintedAmountNum >= publicSaleMaxMintAmountPerAddressNum))) {
      return "上限に達しました";
    }

    return "MINT (ETH)";
  }

  
  // クレジットカード用のミントボタンのテキストを決定する関数
  function getCreditCardMintButtonText(data, claimingNft, allowlistUserAmountData) {
    // ミントボタンの状態テキストを取得
    const mintButtonText = getMintButtonText(data, claimingNft, allowlistUserAmountData);
  
    // 「読み込み中」や「停止中」などの状態はそのまま使用
    if (mintButtonText !== "MINT (ETH)") {
      return mintButtonText;
    }
  
    // スマートフォン表示の閾値（ここでは768pxとします）
    const mobileViewThreshold = 768;
    
    // 現在のビューポートの幅を取得
    const viewportWidth = window.innerWidth;

    // スマートフォン表示の場合、改行を含むテキストを返す
    if (viewportWidth <= mobileViewThreshold) {
      return "MINT\n（クレジットカード）";
    }

    // デスクトップ表示の場合、通常のテキストを返す
    return "MINT (クレジットカード)";
  }
  
  