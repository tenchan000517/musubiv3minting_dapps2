// blockchainReducer.js
const initialState = {
  loading: false,
  errorMsg: "",
  walletData: null, 
  };
  
  const blockchainReducer = (state = initialState, action) => {
    switch (action.type) {
      case "CONNECTION_REQUEST":
        return {
          ...initialState,
          loading: true,
        };
      case "CONNECTION_SUCCESS":
        return {
          ...state,
          loading: false,
          walletData: {
            account: action.payload.account,
            web3: action.payload.web3,
            signer: action.payload.signer,
            smartContracts: action.payload.smartContracts,
          },
        };
      case "CONNECTION_FAILED":
        return {
          ...initialState,
          loading: false,
          errorMsg: action.payload,
        };
      // case "UPDATE_ACCOUNT":
      //   return {
      //     ...state,
      //     account: action.payload.account,
      //   };
      // case 'UPDATE_WALLET':
      //   return {
      //       ...state,
      //       walletAddress: action.payload.address,
      //       signer: action.payload.signer,
      //   };
      case "SET_WALLET_DATA":
        return {
            ...state,
            walletData: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default blockchainReducer;
  