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

export const fetchData = (account) => {
  return async (dispatch) => {
    console.log("fetchData: データ取得開始");

    dispatch(fetchDataRequest());
    try {
      const blockchain = store.getState().blockchain;
      const smartContract = blockchain.smartContract;

      // BigNumber型の値はそのまま保存
      const totalSupply = await smartContract.totalSupply();
      const userMintedAmount = await smartContract.getUserMintedAmount(account);
      const paused = await smartContract.paused();
      const onlyAllowlisted = await smartContract.onlyAllowlisted();
      const maxMintAmountPerTransaction = await smartContract.maxMintAmountPerTransaction();
      const mintCount = await smartContract.mintCount();
      const publicSaleMaxMintAmountPerAddress = await smartContract.publicSaleMaxMintAmountPerAddress();
      const allowlistUserAmount = await smartContract.getAllowlistUserAmount(account);
      const allowlistType = await smartContract.allowlistType();

      // データをReduxのステートに保存
      dispatch(fetchDataSuccess({
        totalSupply,
        userMintedAmount,
        paused,
        onlyAllowlisted,
        maxMintAmountPerTransaction,
        mintCount,
        publicSaleMaxMintAmountPerAddress,
        allowlistUserAmount,
        allowlistType,
      }));

      console.log("fetchData: データ取得成功", {
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

    } catch (err) {
      console.error("fetchData: エラー発生", err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
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
    console.error("Error fetching collection data:", error);
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
      console.log("Fetched NFT data:", data); 

      dispatch(setNFTData(data));  
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
};
