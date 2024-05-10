// MintNFT.js
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connect } from '../redux/blockchainActions';
import { fetchMintData } from '../redux/dataActions';
import { allowlistAddresses } from "../allowlist";
import "./MintNFT.css";

const { MerkleTree } = require('merkletreejs');
const { ethers } = require('ethers');
const keccak256 = require('keccak256');

function Mint() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`MINTボタンを押してNFTをミントしてください。`);
  const [mintAmount, setMintAmount] = useState(1);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [allowlistUserAmountData, setAllowlistUserAmountData] = useState(0);
  const [currentNetworkId, setCurrentNetworkId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const newMintCount = useSelector((state) => state.data.newMintCount);
  const burninCount = useSelector((state) => state.data.userBurnedAmount);
  const [showReopenButton, setShowReopenButton] = useState(false);

  const nameMapRef = useRef([]);
  const addressIdRef = useRef(-1);

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

  const connectFunc = useCallback(() => {
    dispatch(connect());
  }, [dispatch]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/config/config.json');
        const configData = await response.json();
        SET_CONFIG(configData);
      } catch (error) {
        console.error('Config.jsonの読み込みに失敗しました', error);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_chainId' })
        .then(chainId => setCurrentNetworkId(parseInt(chainId, 16)))
        .catch(err => console.error('Failed to get network ID', err));
    }
  }, []);

  const decrementMintAmount = useCallback(() => {
    setMintAmount(prevAmount => Math.max(prevAmount - 1, 1));
  }, []);

  const decrementMintAmount10 = useCallback(() => {
    setMintAmount(prevAmount => Math.max(prevAmount - 10, 1));
  }, []);

  const incrementMintAmount = useCallback(() => {
    setMintAmount(prevAmount => prevAmount + 1);
  }, []);

  const incrementMintAmount10 = useCallback(() => {
    setMintAmount(prevAmount => prevAmount + 10);
  }, []);

  const getMerkleData = useCallback(() => {
    if (blockchain.account !== "" && blockchain.mintContract !== null) {
      nameMapRef.current = allowlistAddresses.map(list => list[0]);
      addressIdRef.current = nameMapRef.current.indexOf(blockchain.account);
      if (Number(data.mintData.allowlistType) === 0) {
        if (addressIdRef.current === -1) {
          setAllowlistUserAmountData(0);
        } else {
          setAllowlistUserAmountData(allowlistAddresses[addressIdRef.current][1]);
        }
      } else if (Number(data.mintData.allowlistType) === 1) {
        setAllowlistUserAmountData(Number(data.mintData.allowlistUserAmount));
      }
      console.log("Mint.js: allowlistUserAmountData", allowlistUserAmountData);
    }
  }, [blockchain.account, blockchain.mintContract, data.mintData.allowlistType, data.mintData.allowlistUserAmount, allowlistUserAmountData]);
  
  const getData = useCallback(() => {
    if (blockchain.account !== "" && blockchain.mintContract !== null) {
      dispatch(fetchMintData(blockchain.account));
    }
  }, [blockchain.account, blockchain.mintContract, dispatch]);
  
  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    getMerkleData();
  }, [getMerkleData]);

  const switchNetwork = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CONFIG.NETWORK.ID.toString(16)}` }],
      });
    } catch (switchError) {
      console.error('Failed to switch network', switchError);
    }
  }, [CONFIG.NETWORK.ID]);
    
  const handleSuccess = useCallback((tx) => {
    setMintSuccess(true);
    setShowPopup(true);
  }, []);

  const claimNFTs = useCallback(async () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    let allowlistMaxMintAmount;
    let burnId = 0;
  
    const nameMap = allowlistAddresses.map(list => list[0]);
    const leafNodes = allowlistAddresses.map(addr => ethers.utils.solidityKeccak256(['address', 'uint256'], [addr[0], addr[1]]));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const addressId = nameMap.indexOf(blockchain.account);
  
    let claimingAddress, hexProof;
    if (addressId === -1) {
      allowlistMaxMintAmount = 0;
      claimingAddress = ethers.utils.solidityKeccak256(['address', 'uint256'], [allowlistAddresses[0][0], allowlistAddresses[0][1]]);
      hexProof = merkleTree.getHexProof(claimingAddress);
    } else {
      allowlistMaxMintAmount = allowlistAddresses[addressId][1];
      claimingAddress = ethers.utils.solidityKeccak256(['address', 'uint256'], [allowlistAddresses[addressId][0], allowlistAddresses[addressId][1]]);
      hexProof = merkleTree.getHexProof(claimingAddress);
    }
  
    setFeedback(` ${CONFIG.NFT_NAME} をミントしています。しばらくお待ちください。`);
    setClaimingNft(true);
  
    try {
      const transaction = await blockchain.mintContract.mint(
        mintAmount,
        allowlistMaxMintAmount,
        hexProof,
        burnId,
        {
          value: totalCostWei,
        }
      );

      console.log("Transaction sent:", transaction);
      console.log("Transaction hash:", transaction.hash);

      setFeedback(` ${CONFIG.NFT_NAME} をミントしています。しばらくお待ちください。`);

      const receipt = await transaction.wait();

      console.log("Transaction receipt:", receipt);
      console.log("Transaction status:", receipt.status);
  
      setFeedback(`${CONFIG.NFT_NAME}がミントできました! Opensea.io で確認してみましょう。`);
      setClaimingNft(false);
      dispatch(fetchMintData(blockchain.account));
  
      handleSuccess(receipt);
    } catch (err) {
      console.error("MintNFT: Error in minting NFT", err);
      setFeedback("Sorry, something went wrong please try again later.");
      setClaimingNft(false);
    }
  }, [
    CONFIG.WEI_COST,
    CONFIG.GAS_LIMIT,
    CONFIG.NFT_NAME,
    blockchain.account,
    blockchain.mintContract,
    mintAmount,
    dispatch,
    handleSuccess,
  ]);

  // useCallback を使用してgetMintButtonStatus関数をメモ化
  const getMintButtonStatus = useCallback(
    (mintData, claimingNft, allowlistUserAmountData) => {
      if (!mintData) {
        return { disabled: true, text: "読み込み中" };
      }

      if (claimingNft) {
        return { disabled: true, text: "読み込み中" };
      }

      if (mintData.paused) {
        return { disabled: true, text: "停止中" };
      }

      if (mintData.onlyAllowlisted && allowlistUserAmountData === 0) {
        return { disabled: true, text: "アローリスト限定" };
      }

      const userMintedAmountNum = parseInt(mintData.userMintedAmount, 10);
      const allowlistUserAmountNum = parseInt(allowlistUserAmountData, 10);
      const publicSaleMaxMintAmountPerAddressNum = parseInt(mintData.publicSaleMaxMintAmountPerAddress, 10);

      if (mintData.onlyAllowlisted && mintData.mintCount && userMintedAmountNum >= allowlistUserAmountNum) {
        return { disabled: true, text: "上限に達しました" };
      }

      if (!mintData.onlyAllowlisted && mintData.mintCount && userMintedAmountNum >= publicSaleMaxMintAmountPerAddressNum) {
        return { disabled: true, text: "上限に達しました" };
      }

      return { disabled: false, text: "MINT" };
    },
    []
  );

  // useMemo を使用してmintButtonStatusを計算し、メモ化
  const mintButtonStatus = useMemo(() => getMintButtonStatus(data.mintData, claimingNft, allowlistUserAmountData), [
    data.mintData,
    claimingNft,
    allowlistUserAmountData,
    getMintButtonStatus,
  ]);

  // data.mintData、allowlistUserAmountData、claimingNftが変更された場合にフィードバックテキストを更新
  useEffect(() => {
    let feedbackText = `MINTボタンを押してNFTをミントしてください。`;
  
    console.log("Mint.js: data.mintData", data.mintData);
    console.log("Mint.js: allowlistUserAmountData", allowlistUserAmountData);
  
    if (data.mintData.loading) {
      feedbackText = "読み込み中です。しばらくお待ちください。";
    } else if (data.mintData.paused) {
      if (data.mintData.onlyAllowlisted) {
        if (allowlistUserAmountData === 0) {
          feedbackText = "現在ミントは停止中です。接続したウォレットはアローリストに登録されていません。";
        } else if (Number(data.mintData.userMintedAmount) < allowlistUserAmountData) {
          feedbackText = `現在ミントは停止中です。接続したウォレットはアローリストに登録されていて、あと ${allowlistUserAmountData - Number(data.mintData.userMintedAmount)} 枚ミントできます。`;
        } else {
          feedbackText = "現在ミントは停止中です。ミントの上限に達しました。";
        }
      } else {
        feedbackText = "現在ミントは停止中です。";
      }
    } else {
      if (data.mintData.onlyAllowlisted) {
        if (allowlistUserAmountData === 0) {
          feedbackText = "接続したウォレットはアローリストに登録されていません。";
        } else if (Number(data.mintData.userMintedAmount) < allowlistUserAmountData) {
          feedbackText = `あと ${allowlistUserAmountData - Number(data.mintData.userMintedAmount)} 枚ミントできます。`;
        } else {
          feedbackText = "あなたのアローリストのミントの上限に達しました。";
        }
      } else {
        if (Number(data.mintData.publicSaleMaxMintAmountPerAddress) === 0 || Number(data.mintData.userMintedAmount) < Number(data.mintData.publicSaleMaxMintAmountPerAddress)) {
          feedbackText = `あと ${Number(data.mintData.publicSaleMaxMintAmountPerAddress) === 0 ? "無制限に" : Number(data.mintData.publicSaleMaxMintAmountPerAddress) - Number(data.mintData.userMintedAmount) + "枚"} ミントできます。`;
        } else {
          feedbackText = "ミントの上限に達しました。";
        }
      }
    }
  
    setFeedback(feedbackText);
  }, [data.mintData, allowlistUserAmountData, claimingNft]);

  useEffect(() => {
    if (newMintCount >= 1) {
      setShowReopenButton(true);
    } else {
      setShowReopenButton(false);
    }
  }, [newMintCount]);
  

  return (
    <>
      {blockchain.account === "" || blockchain.mintContract === null ? (
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
              <button className="controls-button" disabled={claimingNft} onClick={decrementMintAmount10}>
                <span className="button-text">-10</span>
              </button>
              <button className="controls-button" disabled={claimingNft} onClick={decrementMintAmount}>
                <span className="button-text">-1</span>
              </button>
              <span className='mint-amount'>{mintAmount}</span>
              <button className="controls-button" disabled={claimingNft} onClick={incrementMintAmount}>
                <span className="button-text">+1</span>
              </button>
              <button className="controls-button" disabled={claimingNft} onClick={incrementMintAmount10}>
                <span className="button-text">+10</span>
              </button>
            </div>
          </div>

          <div className='web3button-container'>
            {currentNetworkId === CONFIG.NETWORK.ID ? (
              <button
                disabled={mintButtonStatus.disabled}
                onClick={() => {
                  claimNFTs();
                  getData();
                }}
                className="custom-web3-button"
                style={{ backgroundColor: '#ffad58' }}

              >
                {mintButtonStatus.text}
              </button>
            ) : (
              <button onClick={switchNetwork} className="custom-web3-button" style={{ backgroundColor: '#ffad58' }}>
              Switch Network
              </button>
            )}
          </div>

          {mintSuccess && (
            <div className="mint-success-message">
              🎉ミントが成功しました！🎉
            </div>
          )}

          {newMintCount >= 1 && (
            <div class="button-container">

            <button className="button" onClick={() => setShowPopup(true)}>
              ポップアップを表示
            </button>
            </div>

          )}

          {showPopup && (
                      <div className="popup">
                        <div className="popup-content">
                          <h3>ミントが成功しました！</h3>
                          <p>次のステップをお選びください。</p>
                          <ul className="task-list">
                            <li>
                              <span className="task-item">ミントする</span>
                              <span className="task-status">{Number(data.mintData.userMintedAmount) !== 0 ? '✅' : '⬜'}</span>
                            </li>
                            <li>
                              <span className="task-item">バー忍する</span>
                              <span className="task-status">{Number(data.burnedTokenIds.length) !== 0 ? '✅' : '⬜'}</span>
                            </li>
                          </ul>
                          <div className="popup-buttons">
                            {Number(data.mintData.userMintedAmount) + Number(data.burnedTokenIds.length) >= 1 && (
                              <button className="popup-button" onClick={() => { setShowPopup(false); window.location.href = '#cartbutton1'; }}>
                                特典受け取り１体
                              </button>
                            )}
                            {Number(data.mintData.userMintedAmount) + Number(data.burnedTokenIds.length) >= 2 && (
                              <button className="popup-button" onClick={() => { setShowPopup(false); window.location.href = '#cartbutton2'; }}>
                                特典受け取り２体
                              </button>
                            )}
                            {Number(data.mintData.userMintedAmount) + Number(data.burnedTokenIds.length) >= 3 && (
                              <button className="popup-button" onClick={() => { setShowPopup(false); window.location.href = '#cartbutton3'; }}>
                                特典受け取り３体
                              </button>
                            )}
                            {Number(data.mintData.userMintedAmount) + Number(data.burnedTokenIds.length) >= 4 && (
                              <button className="popup-button" onClick={() => { setShowPopup(false); window.location.href = '#cartbutton4'; }}>
                                特典受け取り４体以上
                              </button>
                            )}
                            {Number(data.mintData.userMintedAmount) === 0 && Number(data.burnedTokenIds.length) === 0 ? (
                              <button className="popup-button" onClick={() => { setShowPopup(false); window.location.href = '#burnin'; }}>
                                バー忍へ
                              </button>
                            ) : (
                              <>
                                {Number(data.mintData.userMintedAmount) === 0 && (
                                  <button className="popup-button" onClick={() => { setShowPopup(false); window.location.href = '#mint'; }}>
                                    ミントへ
                                  </button>
                                )}
                                {Number(data.burnedTokenIds.length) === 0 && (
                                  <button className="popup-button" onClick={() => { setShowPopup(false); window.location.href = '#burnin'; }}>
                                    バー忍へ
                                  </button>
                                )}
                              </>
                            )}
                          </div>
              </div>
            </div>
          )}

          <div className='opensea-link-container'>
            <a
              href="https://opensea.io/collection/musubicollection"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenSeaでの確認はこちら
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default Mint;