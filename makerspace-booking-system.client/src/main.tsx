import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'rsuite/dist/rsuite.min.css'
import './index.css'
import App from './App.tsx'
import UserPage from "./pages/User/UserPage.tsx";
import Reservations from "./pages/User/reservations/Reservations.tsx";
import Reserve from "./pages/User/Reserve/Reserve.tsx";
import AdminPage from "./pages/Admin/AdminPage.tsx";
import ManagementPage from "./pages/Management/ManagementPage.tsx";
import Signup from "./pages/Signup/Signup.tsx";
import Login from "./pages/Login/Login.tsx";
import { AuthProvider }  from "./lib/authProvider.tsx"

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AuthProvider>
            <StrictMode>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/user" element={<UserPage />} />
                <Route path="/user/reservations" element={<Reservations />} />
                <Route path="/user/reserve" element={<Reserve />} />
                <Route path="/adminpage" element={<AdminPage />} />
                <Route path="/management" element={<ManagementPage />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </StrictMode>
        </AuthProvider>
  </BrowserRouter>,
)

