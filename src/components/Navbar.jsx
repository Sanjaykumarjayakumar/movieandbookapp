import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-brand">ReadNWatch</Link>
            </div>
            <div className="navbar-right">
                <Link to="/movies" className="navbar-item">Movies</Link>
                <Link to="/books" className="navbar-item">Books</Link>
                <Link to="/chat" className="navbar-item">Chat</Link>
                <Link to="/preferences" className="navbar-item">Preferences</Link>
                {user ? (
                    <>
                        <span className="navbar-item">Welcome, {user.name}</span>
                        <button onClick={handleLogout} className="navbar-item">Logout</button>
                    </>
                ) : (
                    <Link to="/login" className="navbar-item">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
