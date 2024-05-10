// blockchainReducer.js
const initialState = {
  loading: false,
  account: null,
  mintContract: null,
  burninContract: null,
  smartContract: null,
  web3: null,
  walletData: null,
  walletType: null,
  wallet: null,
  walletInstance: null,

  address: null,
  signer: null,
  wrongNetwork: false,
  errorMsg: "",
  transactionInfo: {
    status: "",
    hash: "",
    receipt: null,
    error: "",
  },

};

const blockchainReducer = (state = initialState, action) => {
  // console.log("blockchainReducer: action received", action);

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
        account: action.payload.account,
        smartContract: action.payload.smartContract,
        mintContract: action.payload.mintContract,
        burninContract: action.payload.burninContract,
        web3: action.payload.web3,
        walletData: action.payload.walletData,
        walletInstance: action.payload.walletInstance,
        signer: action.payload.signer,
      };
    case "CONNECTION_FAILED":
      return {
        ...initialState,
        loading: false,
        errorMsg: action.payload,
      };
    case "WRONG_NETWORK":
      return {
        ...state,
        loading: false,
        wrongNetwork: true,
      };
    case "SET_WALLET_DATA":
    return {
      ...state,
      walletData: action.payload,
    };
    case "UPDATE_ACCOUNT":
      if (action.account === undefined || action.account === null) {
        // console.error("UPDATE_ACCOUNT received invalid account:", action.account);
        return { ...state }; // 無効なアカウントの場合、状態を変更せずに現在の状態を返す
      }
      return {
        ...state,
        account: action.account.account,
      };
    case "DISCONNECT":
      return {
        ...initialState
      };
    case "SET_TRANSACTION_INFO":
        return {
          ...state,
          transactionInfo: action.payload,
        };
    default:
      return state;
  }
};

export default blockchainReducer;
