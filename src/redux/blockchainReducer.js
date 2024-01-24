// blockchainReducer.js
const initialState = {
  loading: false,
  account: null,
  smartContract: null,
  web3: null,
  walletData: null, // 新しい状態
  walletType: null, // ウォレットタイプを保存するための新しい状態
  wallet: null,
  address: null,
  signer: null,
  wrongNetwork: false,
  errorMsg: "",
};

const blockchainReducer = (state = initialState, action) => {
  console.log("blockchainReducer: action received", action);

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
        account: action.payload.account, // ここを修正
        smartContract: action.payload.smartContract,
        web3: action.payload.web3,
        walletData: action.payload.walletData,
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
    case "SET_WALLET_DATA": // 新しいケース
    return {
      ...state,
      walletData: action.payload,
    };
    case "UPDATE_ACCOUNT":
      if (action.account === undefined || action.account === null) {
        console.error("UPDATE_ACCOUNT received invalid account:", action.account);
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
    default:
      return state;
  }
};

export default blockchainReducer;
