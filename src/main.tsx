import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "@/styles/globals.css";
import { App } from "./app";

const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
