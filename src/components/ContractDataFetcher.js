// ContractDataFetcher.js
import React, { useEffect } from 'react';
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { useDispatch } from 'react-redux';
import { setSmartContractData } from '../redux/dataActions';

const ContractDataFetcher = ({ contractAddress }) => {
  const dispatch = useDispatch();
  const { contract } = useContract(contractAddress);

  const { data: totalSupply } = useContractRead(contract, "totalSupply");
  const { data: totalMinted } = useContractRead(contract, "totalMinted");
  const { data: maxTotalSupply } = useContractRead(contract, "maxTotalSupply");

  useEffect(() => {
    dispatch(setSmartContractData({ totalSupply, totalMinted, maxTotalSupply }));

      // コンソールにデータを出力
      console.log(`Total Supply: ${totalSupply}`);
      console.log(`Total Minted: ${totalMinted}`);
      console.log(`Max Total Supply: ${maxTotalSupply}`);
    }, [totalSupply, totalMinted, maxTotalSupply, dispatch]);

  return null; // このコンポーネントはUIをレンダリングしません
};

export default ContractDataFetcher;

