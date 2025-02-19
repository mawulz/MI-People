import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// import framework7
import Framework7 from 'framework7/lite-bundle';
import Framework7React from 'framework7-react';
import 'framework7/css/bundle';

import App from './components/App.jsx'

Framework7.use(Framework7React)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
