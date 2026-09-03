import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HeroUIProvider } from "@heroui/react";
import App from "./App.tsx";
import { ToastProvider } from "@heroui/toast";
import ErrorBoundary from "./Utils/ErrorBoundary.tsx";
import NetworkStatus from "./Components/NetworkStatus.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <ToastProvider />
      <ErrorBoundary>
        <NetworkStatus />
        <App />
      </ErrorBoundary>
    </HeroUIProvider>
  </StrictMode>,
);
