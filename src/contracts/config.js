// Config.js
import ERC721ABI from './ERC721abi';
// import ERC1155ABI from './ERC1155abi'; // ERC1155の場合はこちらを使用

const Config = {
    PAYMENT_URL: "https://paypiement.xyz/ja/projects/0e483200-a017-4961-9bce-457f2da1cdc8?recipientAddress=",
    CONTRACT_ADDRESS: "0x33E776621c5442DF984AF8E098aEAEF9757f1347",
    SCAN_LINK: "https://goerli.etherscan.io/token/0x7C62A9Fed3e933dffdd849251971689be9dBC092",
    NETWORK: {
        NAME: "goerli",
        SYMBOL: "ETH",
        ID: 5
    },
    NFT_NAME: "kurimaro collection",
    SYMBOL: "KR",
    MAX_SUPPLY: 11,    
    WEI_COST: 30000000000000000,
    DISPLAY_COST: 0.03,
    GAS_LIMIT: 285000,
    MARKETPLACE: "Opeansea",
    MARKETPLACE_LINK: "https://opensea.io/ja/collection/musubicollection",
    LEFT_SIDE_IMAGE: "/logo192.jpg",
    BACKGROUND_IMAGE: "/logo512.jpg",
    SHOW_BACKGROUND: true,
    ABI: ERC721ABI,
    META: {
        title: "Kurimaro Collection",
        description: "Kurimaro Collection MINT",
        image: "/logo512.jpg",
        url: "https://ikimono.nft-mint.xyz/"
    },

        // PAYMENT_URL: "https://paypiement.xyz/ja/projects/0e483200-a017-4961-9bce-457f2da1cdc8?recipientAddress=",
    // CONTRACT_ADDRESS: "0x4ea133Ac69211F3447A49bB6c5F409b623F508a9",
    // CHAIN: "ethereum",
    // MINT_PRICE_ETH: "0.03ETH",
    // MAX_SUPPLY: 10,
    // LEFT_SIDE_IMAGE: "/logo192.jpg",
    // BACKGROUND_IMAGE: "/logo512.jpg",

    //     // メタデータの追加
    //     META: {
    //         title: "Kurimaro Collection",
    //         description: "Kurimaro Collection MINT",
    //         image: "/logo512.jpg", // 例: "https://example.com/image.jpg"
    //         url: "https://ikimono.nft-mint.xyz/", // 例: "https://example.com"
    //     }

    // PAYMENT_URL: "https://paypiement.xyz/ja/projects/0e483200-a017-4961-9bce-457f2da1cdc8?recipientAddress=",
    // CONTRACT_ADDRESS: "0xc152f58F3DD986D4fB019C4B66eAb793deD27288",
    // CHAIN: "polygon",
    // MINT_PRICE_ETH: "FREE",
    // MAX_SUPPLY: "Thanks",
    // LEFT_SIDE_IMAGE: "/sbt.jpg",
    // BACKGROUND_IMAGE: "/thankyou.jpg",

    //     // メタデータの追加
    //     META: {
    //         title: "Thank you stamp☆",
    //         description: "Thank you stamp SBT MINT",
    //         image: "/thankyou.jpg", // 例: "https://example.com/image.jpg"
    //         url: "https://ikimono.nft-mint.xyz/", // 例: "https://example.com"
    //     
    // }
};

export default Config;