import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './app/Layout';
import Home from './app/home';
import SignIn from './app/auth/SignIn';
import { UserProvider } from './contexts/UserContext';
import { OrganiserProvider } from './contexts/OrganiserContext';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <UserProvider>
            <OrganiserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route element={<Home />} index />
                        </Route>
                        <Route path="/signin" element={<SignIn />} />
                    </Routes>
                </BrowserRouter>
            </OrganiserProvider>
        </UserProvider>
    </StrictMode>
);