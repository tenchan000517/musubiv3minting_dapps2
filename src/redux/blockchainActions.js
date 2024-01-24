// import Web3EthContract from "web3-eth-contract";
// import Web3 from "web3";
import { ethers } from "ethers";

import { fetchData } from "./dataActions";

// Action Types
const CONNECTION_REQUEST = "CONNECTION_REQUEST";
const CONNECTION_SUCCESS = "CONNECTION_SUCCESS";
const CONNECTION_FAILED = "CONNECTION_FAILED";
const UPDATE_ACCOUNT = "UPDATE_ACCOUNT";
const SET_WALLET_DATA = "SET_WALLET_DATA";
const DISCONNECT = "DISCONNECT";

// Action Creators
const connectRequest = () => ({
  type: CONNECTION_REQUEST,
});

const connectSuccess = (payload) => ({
  type: CONNECTION_SUCCESS,
  payload,
});

const connectFailed = (error) => ({
  type: CONNECTION_FAILED,
  error,
});

const updateAccountRequest = ({ account }) => ({
  type: UPDATE_ACCOUNT,
  account,
});

const setWalletData = (payload) => ({ 
  type: SET_WALLET_DATA, 
  payload 
}); 

export const disconnect = () => {
  return (dispatch) => {
      dispatch({
          type: DISCONNECT,
      });
  };
};

export const connect = (walletData) => async (dispatch) => {
  console.log("connect: 開始");
  console.log("Received walletData:", walletData);

  dispatch(connectRequest());

  if (!walletData || !walletData.signer || !walletData.account) {
    console.error("connect: Invalid walletData", walletData);
    dispatch(connectFailed("Invalid wallet data"));
    return;
  }
  
  const { signer, account } = walletData;
  console.log("Extracted data:", { account, signer });

  try {

        // Configファイルを非同期で読み込む
        const configResponse = await fetch("/config/config.json");
        const config = await configResponse.json();
    
        // ABIファイルのパスを構築
        const abiPath = `/config/${config.useABI}abi.json`;
    
        // ABIを動的に読み込む
        const abiResponse = await fetch(abiPath);
        const abi = await abiResponse.json();

    // コントラクトインスタンスの作成
    const contractInstance = new ethers.Contract(config.CONTRACT_ADDRESS, abi, signer);
    console.log("connect: Contract instance", { contractInstance });

    dispatch(connectSuccess({
      account: walletData.account, 
      smartContract: contractInstance,
    }));

    // アカウントとチェーンの変更を監視
    window.ethereum.on("accountsChanged", (accounts) => {
      console.log("accountsChanged event triggered", accounts);

      if (accounts.length === 0) {
        console.log("No accounts found, dispatching disconnect");

        // アカウントが存在しない場合（ウォレットが切断された場合）
        dispatch(disconnect());
      } else {
        console.log("Account changed, dispatching updateAccount", accounts[0]);

        // アカウントが存在する場合
        dispatch(updateAccount(accounts[0]));
      }
    });

    window.ethereum.on("chainChanged", () => {
      console.log("chainChanged event triggered, reloading page");

      window.location.reload();
    });

  } catch (error) {
    console.error("connect: エラー発生", error);

    dispatch(connectFailed("An error occurred while connecting to the blockchain."));
  }
};

// setWalletDataアクション（新しく追加）
export const updateWalletData = (walletData) => {
  console.log("updateWalletData: 開始");

  return (dispatch) => {
    dispatch(setWalletData(walletData));
    console.log("Received setWalletData in setWalletData action:", walletData);

  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    if (account) {
      console.log("Valid account detected, dispatching updateAccountRequest and fetchData", account);
      dispatch(updateAccountRequest({ account }));
      dispatch(fetchData(account));
    } else {
      console.log("Invalid account detected (undefined or null), dispatching disconnect");
      dispatch(disconnect());
    }
  };
};
