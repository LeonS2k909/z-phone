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

/**
 * Intercept taps on the Shop app tile.
 *
 * We look for any click that bubbles up from an element inside something with [data-app].
 * If its data-app === "shop", we prevent the default open behavior and tell the game to run /shop.
 *
 * Notes:
 * - Your “Shop” icon in the home grid must have data-app="shop" (lowercase).
 * - Nothing else to change in the grid. This keeps it decoupled from the app registry.
 */
document.addEventListener("click", async (e) => {
  const target = e.target;
  if (!target || typeof target.closest !== "function") return;

  const appEl = target.closest("[data-app]");
  if (!appEl) return;

  const appId = (appEl.getAttribute("data-app") || "").toLowerCase();
  if (appId !== "shop") return;

  // Stop the phone trying to open a non-existent page for this app.
  e.preventDefault();
  e.stopPropagation();

  try {
    // Ask client.lua to ExecuteCommand('shop')
    await axios.post("/execute", { command: "shop" });
    // (Optional) If you want the phone to auto-close after launching /shop, uncomment:
    // await axios.post("/hide");
  } catch (err) {
    console.error("Failed to execute /shop:", err);
  }
});
