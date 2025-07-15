import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoute from './config/app-route'
import {BrowserRouter, useRoutes } from 'react-router-dom'
import { ScenarioBuilderProvider } from "./context/ScenarioBuilderContext";
import { OptimiserProvider } from "./context/OptimiserContext";


function App()
{
  const element = useRoutes(AppRoute);
  return element;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScenarioBuilderProvider>
      <OptimiserProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </OptimiserProvider>
  </ScenarioBuilderProvider>
</StrictMode>
);
