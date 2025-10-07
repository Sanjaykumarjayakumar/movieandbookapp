import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import './Navbar.css';

const Navbar = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-brand">CINEMATIC</Link>
            </div>
            <div className="navbar-right">
                <Link to="/movies" className="navbar-item">Movies</Link>
                <Link to="/books" className="navbar-item">Books</Link>
                <Link to="/preferences" className="navbar-item">Preferences</Link>
                {user ? (
                    <button onClick={handleLogout} className="navbar-item">Logout</button>
                ) : (
                    <Link to="/login" className="navbar-item">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
