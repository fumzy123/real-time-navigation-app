import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router"; // Only need BrowserRouter
// import "./index.css";
import App from "./app/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* BrowserRouter wraps the entire application */}
    <BrowserRouter>
      {/* App is rendered directly, and it handles all the <Routes> internally */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
