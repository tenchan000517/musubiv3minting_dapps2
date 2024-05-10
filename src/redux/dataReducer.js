// dataReducer.js
const initialState = {
    loading: false,
    cost: 0,
    totalSupply: 0,
    userMintedAmount: 0,
    onlyAllowlisted: true,
    paused: true,
    maxMintAmountPerTransaction: 1,
    mintCount: true,
    publicSaleMaxMintAmountPerAddress: 10,
    allowlistUserAmount: 1,
    allowlistType: 0,
    error: false,
    burnId: 0,
    errorMsg: "",
    totalBurnin: 0,
    userBurnedAmount: 0,
    burnedTokenIds: [],
    tokensOfOwner: [],
    walletData: null,
    songs: [],
    nftData: [],
    smartContractData: {},
    mintData: {},
    burninData: {},
  };
  
  const dataReducer = (state = initialState, action) => {
    switch (action.type) {
      case "CHECK_DATA_REQUEST":
        return {
          ...state,
          loading: true,
          error: false,
          errorMsg: "",
        };
      case "CHECK_DATA_SUCCESS":
        return {
          ...state,
          loading: false,
          ...action.payload,
          error: false,
          errorMsg: "",
        };
      case "CHECK_DATA_FAILED":
        return {
          ...initialState,
          loading: false,
          error: true,
          errorMsg: action.payload,
        };
      case "SET_WALLET_DATA":
        return {
          ...state,
          walletData: action.payload,
        };
      case 'SET_NEW_MINT_COUNT':
        return {
          ...state,
          newMintCount: action.payload,
        };
      case 'SET_USER_BURNED_AMOUNT':
        return {
          ...state,
          userBurnedAmount: action.payload,
        };
      case 'UPDATE_BURNED_TOKEN_IDS':
        return {
          ...state,
          burnedTokenIds: action.payload,
        };
      case 'SET_SONGS':
        return {
          ...state,
          songs: action.payload,
        };
      case 'SET_NFT_DATA':
        return {
          ...state,
          nftData: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default dataReducer;