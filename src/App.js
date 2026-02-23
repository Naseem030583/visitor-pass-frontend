import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Visitors from './pages/Visitors';
import Security from './pages/Security';
import './App.css';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    return (
        <Router>
            <div className="App">
                {user && <Navbar user={user} setUser={setUser} />}
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" />} />
                        <Route path="/visitors" element={user ? <Visitors user={user} /> : <Navigate to="/" />} />
                        <Route path="/security" element={user ? <Security /> : <Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;