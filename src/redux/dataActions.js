// dataActions.js
// const PROXY_SERVER_URL = 'http://162.43.48.49:3006';
const PROXY_SERVER_URL = 'https://ninjadao-fanart-contest.xyz';


const SET_NFT_DATA = "SET_NFT_DATA";
const SET_SMART_CONTRACT_DATA = "SET_SMART_CONTRACT_DATA";

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

// // スマートコントラクトからコレクションデータを取得するためのアクションクリエイター
// export const fetchSmartContractData = () => async (dispatch, getState) => {
//   try {
//     const { blockchain } = getState();
//     if (!blockchain.walletData || !blockchain.walletData.smartContracts.length) {
//       throw new Error("Smart contracts not available");
//     }

//     const smartContract = blockchain.walletData.smartContracts[0]; // ここでは最初のスマートコントラクトを使用
//     console.log("Using Smart Contract at Address:", smartContract.options.address);
//     // スマートコントラクトのメソッドを呼び出して指定されたデータを取得
//     const cost = await smartContract.methods.cost().call();
//     const totalSupply = await smartContract.methods.totalSupply().call();
//     const userMintedAmount = await smartContract.methods.getUserMintedAmount(blockchain.walletData.account).call();
//     const onlyAllowlisted = await smartContract.methods.onlyAllowlisted().call();
//     const paused = await smartContract.methods.paused().call();
//     const maxMintAmountPerTransaction = await smartContract.methods.maxMintAmountPerTransaction().call();
//     const mintCount = await smartContract.methods.mintCount().call();
//     const publicSaleMaxMintAmountPerAddress = await smartContract.methods.publicSaleMaxMintAmountPerAddress().call();
//     const allowlistUserAmount = await smartContract.methods.getAllowlistUserAmount(blockchain.walletData.account).call();
//     const allowlistType = await smartContract.methods.allowlistType().call();

//     // 取得したデータをReduxストアに保存
//     dispatch({
//       type: 'SET_SMART_CONTRACT_DATA',
//       payload: {
//         loading: false,
//         cost,
//         totalSupply,
//         userMintedAmount,
//         onlyAllowlisted,
//         paused,
//         maxMintAmountPerTransaction,
//         mintCount,
//         publicSaleMaxMintAmountPerAddress,
//         allowlistUserAmount,
//         allowlistType,
//         error: false,
//         errorMsg: "",
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching smart contract data:", error);
//     dispatch({
//       type: 'SET_SMART_CONTRACT_DATA',
//       payload: {
//         loading: false,
//         error: true,
//         errorMsg: error.message,
//       },
//     });
//   }
// };

// アクションクリエイター
export const setSmartContractData = (data) => ({
  type: SET_SMART_CONTRACT_DATA,
  payload: data,
});

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
      console.log("Fetched NFT data:", data); // データ取得のロギング

      dispatch(setNFTData(data));  // 取得したデータをReduxステートに保存
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
};
