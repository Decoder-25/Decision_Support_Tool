import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoute from './config/app-route'
import {BrowserRouter, useRoutes } from 'react-router-dom'
import { ScenarioBuilderProvider } from "./context/ScenarioBuilderContext";


function App()
{
  const element = useRoutes(AppRoute);
  return element;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <ScenarioBuilderProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ScenarioBuilderProvider>
</StrictMode>
  
)
