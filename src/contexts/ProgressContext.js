import React, { createContext, useReducer, useContext } from 'react';

// 初期状態
const initialState = {
  progress: 0,
};

// レデューサー
const progressReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    default:
      return state;
  }
};

// コンテキストの作成
const ProgressContext = createContext();

// プロバイダーコンポーネント
export const ProgressProvider = ({ children }) => {
  const [state, dispatch] = useReducer(progressReducer, initialState);

  return (
    <ProgressContext.Provider value={{ state, dispatch }}>
      {children}
    </ProgressContext.Provider>
  );
};

// カスタムフック
export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export default ProgressContext;
