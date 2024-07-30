import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './Pages/Login/Login';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const ProtectedRoute: React.FC<{ component: React.ComponentType<any> }> = ({ component: Component }) => {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Component />;
};


root.render(
    <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN!}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
        authorizationParams={{
            redirect_uri: process.env.REACT_APP_REDIRECT_URI
        }}
    >
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<ProtectedRoute component={App} />} />
            </Routes>
        </Router>
    </Auth0Provider>
);
