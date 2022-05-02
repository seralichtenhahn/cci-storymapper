import "@/assets/index.css"
import "mapbox-gl/dist/mapbox-gl.css"

import App from "./App"
import React from "react"
import ReactDOM from "react-dom/client"
import mapbox from "mapbox.js"

window.L.mapbox.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
