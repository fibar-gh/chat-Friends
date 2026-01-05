import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {UserProvider} from "./Context/UserContext"
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
 
createRoot(document.getElementById('root')).render(
 <BrowserRouter>
 <UserProvider>
    <App />
 </UserProvider>
 </BrowserRouter>
)
