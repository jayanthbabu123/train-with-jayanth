import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import 'antd/dist/reset.css'; // Ant Design v5+
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import { ConfigProvider } from "antd";

const BRAND_COLOR = "#0067b8";

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: BRAND_COLOR,
      },
    }}
  >
    <App />
  </ConfigProvider>,
)
