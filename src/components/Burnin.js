// burnin.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connect } from '../redux/blockchainActions';
import { fetchBurninData, updateBurnedTokenIds } from '../redux/dataActions';
import { ethers } from 'ethers';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { allowlistAddresses } from "../allowlist";

function Burnin() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`ボタンを押してNFTをバー忍してください。`);
  const [burnTokenIdNumber, setBurnTokenIdNumber] = useState(0);
  const [filterdTokenIds, setFilterdTokenIds] = useState([0]);
  const [allowlistUserAmountData, setAllowlistUserAmountData] = useState(0);
  const [currentNetworkId, setCurrentNetworkId] = useState(null);
  const baseurl = "https://musubicollection.xyz/data/images/";
  const baseextention = ".png"
  const [showPopup, setShowPopup] = useState(false);
  const newMintCount = useSelector((state) => state.data.newMintCount);
  const burninCount = useSelector((state) => state.data.userBurnedAmount);
  const [burninBaseurl] = useState("https://musubicollection.xyz/data/v3images/");
  const [showReopenButton, setShowReopenButton] = useState(false);


  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    TOKEN_ID_RANGE: {
      START: 0,
      END: 0,
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
    CREDIT_CARD_MODE: false,
    CREDIT_CARD_LINK: ""
  });

  // useCallback を使用してconnectFunc関数をメモ化し、不要な再生成を避ける
  const connectFunc = useCallback(() => {
    dispatch(connect());
  }, [dispatch]);

  // コンポーネントのマウント時にConfig.jsonを取得
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/config/config.json');
        const configData = await response.json();
        SET_CONFIG(configData.BURNIN);
      } catch (error) {
        console.error('Config.jsonの読み込みに失敗しました', error);
      }
    };
  
    fetchConfig();
  }, []);

  // ネットワークIDの取得と設定
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_chainId' })
        .then(chainId => setCurrentNetworkId(parseInt(chainId, 16)))
        .catch(err => console.error('Failed to get network ID', err));
    }
  }, []);

  // data.tokensOfOwnerとdata.burnedTokenIdsの変更に基づいてfilteredTokenIdsを計算
  const filteredTokenIds = useMemo(() => {
    if (!data.burninData.tokensOfOwner || !data.burninData.burnedTokenIds) {
      return [];
    }

    let filtered = data.burninData.tokensOfOwner.filter(tokenId => !data.burninData.burnedTokenIds.includes(tokenId));

    if (CONFIG.TOKEN_ID_RANGE) {
      filtered = filtered.filter(tokenId =>
        tokenId >= CONFIG.TOKEN_ID_RANGE.START && tokenId <= CONFIG.TOKEN_ID_RANGE.END
      );
    }

    return filtered;
  }, [data.burninData.tokensOfOwner, data.burninData.burnedTokenIds, CONFIG.TOKEN_ID_RANGE]);

  // const filteredTokenIds = useMemo(() => {
  //   if (!data.burninData.tokensOfOwner) {
  //     return [];
  //   }
  
  //   let filtered = data.burninData.tokensOfOwner;
  
  //   if (CONFIG.TOKEN_ID_RANGE) {
  //     filtered = filtered.filter(tokenId =>
  //       tokenId >= CONFIG.TOKEN_ID_RANGE.START && tokenId <= CONFIG.TOKEN_ID_RANGE.END
  //     );
  //   }
  
  //   return filtered;
  // }, [data.burninData.tokensOfOwner, CONFIG.TOKEN_ID_RANGE]);


  // filteredTokenIdsの変更に基づいてfillterdTokenIdsを更新
  useEffect(() => {
    setFilterdTokenIds(filteredTokenIds);
  }, [filteredTokenIds]);

  // useCallback を使用してdecrementBurnTokenIdNumber関数をメモ化
  const decrementBurnTokenIdNumber = useCallback(() => {
    setBurnTokenIdNumber(prevNumber => Math.max(prevNumber - 1, 0));
  }, []);

  // useCallback を使用してincrementBurnTokenIdNumber関数をメモ化
  const incrementBurnTokenIdNumber = useCallback(() => {
    setBurnTokenIdNumber(prevNumber => Math.min(prevNumber + 1, filterdTokenIds.length - 1));
  }, [filterdTokenIds]);

  // useCallback を使用してgetMerkleData関数をメモ化
  const getMerkleData = useCallback(() => {
    if (blockchain.account !== "" && blockchain.burninContract !== null) {
      const nameMap = allowlistAddresses.map(list => list[0]);
      const addressId = nameMap.indexOf(blockchain.account);
      if (addressId === -1) {
        setAllowlistUserAmountData(0);
      } else {
        setAllowlistUserAmountData(allowlistAddresses[addressId][1]);
      }
    }
  }, [blockchain.account, blockchain.burninContract]);

  // useCallback を使用してgetData関数をメモ化
  const getData = useCallback(() => {
    if (blockchain.account !== "" && blockchain.burninContract !== null) {
      dispatch(fetchBurninData(blockchain.account));
    }
  }, [blockchain.account, blockchain.burninContract, dispatch]);
  
  useEffect(() => {
    getData();
  }, [getData]);

  // data.loadingまたはgetMerkleDataが変更された場合にgetMerkleData関数を実行
  useEffect(() => {
    getMerkleData();
  }, [getMerkleData]);

  // バーンされたトークンIDを取得し、更新する
  useEffect(() => {
    const fetchBurnedTokenIds = async () => {
      if (blockchain.burninContract) {
        const burnedTokenIds = await blockchain.burninContract.burnedTokenIds();
        const burnedTokenIdsArray = burnedTokenIds.map(id => id.toString());
        console.log("バーニン済みトークンID:", burnedTokenIdsArray);
        
        dispatch(updateBurnedTokenIds(burnedTokenIdsArray));
        
      }
    };

    fetchBurnedTokenIds();
  }, [blockchain.burninContract, dispatch]);

  // useCallback を使用してswitchNetwork関数をメモ化
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

  // useCallback を使用してburnNFTs関数をメモ化
  const burnNFTs = useCallback(async () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * 1);
    let totalGasLimit = String(gasLimit * 1);
    let allowlistMaxMintAmount;

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

    setFeedback(` ${CONFIG.NFT_NAME} をバー忍しています。しばらくお待ちください。`);
    setClaimingNft(true);

    try {
      const transaction = await blockchain.burninContract.burnin(
        allowlistMaxMintAmount,
        hexProof,
        filterdTokenIds[burnTokenIdNumber],
        {
          value: totalCostWei,
        }
      );

      setFeedback(`トランザクションを取得しました。承認されるまでしばらくお待ちください。`);

      await transaction.wait();

      setFeedback(`🎉${CONFIG.NFT_NAME}がバー忍できました!🎉 Opensea.io で確認してみましょう。`);
      setClaimingNft(false);
      dispatch(fetchBurninData(blockchain.account));
      setShowPopup(true);

    } catch (err) {
      console.error("Burnin: Error in burning NFT", err);
      setFeedback("トランザクションが失敗しました。もう一度お試しください。");
      setClaimingNft(false);
    }
  }, [
    CONFIG.WEI_COST,
    CONFIG.GAS_LIMIT,
    CONFIG.NFT_NAME,
    blockchain.account,
    blockchain.burninContract,
    filterdTokenIds,
    burnTokenIdNumber,
    dispatch,
  ]);

  // useCallback を使用してgetBurnButtonStatus関数をメモ化
  const getBurnButtonStatus = useCallback(
    (burninData, claimingNft, allowlistUserAmountData) => {
      if (!burninData) {
        return { disabled: true, text: "読み込み中" };
      }
  
      if (claimingNft) {
        return { disabled: true, text: "読み込み中" };
      }
  
      if (burninData.paused) {
        return { disabled: true, text: "停止中" };
      }
  
      if (CONFIG.onlyAllowlisted) {
        if (allowlistUserAmountData === 0) {
          return { disabled: true, text: "アローリスト限定" };
        }
  
        if (burninData.userBurnedAmount >= allowlistUserAmountData - burninCount) {
          return { disabled: true, text: "上限に達しました" };
        }
      }
  
      if (data.burninData.burnedTokenIds && filterdTokenIds[burnTokenIdNumber] && data.burninData.burnedTokenIds.some(burnedTokenId => burnedTokenId.eq(filterdTokenIds[burnTokenIdNumber]))) {
        return { disabled: true, text: "バー忍済みです" };
      }
  
      return { disabled: false, text: "バー忍" };
    },
    [CONFIG.onlyAllowlisted, data.burninData.burnedTokenIds, filterdTokenIds, burnTokenIdNumber, burninCount]
  );

  // useMemo を使用してburnButtonStatusを計算し、メモ化
  const burnButtonStatus = useMemo(() => getBurnButtonStatus(data.burninData, claimingNft, allowlistUserAmountData), [
    data.burninData,
    claimingNft,
    allowlistUserAmountData,
    getBurnButtonStatus,
  ]);

  // data、allowlistUserAmountData、claimingNftが変更された場合にフィードバックテキストを更新
useEffect(() => {
  let feedbackText = `ボタンを押してNFTをバー忍してください。`;

  if (currentNetworkId !== CONFIG.NETWORK.ID) {
    feedbackText = "ネットワークをEthereumチェーンに変えてください";
  } else if (data.burninData.loading) {
    feedbackText = "読み込み中です。しばらくお待ちください。";

  } else if (data.burninData.paused) {
    if (CONFIG.onlyAllowlisted) {
      if (allowlistUserAmountData === 0) {
        feedbackText = "現在バー忍は停止中です。接続したウォレットはアローリストに登録されていません。";
      } else if (data.burninData.userBurnedAmount < allowlistUserAmountData - burninCount) {
        feedbackText = `現在バー忍は停止中です。接続したウォレットはアローリストに登録されていて、あと ${allowlistUserAmountData - burninCount - data.burninData.userBurnedAmount} 枚バー忍できます。`;
      } else {
        feedbackText = "現在バー忍は停止中です。バー忍の上限に達しました。";
      }
    } else {
      feedbackText = "現在バー忍は停止中です。";
    }
  } else {
    if (CONFIG.onlyAllowlisted) {
      if (allowlistUserAmountData === 0) {
        feedbackText = "接続したウォレットはアローリストに登録されていません。";
      } else if (data.burninData.userBurnedAmount < allowlistUserAmountData - burninCount) {
        feedbackText = `あと ${allowlistUserAmountData - burninCount - data.burninData.userBurnedAmount} 枚バー忍できます。`;
      } else {
        feedbackText = "あなたのアローリストのミントの上限に達しました。";
      }
    } else if (filteredTokenIds.length === 0) {
      feedbackText = "バー忍可能なNFTがありません。";
    } else {
      feedbackText = `バー忍するNFTを選んでください。`;
    }
  }

  setFeedback(feedbackText);
}, [CONFIG.onlyAllowlisted, data.burninData, allowlistUserAmountData, claimingNft, filteredTokenIds.length, burninCount, currentNetworkId, CONFIG.NETWORK.ID]);
  
  useEffect(() => {
    if (burninCount >= 1) {
      setShowReopenButton(true);
    } else {
      setShowReopenButton(false);
    }
  }, [burninCount]);

  console.log(burninCount)

  useEffect(() => {
    console.log('showPopup:', showPopup);
  }, [showPopup]);

return (
  <>
    <div className="image-container" id="burnin">
    {filteredTokenIds.length > 0 && burnTokenIdNumber >= 0 && burnTokenIdNumber < filteredTokenIds.length ? (
        <img
          className="image-style"
          key={filteredTokenIds[burnTokenIdNumber]}
          src={data.burninData.burnedTokenIds.some(burnedTokenId => burnedTokenId.eq(filteredTokenIds[burnTokenIdNumber]))
            ? `${burninBaseurl}${filteredTokenIds[burnTokenIdNumber]}${baseextention}`
            : `${baseurl}${filteredTokenIds[burnTokenIdNumber]}${baseextention}`}
          alt={`Token ID ${filteredTokenIds[burnTokenIdNumber]}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/config/images/left.png";
          }}
        />
      ) : (
        <div
          style={{
            backgroundImage: `url(/config/images/left.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "300px",
            height: "300px",
            margin: "auto",
          }}
        >

        </div>
      )}
    </div>

    {blockchain.account === "" || blockchain.burninContract === null ? (
      <div>
        <p>{CONFIG.NETWORK.NAME} Network のウォレットを接続してください。</p>
        <button onClick={connectFunc}>接続</button>
        {blockchain.errorMsg !== "" && <p>{blockchain.errorMsg}</p>}
      </div>
    ) : (
      <div>

        <div className="sale-type">
          <span className="sale-type-text">{CONFIG.onlyAllowlisted ? "ALセール" : "パブリックセール"}</span>
        </div>

        <div className="mint-feedback-container">
          <p>{feedback}</p>
        </div>

        {!data.loading && filteredTokenIds.length !== 0 && (
            <>
              <div className="mint-container">
                <h3>Burn Token ID</h3>
                <div className="mint-controls">
                  <button className="controls-button" disabled={claimingNft} onClick={decrementBurnTokenIdNumber}>
                    ＜
                  </button>
                  <span className="mint-amount">{filteredTokenIds[burnTokenIdNumber]?.toString()}</span>
                  <button className="controls-button" disabled={claimingNft} onClick={incrementBurnTokenIdNumber}>
                    ＞
                  </button>
                </div>
              </div>

              <p>バー忍した後は、メタデータをリフレッシュしてください。</p>
            </>
          )}

        <div className="web3button-container">
          {currentNetworkId === CONFIG.NETWORK.ID ? (
            <button
              disabled={burnButtonStatus.disabled}
              onClick={() => {
                burnNFTs();
                getData();
              }}
              className="custom-web3-button"
            >
              {burnButtonStatus.text}
            </button>
          ) : (
            <button onClick={switchNetwork} className="custom-web3-button">
              Switch Network
            </button>
          )}
        </div>

        <div className="button-container">
            <button className="button" onClick={() => setShowPopup(true)}>
              ミント・バー忍状況
            </button>
          </div>

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h3>バー忍が成功しました！</h3>
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
                {Number(data.mintData.userMintedAmount) === 0 && Number(data.burninData.userBurnedAmount) === 0 ? (
                  <button className="popup-button" onClick={() => { setShowPopup(false); window.location.href = '#mint'; }}>
                    ミントへ
                  </button>
                ) : (
                  <>
                    {Number(data.mintData.userMintedAmount) === 0 && (
                      <button className="popup-button" onClick={() => { setShowPopup(false); window.location.href = '#mint'; }}>
                        ミントへ
                      </button>
                    )}
                    {Number(data.burninData.userBurnedAmount) === 0 && (
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

        <div className="opensea-link-container">
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

export default Burnin;