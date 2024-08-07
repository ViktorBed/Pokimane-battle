import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import useSearchStore from '../../store/searchStore';
import s from './Layout.module.scss';

const Layout: React.FC = () => {
    const { searchQuery, setSearchQuery } = useSearchStore();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <>
            <div className={s.navbar}>
                <div>
                    <NavLink to="/">Cards</NavLink>
                    <NavLink to="/battle-table">Battle</NavLink>
                </div>
                <div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search Pokémon"
                    />
                </div>
            </div>
            <Outlet />
        </>
    );
};

export default Layout;
