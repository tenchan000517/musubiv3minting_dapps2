import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';

const OCRComponent = () => {
  const [image, setImage] = useState('');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOCR, setShowOCR] = useState(false); // OCR表示の制御用ステート

  useEffect(() => {
    setImage(process.env.PUBLIC_URL + '/logo512.png');
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setShowOCR(true); // 画像が選択されたらOCRを表示
    }
  };

  const performOCR = () => {
    setIsLoading(true);
    Tesseract.recognize(
      image,
      'eng',
      {
        logger: m => console.log(m)
      }
    ).then(({ data: { text } }) => {
      setText(text);
      setIsLoading(false);
      setShowOCR(false); // OCR処理が完了したら非表示にする
    });
  };

  return (
    <div>
      {showOCR && (
        <>
          {image && <img src={image} alt="Scanned" />}
          <button onClick={performOCR} disabled={isLoading}>Perform OCR</button>
          {isLoading && <p>Loading...</p>}
          <textarea value={text} readOnly />
        </>
      )}
    </div>
  );
};

export default OCRComponent;
