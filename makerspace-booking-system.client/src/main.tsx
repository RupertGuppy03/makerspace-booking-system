import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import UserPage from "./pages/User/UserPage.tsx";
import AdminPage from "./pages/Admin/AdminPage.tsx";
import ManagementPage from "./pages/Management/ManagementPage.tsx";
import Signup from "./pages/Signup/Signup.tsx";
import Login from "./pages/Login/Login.tsx";
import { AuthProvider }  from "./lib/authProvider.tsx"

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <StrictMode>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/user" element={<UserPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/management" element={<ManagementPage />} />
                    <Route path="/signup" element={<Signup />} /> 
                    <Route path="/login" element={<Login />} /> 
                </Routes>
            </AuthProvider>
        </StrictMode>
    </BrowserRouter>
)
