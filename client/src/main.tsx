import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("❌ Root element not found. Make sure index.html includes <div id='root'>");
} else {
  createRoot(rootElement).render(<App />);
  console.log("✅ App rendered successfully");
}
