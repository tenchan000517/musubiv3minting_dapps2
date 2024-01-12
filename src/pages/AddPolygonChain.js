import React, { useState } from 'react';

function AddPolygonChain() {
  const [isPolygonAdded, setIsPolygonAdded] = useState(false);

  const addPolygonNetwork = async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0x89',
                    chainName: 'Matic(Polygon) Mainnet',
                    nativeCurrency: {
                        name: 'MATIC',
                        symbol: 'MATIC',
                        decimals: 18
                    },
                    rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
                    blockExplorerUrls: ['https://explorer.matic.network/']
                }]
            });
            setIsPolygonAdded(true);
        } catch (error) {
            console.error('ユーザーがネットワークの追加を拒否しました。', error);
        }
    } else {
        console.error('Ethereumのプロバイダーが見つかりません。メタマスクがインストールされていることを確認してください。');
    }
  };

  return (
    <div>
      <h1>ポリゴンチェーンの追加</h1>
      <button onClick={addPolygonNetwork}>ポリゴンチェーンを追加</button>
      {isPolygonAdded && <p>ポリゴンネットワークが追加されました！</p>}
    </div>
  );
}

export default AddPolygonChain;
