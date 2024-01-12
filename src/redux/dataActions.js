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
      console.log("Fetched NFT data:", data); // データ取得のロギング

      dispatch(setNFTData(data));  // 取得したデータをReduxステートに保存
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
};
