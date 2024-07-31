import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <>
            <div className={'header'}>
                <NavLink to="/">Cards</NavLink>
                <NavLink to="/battle">Battle</NavLink>
            </div>
            <Outlet/>
        </>
    );
};

export default Layout;
