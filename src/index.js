import './tailwind/tailwind.css'; // or 'tailwind.css' if that's what you named it
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; // Make sure the path to AuthContext is correct
import App from './App';
import { Auth0Provider } from "@auth0/auth0-react";

const container = document.getElementById("root");
const root = createRoot(container);
const appBaseUrl = process.env.REACT_APP_APP_BASE_URL;

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Auth0Provider
                domain="dev-71wv0ibtf0gs5dv1.us.auth0.com"
                clientId="nMFfc6vkcBgRj7bqrAySOjtOwPW3PRdL"
                authorizationParams={{
                    redirect_uri: appBaseUrl + '/dashboard',

                }}
            >
                <App />
            </Auth0Provider>
        </BrowserRouter>
    </React.StrictMode >
);
