import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';

const OCRComponent = () => {
  const [image, setImage] = useState('');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // publicフォルダ内の画像を初期画像として設定
    setImage(process.env.PUBLIC_URL + '/logo512.png');
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0])); // 画像のURLを生成してステートに設定
    }
  };

  const performOCR = () => {
    setIsLoading(true);
    Tesseract.recognize(
      image,
      'eng', // 使用する言語を指定
      {
        logger: m => console.log(m)
      }
    ).then(({ data: { text } }) => {
      setText(text);
      setIsLoading(false);
    });
  };

  return (
    <div>
      {image && <img src={image} alt="Scanned" />}
      <button onClick={performOCR} disabled={isLoading}>Perform OCR</button>
      {isLoading && <p>Loading...</p>}
      <textarea value={text} readOnly />
    </div>
  );
};


export default OCRComponent;
