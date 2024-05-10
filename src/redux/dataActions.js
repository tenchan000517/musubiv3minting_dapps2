// dataActions.js
import store from "./store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchMintData = (account) => {
  return async (dispatch) => {
    // console.log("fetchMintData: データ取得開始");

    dispatch(fetchDataRequest());
    try {
      const blockchain = store.getState().blockchain;
      const mintContract = blockchain.mintContract;
      // console.log("fetchMintData: mintContract", mintContract);

      let totalSupply = await mintContract.totalSupply();
      let userMintedAmount = await mintContract.getUserMintedAmount(account);
      let paused = await mintContract.paused();
      let onlyAllowlisted = await mintContract.onlyAllowlisted();
      let maxMintAmountPerTransaction = await mintContract.maxMintAmountPerTransaction();
      let mintCount = await mintContract.mintCount();
      let publicSaleMaxMintAmountPerAddress = await mintContract.publicSaleMaxMintAmountPerAddress();
      let allowlistUserAmount = await mintContract.getAllowlistUserAmount(account);
      let allowlistType = await mintContract.allowlistType();

       console.log("fetchMintData: Mint.js データ", {
         totalSupply,
         userMintedAmount,
         paused,
         onlyAllowlisted,
         maxMintAmountPerTransaction,
         mintCount,
         publicSaleMaxMintAmountPerAddress,
         allowlistUserAmount,
         allowlistType,
       });

      dispatch(fetchDataSuccess({
        mintData: {
          totalSupply,
          userMintedAmount,
          paused,
          onlyAllowlisted,
          maxMintAmountPerTransaction,
          mintCount,
          publicSaleMaxMintAmountPerAddress,
          allowlistUserAmount,
          allowlistType,
        }
      }));

      // console.log("fetchMintData: データ取得成功");

    } catch (err) {
      // console.error("fetchMintData: エラー発生", err);
      dispatch(fetchDataFailed("Could not load data from mint contract."));
    }
  };
};

export const fetchBurninData = (account) => {
  return async (dispatch) => {
    console.log("fetchBurninData: データ取得開始");

    dispatch(fetchDataRequest());
    try {
      const blockchain = store.getState().blockchain;
      const burninContract = blockchain.burninContract;
      console.log("fetchBurninData: burninContract", burninContract);

      // Configファイルを非同期で読み込む
      const configResponse = await fetch("/config/Config.json");
      const config = await configResponse.json();

      // 現在のネットワークIDを取得
      const currentNetworkId = await window.ethereum.request({ method: 'eth_chainId' });

      // config.NETWORK.IDと比較
      if (currentNetworkId !== `0x${config.NETWORK.ID.toString(16)}`) {
        console.log("fetchBurninData: ネットワークが異なるため、データ取得をスキップします");
        return;
      }

//      const currentPhase = (await burninContract.burninPhase()).toNumber(); // バーニングフェーズを取得

      let totalBurnin, userBurnedAmount, paused, onlyAllowlisted, maxBurnAmountPerTransaction, burnCount, publicSaleMaxBurnAmountPerAddress, allowlistUserAmount, allowlistType, tokensOfOwner, burnedTokenIds;

//      let totalBurnin = await burninContract.totalBurnin();  // 総バーン数
//      let userBurnedAmount = await burninContract.userBurnedAmountByPhase(currentPhase, account);
//      let paused = await burninContract.paused();  // バーン機能の一時停止状態
//      let onlyAllowlisted = await burninContract.onlyAllowlisted();  // ホワイトリスト制限の有無
//      let maxBurnAmountPerTransaction = await burninContract.maxBurnAmountPerTransaction();  // トランザクションごとの最大バーン数
//      let burnCount = await burninContract.burnCount();  // バーンカウント
//      let publicSaleMaxBurnAmountPerAddress = await burninContract.publicSaleMaxBurnAmountPerAddress();  // パブリックセールでのアドレスごとの最大バーン数
//      let allowlistUserAmount = await burninContract.getAllowlistUserAmount(account);  // ホワイトリストユーザーの許可数
//      let allowlistType = await burninContract.allowlistType();  // ホワイトリストのタイプ
//      let tokensOfOwner = await burninContract.nftTokensOfOwner(account);  // ユーザーの所有トークンID一覧
//      let burnedTokenIds = await burninContract.burnedTokenIds();

      try {
        totalBurnin = await burninContract.totalBurnin();
      } catch (err) {
        console.error("Error fetching totalBurnin:", err);
      }

      try {
        const currentPhase = await burninContract.burninPhase();
        userBurnedAmount = await burninContract.userBurnedAmountByPhase(currentPhase, account);
      } catch (err) {
        console.error("Error fetching userBurnedAmount:", err);
      }

      try {
        paused = await burninContract.paused();
      } catch (err) {
        console.error("Error fetching totalBurnin:", err);
      }

      try {
        onlyAllowlisted = await burninContract.onlyAllowlisted();
      } catch (err) {
        console.error("Error fetching userBurnedAmount:", err);
      }

      try {
        tokensOfOwner = await burninContract.nftTokensOfOwner(account);
      } catch (err) {
        console.error("Error fetching totalBurnin:", err);
      }

      try {
        burnedTokenIds = await burninContract.burnedTokenIds();
        dispatch(updateBurnedTokenIds(burnedTokenIds));
      } catch (err) {
        console.error("Error fetching userBurnedAmount:", err);
      }

      // console.log("fetchBurninData: Burnin.js データ", {
      //  totalBurnin,
      //  userBurnedAmount,
      //  tokensOfOwner,
      //  burnedTokenIds,
      //  paused,
      //  onlyAllowlisted,
      // });

      dispatch(fetchDataSuccess({
        burninData: {
          totalBurnin,
          userBurnedAmount: userBurnedAmount.toString(),
          tokensOfOwner,
          burnedTokenIds,
          paused,
          onlyAllowlisted,
        }
      }));

      console.log("fetchBurninData: データ取得成功");

    } catch (err) {
      // console.error("fetchBurninData: エラー発生", err);
      dispatch(fetchDataFailed("Could not load data from burnin contract."));
    }
  };
};

export const updateBurnedTokenIds = (burnedTokenIds) => {
  return {
    type: 'UPDATE_BURNED_TOKEN_IDS',
    payload: burnedTokenIds,
  };
};


// const PROXY_SERVER_URL = 'http://162.43.48.49:3006';
const PROXY_SERVER_URL = 'https://ninjadao-fanart-contest.xyz';

const SET_NFT_DATA = "SET_NFT_DATA";

const setNFTData = (newData) => (dispatch, getState) => {
  const existingData = getState().data.nftData;
  const uniqueData = newData.filter(newItem => 
    !existingData.some(existingItem => existingItem.tokenId === newItem.tokenId)
  );
  dispatch({
    type: SET_NFT_DATA,
    payload: [...existingData, ...uniqueData]
  });
};

export const fetchCollectionData = (walletAddress, contractAddress, abi) => async (dispatch, getState) => {
  try {
    const response = await fetch(`${PROXY_SERVER_URL}/fetch-nft-metadata`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            walletAddress: walletAddress,
            contractAddress: contractAddress,
            abi: abi
        })
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
    }

    const newData = await response.json();

    dispatch(setNFTData(newData)); // ここで setNFTData を呼び出す
  } catch (error) {
    // console.error("Error fetching collection data:", error);
  }
};

// ベースURIからデータをフェッチするためのアクション
export const fetchDataFromBaseURI = (baseURI) => async (dispatch) => {
    try {
      const response = await fetch(`${PROXY_SERVER_URL}/fetch-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ baseURI })
      });
  
      const data = await response.json();
      // console.log("Fetched NFT data:", data); 

      dispatch(setNFTData(data));  
  
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
};

export const fetchNewMintCount = (account) => async (dispatch) => {
  try {
    const blockchain = store.getState().blockchain;
    const mintContract = blockchain.mintContract;
    const newMintCount = await mintContract.getUserMintedAmount(account);
    dispatch({ type: 'SET_NEW_MINT_COUNT', payload: newMintCount });
  } catch (err) {
    // console.error("Error fetching new mint count", err);
  }
};

export const fetchUserBurnedAmount = (account) => async (dispatch) => {
  try {
    const blockchain = store.getState().blockchain;
    const burninContract = blockchain.burninContract;
    const userBurnedAmount = await burninContract.userBurnedAmount(account);
    dispatch({ type: 'SET_USER_BURNED_AMOUNT', payload: userBurnedAmount });
  } catch (err) {
    // console.error("Error fetching user burned amount", err);
  }
};