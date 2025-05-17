import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './app/Layout';
import Home from './app/home';
import SignIn from './app/auth/SignIn';
import { UserProvider } from './contexts/UserContext';
import OnboardingLayout from './app/onboarding/OnboardingLayout';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route element={<Home />} index />
                    </Route>
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/onboarding" element={<OnboardingLayout />} />
                </Routes>
            </BrowserRouter>
        </UserProvider>
    </StrictMode>
);
