import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { queryClient } from "@/lib/queryClients.ts";
import { CartProvider } from "@/context/CartContext";
import { SpkProvider } from "@/context/SpkContext";
import { CompareProvider } from "@/context/CompareContext";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <SpkProvider>
          <CompareProvider>
            <HashRouter>
              <App />
              <Toaster />
            </HashRouter>
          </CompareProvider>
        </SpkProvider>
      </CartProvider>
    </QueryClientProvider>
  </StrictMode>,
);
