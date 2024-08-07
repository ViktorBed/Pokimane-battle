import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Cards from "./Pages/Cards/Cards";
import BattleTable from "./Pages/BattleTable/BattleTable";
import Login from "./Pages/Login/Login";
import { ProtectedRoute } from "./Utils/Protect";
import BattleField from './Pages/BattleField/BattleField';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<ProtectedRoute component={Layout} />}>
                    <Route index element={<Cards />} />
                    <Route path='/battle-table' element={<BattleTable />} />
                    <Route path='/battle-field' element={<BattleField />} />
                </Route>
                <Route path='/login' element={<Login />} />
            </Routes>
        </Router>
    );
};

export default App;
