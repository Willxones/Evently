import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './app/Layout';
import Home from './app/home';
import SignIn from './app/auth/SignIn';
import { UserProvider } from './contexts/UserContext';
import SignUp from './app/auth/SignUp';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route element={<Home />} index />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </UserProvider>
    </StrictMode>
);
