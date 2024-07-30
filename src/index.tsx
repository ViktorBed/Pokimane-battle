import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Auth0Provider} from '@auth0/auth0-react';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const domain = "dev-ai6g1zxohl4m0pt8.us.auth0.com";
const clientId = "5VDr2XD9NA1je3Nv4Hd9637X0p7hMWiZ";

root.render(
    <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
            redirect_uri: window.location.origin
        }}
    >
        <App/>
    </Auth0Provider>,
);


