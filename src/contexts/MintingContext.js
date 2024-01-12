import React, { createContext, useState, useContext } from 'react';

const MintingContext = createContext();

export const MintingProvider = ({ children }) => {
  const [progress, setProgress] = useState(0); // 進捗状況
  const [platform, setPlatform] = useState('PC'); // デフォルトはPC

  // プラットフォームを切り替える関数
  const switchPlatform = (selectedPlatform) => {
    if (selectedPlatform === 'PC' || selectedPlatform === 'スマホ') {
      setPlatform(selectedPlatform);
    }
  };

  return (
    <MintingContext.Provider value={{ progress, setProgress, platform, switchPlatform }}>
      {children}
    </MintingContext.Provider>
  );
};

export const useMinting = () => {
  return useContext(MintingContext);
};
