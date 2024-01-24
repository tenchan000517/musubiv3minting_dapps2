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

    walletData: null, 

    songs: [],
    nftData: [],
    smartContractData: {}, 
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
            totalSupply: action.payload.totalSupply,
            userMintedAmount: action.payload.userMintedAmount,
            paused: action.payload.paused,
            onlyAllowlisted: action.payload.onlyAllowlisted,
            maxMintAmountPerTransaction: action.payload.maxMintAmountPerTransaction,
            mintCount: action.payload.mintCount,
            publicSaleMaxMintAmountPerAddress: action.payload.publicSaleMaxMintAmountPerAddress,
            allowlistUserAmount: action.payload.allowlistUserAmount,
            allowlistType: action.payload.allowlistType,
            burnId: action.payload.burnId,
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

        case "SET_WALLET_DATA": // 新しいケース
        return {
          ...state,
          walletData: action.payload,
        };

        case 'SET_SONGS':
            return { ...state, songs: action.payload };
        case 'SET_NFT_DATA':
            return { ...state, nftData: action.payload };
        default:
            return state;
    }
};

export default dataReducer;

