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
      return bigNumber.toNumber(); // BigNumber が正しくあれば数値に変換
    }
    return 0; // BigNumber でない場合は 0 を返す
  };

  // 表示用の値を取得する関数
  const getDisplayValue = (value) => {
    if (typeof value === 'string') {
      return parseInt(value, 10) || 0; // 文字列の場合は整数に変換し、変換できない場合は 0 を返す
    }
    return formatBigNumber(value); // BigNumber の場合は formatBigNumber 関数を使って数値に変換
  };

  return (
    <div className="burnin-info-container">
      <div className="mint-burnin-info">
        <p>新規発行: {getDisplayValue(newMintCount)}</p>
        <p>バー忍: {getDisplayValue(burninCount)}</p>
      </div>
    </div>
  );
}

export default BurninInfo;