import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, uploadProfilePhoto } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const dropdownRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setDropdownOpen(false);
    };

    const handleSettings = () => {
        navigate('/settings');
        setDropdownOpen(false);
    };

    const handleProfilePhotoClick = () => {
        fileInputRef.current?.click();
    };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    const result = uploadProfilePhoto(file);
    setUploading(false);

    if (!result.success) {
      alert(result.message);
    }

    // Reset file input
    event.target.value = '';
  };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-brand">ReadNWatch</Link>
            </div>
            <div className="navbar-right">
                <Link to="/movies" className="navbar-item">Movies</Link>
                <Link to="/books" className="navbar-item">Books</Link>
                <Link to="/chat" className="navbar-item">Chat</Link>
                {user ? (
                    <div className="profile-dropdown" ref={dropdownRef}>
                        <button 
                            className="profile-photo" 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            disabled={uploading}
                        >
                            {user.profilePhoto ? (
                                <img 
                                    src={user.profilePhoto} 
                                    alt="Profile" 
                                    className="profile-image"
                                />
                            ) : (
                                user.username?.charAt(0).toUpperCase() || 'U'
                            )}
                            {uploading && <div className="uploading-overlay">...</div>}
                        </button>
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <button onClick={handleProfilePhotoClick} className="dropdown-item">
                                    Change Photo
                                </button>
                                <button onClick={handleSettings} className="dropdown-item">
                                    Settings
                                </button>
                                <button onClick={handleLogout} className="dropdown-item">
                                    Logout
                                </button>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                ) : (
                    <Link to="/login" className="navbar-item">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
