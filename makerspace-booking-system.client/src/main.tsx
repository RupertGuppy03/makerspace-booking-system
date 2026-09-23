import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'rsuite/dist/rsuite.min.css'
// The palette, the reset and the Bootstrap bridge.
import './index.css'
// The look shared by the manager dashboard and the admin page.
import './dashboard.css'
import App from './App.tsx'
import UserPage from "./pages/User/UserPage.tsx";
import Reservations from "./pages/User/reservations/Reservations.tsx";
import Reserve from "./pages/User/Reserve/Reserve.tsx";
import AdminPage from "./pages/Admin/AdminPage.tsx";
import ManagementPage from "./pages/Management/ManagementPage.tsx";
import ManagementRevenueSection from "./components/Management/ManagementRevenueSection.tsx";
import ManagementUserSection from "./components/Management/ManagementUserSection.tsx";
import ManagementToolSection from "./components/Management/ManagementToolSection.tsx";
import Signup from "./pages/Signup/Signup.tsx";
import Login from "./pages/Login/Login.tsx";
import { AuthProvider } from "./lib/authProvider.tsx"
import AccountBanner from './components/accountBanner';


createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AuthProvider>
            <StrictMode>

                <AccountBanner />
                <Routes>
                <Route path="/" element={<App />} />
                <Route path="/user" element={<UserPage />} />
                <Route path="/user/reservations" element={<Reservations />} />
                <Route path="/user/reserve" element={<Reserve />} />
                <Route path="/admin" element={<AdminPage />} />
                {/*
                  * Nested routes: ManagementPage draws the frame, and whichever
                  * child matches the address is rendered inside its <Outlet />.
                  * Landing on /management alone redirects to the revenue section.
                  */}
                <Route path="/management" element={<ManagementPage />}>
                  <Route index element={<Navigate to="revenue" replace />} />
                  <Route path="revenue" element={<ManagementRevenueSection />} />
                  <Route path="users" element={<ManagementUserSection />} />
                  <Route path="tools" element={<ManagementToolSection />} />
                </Route>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                </Routes>

            </StrictMode>
        </AuthProvider>
    </BrowserRouter>,
)

