import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoute from './config/app-route'
import {BrowserRouter, useRoutes } from 'react-router-dom'


function App()
{
  const element = useRoutes(AppRoute);
  return element;
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <StrictMode>
    <App />
  </StrictMode>
  </BrowserRouter>
  
)
