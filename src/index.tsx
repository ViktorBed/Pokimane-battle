import React from 'react';
import ReactDOM from 'react-dom/client';
// import {Auth0Provider} from '@auth0/auth0-react';

import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    // <Auth0Provider
    //     domain={process.env.REACT_APP_AUTH0_DOMAIN!}
    //     clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
    //     authorizationParams={{
    //         redirect_uri: process.env.REACT_APP_REDIRECT_URI
    //     }}
    // >
        <App/>
    //</Auth0Provider>
);
