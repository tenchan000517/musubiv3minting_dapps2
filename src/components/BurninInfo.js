import React from 'react';
import { useSelector } from 'react-redux';
import { BigNumber } from 'ethers';
import './BurninInfo.css';

function BurninInfo() {
  const newMintCount = useSelector(state => state.data.mintData.userMintedAmount);
  const burninCount = useSelector(state => state.data.burninData.userBurnedAmount);

  // BigNumber を適切に扱う関数
  const formatBigNumber = (bigNumber) => {
    if (BigNumber.isBigNumber(bigNumber)) {
      return bigNumber.toString(); // BigNumber が正しくあれば文字列に変換
    }
    return '0'; // BigNumber でない場合は '0' を返す
  };

  return (
    <div className="burnin-info-container">
      <div className="mint-burnin-info">
        <p>新規発行: {formatBigNumber(newMintCount)}</p>
        <p>バー忍: {(burninCount)}</p>
      </div>
    </div>
  );
}

export default BurninInfo;