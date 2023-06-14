import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './global.css';
import '@splidejs/react-splide/css/sea-green';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import { FeatureContext, FeatureRetriever } from 'feature-toggling-react';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FeatureContext.Provider
    value={{
      featureRetriever: new FeatureRetriever({
        baseUrl: "http://localhost:8080/",
      }),
    }}
    >
    <BrowserRouter>
      <App />
    </BrowserRouter >
    </FeatureContext.Provider>
  </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
