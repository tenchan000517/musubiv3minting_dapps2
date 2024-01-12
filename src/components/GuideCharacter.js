import React, { useState, useEffect } from 'react';
import './GuideCharacter.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const characterImages = [
  'character1.png', // TOPページのキャラクター画像
  'character2.png', // mint-nftページのキャラクター画像
  'character3.png', // view-nftページのキャラクター画像
  'character4.png', // download-nftページのキャラクター画像
];

const GuideCharacter = ({ currentStep }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // 現在のステップに応じてメッセージを更新
  useEffect(() => {
    switch (currentStep) {
      case 1:
        setMessage("TOPページです。Mint NFTページに進みましょう！");
        break;
      case 2:
        setMessage("Mint NFTページです。View NFTページに進みましょう！");
        break;
      case 3:
        setMessage("View NFTページです。Download NFTページに進みましょう！");
        break;
      case 4:
        setMessage("Download NFTページです。ここでダウンロードを完了させましょう！");
        break;
      default:
        setMessage("ページが見つかりません。");
    }
  }, [currentStep]);

  const handleNext = () => {
    switch (currentStep) {
      case 1:
        navigate('/mint-nft');
        break;
      case 2:
        navigate('/view-nft');
        break;
      case 3:
        navigate('/download-nft');
        break;
        default:

      // case 4には何もしない
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 2:
        navigate('/');
        break;
      case 3:
        navigate('/mint-nft');
        break;
      case 4:
        navigate('/view-nft');
        break;
        default:

      // case 1には何もしない
    }
  };

  // currentStepに応じてキャラクター画像を選択
  const characterImg = characterImages[currentStep - 1];

  return (
    <div className="guide-character">
      <motion.img 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        src={require(`../assets/images/${characterImg}`)} // 画像パスの修正
        alt="ガイドキャラクター" 
      />
      <motion.div 
        className="message-box"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <p>{message}</p>
        {currentStep !== 4 && <button onClick={handleNext}>次へ</button>}
        {currentStep !== 1 && <button onClick={handleBack}>戻る</button>}
      </motion.div>
    </div>
  );
};

export default GuideCharacter;
