// Sentry must initialise before React renders to instrument routing and errors
import { initSentry } from './core/config/sentry.js';
import Sentry from './core/config/sentry.js';
initSentry();

import './index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import store from './core/redux/store';
import ErrorBoundary from './shared/components/ErrorBoundary';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

ReactDOM.createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Provider store={store}>
            {/* Sentry.ErrorBoundary auto-captures uncaught render errors */}
            <Sentry.ErrorBoundary fallback={<ErrorBoundary />}>
                <BrowserRouter>
                    <App />
                    <Toaster />
                </BrowserRouter>
            </Sentry.ErrorBoundary>
        </Provider>
    </GoogleOAuthProvider>
);
