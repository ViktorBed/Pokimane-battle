import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import {Navigate} from "react-router-dom";

export const ProtectedRoute: React.FC<{ component: React.ComponentType<any> }> = ({ component: Component }) => {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Component />;
};