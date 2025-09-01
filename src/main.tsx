import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { setupInterceptors } from './settings/axios.tsx';
import store from './Redux/Store.tsx';
import '@fontsource/manrope/latin.css';
import '@fontsource/jetbrains-mono/index.css';
import './fonts.css'

setupInterceptors(store.dispatch);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
