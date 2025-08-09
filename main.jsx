import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { MenuProvider } from "./context/MenuContext";
import axios from "axios";

/**
 * IMPORTANT:
 * - Leave resourceName as your actual resource name (folder name) on the server.
 * - The z-phone build posts to NUI endpoints like https://<resourceName>/<callback>.
 */
const resourceName = "z-phone";
// const resourceName = "phone-mock.vercel.app"; // for web preview only

axios.defaults.baseURL = `https://${resourceName}`;
axios.defaults.headers.common["Authorization"] = "Bearer ZPHONE";
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.request.use(
  (request) => request,
  (error) => Promise.reject(error)
);

ReactDOM.createRoot(document.getElementById("z-phone-root")).render(
  <React.StrictMode>
    <MenuProvider>
      <App />
    </MenuProvider>
  </React.StrictMode>
);