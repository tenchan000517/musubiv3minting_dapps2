import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ currentStep, totalSteps }) => {
  // プログレスバーの幅を計算
  const progressBarWidth = ((currentStep - 1) / (totalSteps - 1)) * 100 + '%';

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: progressBarWidth }}></div>
    </div>
  );
};

export default ProgressBar;
