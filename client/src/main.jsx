// inside src/main.jsx or src/index.js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // <--- Ensure this matches your filename
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)