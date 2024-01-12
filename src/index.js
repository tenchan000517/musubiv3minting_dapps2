import './polyfills';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // 追加
import store from './redux/store'; // 追加
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}> {/* 追加 */}
      <App />
    </Provider> {/* 追加 */}
  </React.StrictMode>
);

