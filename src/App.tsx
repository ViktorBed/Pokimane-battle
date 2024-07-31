import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Cards from "./Pages/Cards/Cards";
import Battle from "./Pages/Battle/Battle";
import Login from "./Pages/Login/Login";
import {ProtectedRoute} from "./Utils/Protect";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<ProtectedRoute component={Layout}/>}>
                    <Route index element={<Cards/>}/>
                    <Route path='/battle' element={<Battle/>}/>
                </Route>
                <Route path='/login' element={<Login/>}/>
            </Routes>
        </Router>


    );
};

export default App;
