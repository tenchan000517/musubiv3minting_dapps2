// blockchainActions.js
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";
import { fetchCollectionData } from "./dataActions";
import contracts from '../contracts/config';
import { useWallets } from "@thirdweb-dev/react"; // thirdwebのウォレットフックをインポート
import { fetchSmartContractData } from './dataActions'; // 適切なパスを使用

// Action Types
const CONNECTION_REQUEST = "CONNECTION_REQUEST";
const CONNECTION_SUCCESS = "CONNECTION_SUCCESS";
const CONNECTION_FAILED = "CONNECTION_FAILED";
const UPDATE_ACCOUNT = "UPDATE_ACCOUNT";

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

const updateAccountRequest = (account) => ({
  type: UPDATE_ACCOUNT,
  account,
});

export const connectToBlockchain = () => async (dispatch) => {
  dispatch(connectRequest());

  try {
    const wallets = useWallets(); // thirdwebのウォレットフックを使用
    let web3Provider = null;
    let accounts = null;
    let networkId = null;
    let signer = null;

    // メタマスクが利用可能な場合
    if (window.ethereum && window.ethereum.isMetaMask) {
      web3Provider = new Web3(window.ethereum);
      accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      networkId = await window.ethereum.request({ method: "net_version" });
      signer = web3Provider.eth.getSigner();  // 署名者を取得
    } else {
      // thirdwebのウォレットを使用
      const selectedWallet = wallets[0]; // 最初のウォレットを選択
      web3Provider = new Web3(selectedWallet.provider);
      accounts = [selectedWallet.address];
      networkId = await web3Provider.eth.net.getId();
      signer = selectedWallet.signer;  // 署名者を取得
    }

    Web3EthContract.setProvider(web3Provider);

    const contractInstances = [];
    for (const contractInfo of contracts) {
      if (networkId === contractInfo.networkId) {
        const contractInstance = new Web3EthContract(contractInfo.abi, contractInfo.address);
        contractInstances.push(contractInstance);
      }
    }

    dispatch(connectSuccess({
      account: accounts[0],
      smartContracts: contractInstances,
      web3: web3Provider,
      signer: signer  // 署名者をReduxステートに格納
    }));

    // アカウントとチェーンの変更を監視
    window.ethereum.on("accountsChanged", (accounts) => {
      dispatch(updateBlockchainAccount(accounts[0]));
    });

    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });

    // スマートコントラクトからデータを取得
    // dispatch(fetchSmartContractData());

  } catch (error) {
    dispatch(connectFailed("An error occurred while connecting to the blockchain."));
  }
};

// 新しいアクションタイプ
export const SET_WALLET_DATA = "SET_WALLET_DATA";

export const setWalletData = (walletData) => ({
    type: SET_WALLET_DATA,
    payload: walletData,
});

export const updateBlockchainAccount = (account) => (dispatch) => {
  dispatch(updateAccountRequest(account));
  dispatch(fetchCollectionData(account));
};
