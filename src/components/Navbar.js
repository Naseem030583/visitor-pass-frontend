import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/dashboard">🏢 Visitor Pass</Link>
            </div>
            <div className="nav-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/visitors">Visitors</Link>
                {(user.role === 'admin' || user.role === 'security') && (
                    <Link to="/security">Security</Link>
                )}
                <span className="nav-user">{user.name} ({user.role})</span>
                <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;