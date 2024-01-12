// 初期状態を更新
const initialState = {
    songs: [],
    nftData: [],  // 新しいプロパティを追加
};

const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SONGS':
            return { ...state, songs: action.payload };
        case 'SET_NFT_DATA':  // 新しいアクションタイプに対する処理
            return { ...state, nftData: action.payload };
        default:
            return state;
    }
};

export default dataReducer;

