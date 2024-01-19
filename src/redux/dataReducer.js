// dataReducer.js
const initialState = {
    songs: [],
    nftData: [],
    smartContractData: {}, // スマートコントラクトデータの初期ステート
};

const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SONGS':
            return { ...state, songs: action.payload };
        case 'SET_NFT_DATA':  // 新しいアクションタイプに対する処理
            return { ...state, nftData: action.payload };
        case 'SET_SMART_CONTRACT_DATA':
            return {
                ...state,
                smartContractData: action.payload, };
        default:
            return state;
    }
};

export default dataReducer;

