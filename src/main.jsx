import './index.css';

import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import store from './Redux/store';
import ErrorBoundary from './Components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <ErrorBoundary>
            <BrowserRouter>
                <App />
                <Toaster />
            </BrowserRouter>
        </ErrorBoundary>
    </Provider>
);
