import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../hooks/useLanguage';
import './SettingsPage.css';

const languages = [
  { code: "ta", name: "Tamil" },
  { code: "en", name: "English" },
  { code: "te", name: "Telugu" },
  { code: "ml", name: "Malayalam" },
  { code: "hi", name: "Hindi" },
];

const movieGenres = [
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "35", name: "Comedy" },
  { id: "18", name: "Drama" },
  { id: "53", name: "Thriller" },
  { id: "878", name: "Science Fiction" },
  { id: "14", name: "Fantasy" },
  { id: "10749", name: "Romance" },
  { id: "27", name: "Horror" },
  { id: "16", name: "Animation" },
];

const bookGenres = [
  { id: "Fiction", name: "Fiction" },
  { id: "Mystery", name: "Mystery / Thriller" },
  { id: "Fantasy", name: "Fantasy / Science Fiction" },
  { id: "Romance", name: "Romance" },
  { id: "History", name: "Historical / Biography" },
  { id: "Self-Help", name: "Self-Help / Psychology" },
  { id: "YA", name: "Young Adult (YA)" },
  { id: "Children", name: "Children's Books" },
  { id: "Comics", name: "Comics / Graphic Novels" },
];

const SettingsPage = () => {
  const { 
    user: authUser, 
    updatePreferences, 
    getWatchlist, 
    getReadLater, 
    removeFromWatchlist, 
    removeFromReadLater 
  } = useAuth();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [readLater, setReadLater] = useState([]);
  const [movieLanguage, setMovieLanguage] = useState("");
  const [movieGenre, setMovieGenre] = useState("");
  const [bookLanguage, setBookLanguage] = useState("");
  const [bookGenre, setBookGenre] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // Load user-specific watchlist and read later
    if (authUser) {
      setWatchlist(getWatchlist());
      setReadLater(getReadLater());

      // Load preferences from user data
      const prefs = authUser.preferences || {};
      setMovieLanguage(prefs.movieLanguage || "en");
      setMovieGenre(prefs.movieGenre || "");
      setBookLanguage(prefs.bookLanguage || "en");
      setBookGenre(prefs.bookGenre || "");
      setDateOfBirth(prefs.dateOfBirth || "");
    } else {
      // Fallback to localStorage for non-authenticated users
      setWatchlist(JSON.parse(localStorage.getItem('watchlist') || '[]'));
      setReadLater(JSON.parse(localStorage.getItem('readLater') || '[]'));
      setMovieLanguage(localStorage.getItem("movieLanguage") || "en");
      setMovieGenre(localStorage.getItem("movieGenre") || "");
      setBookLanguage(localStorage.getItem("bookLanguage") || "en");
      setBookGenre(localStorage.getItem("bookGenre") || "");
      setDateOfBirth(localStorage.getItem("dateOfBirth") || "");
    }
  }, [authUser, getWatchlist, getReadLater]);

  const handleRemoveFromWatchlist = (movieId) => {
    const result = removeFromWatchlist(movieId);
    if (result.success) {
      setWatchlist(getWatchlist());
    }
  };

  const handleRemoveFromReadLater = (bookId) => {
    const result = removeFromReadLater(bookId);
    if (result.success) {
      setReadLater(getReadLater());
    }
  };

  const handleSaveAll = () => {
    if (!movieLanguage || !movieGenre || !bookLanguage || !bookGenre) {
      alert("Please make a selection for all preferences.");
      return;
    }

    setLanguage(movieLanguage); // Set context language for movies

    const preferences = {
      movieLanguage,
      movieGenre,
      bookLanguage,
      bookGenre,
      dateOfBirth,
    };

    if (authUser) {
      // Update user preferences using AuthContext
      updatePreferences(preferences);
    } else {
      // Fallback to localStorage for non-authenticated users
      localStorage.setItem("movieLanguage", movieLanguage);
      localStorage.setItem("movieGenre", movieGenre);
      localStorage.setItem("bookLanguage", bookLanguage);
      localStorage.setItem("bookGenre", bookGenre);
      localStorage.setItem("dateOfBirth", dateOfBirth);
    }
    
    const genreName = movieGenres.find(g => g.id === movieGenre)?.name;
    localStorage.setItem("genreName", genreName || "");

    alert("All preferences saved successfully!");
  };

  const renderDropdown = (items, selected, setter, keyField = 'id') => (
    <select 
      value={selected} 
      onChange={(e) => setter(e.target.value)}
      className="dropdown-select"
    >
      <option value="">Select...</option>
      {items.map((item) => (
        <option key={item[keyField]} value={item[keyField]}>
          {item.name}
        </option>
      ))}
    </select>
  );

  return (
    <div className="settings-container">
      <div className="settings-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <h1>Settings</h1>
      </div>

      <div className="settings-content">
        {/* User Info Section */}
        <div className="settings-section">
          <h2>User Information</h2>
          <div className="user-info-card">
            <div className="user-avatar">
              {authUser?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <p className="user-label">Username</p>
              <p className="user-value">{authUser?.username || 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="settings-section">
          <h2>Personal Information</h2>
          <div className="selection-group">
            <h3 className="group-title">Date of Birth</h3>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="date-input"
            />
          </div>
        </div>

        {/* Movie Preferences Section */}
        <div className="settings-section">
          <h2>Movie Preferences</h2>
          <div className="selection-group">
            <h3 className="group-title">Select a Language</h3>
            {renderDropdown(languages, movieLanguage, setMovieLanguage, 'code')}
          </div>
          <div className="selection-group">
            <h3 className="group-title">Select a Genre</h3>
            {renderDropdown(movieGenres, movieGenre, setMovieGenre, 'id')}
          </div>
        </div>

        {/* Book Preferences Section */}
        <div className="settings-section">
          <h2>Book Preferences</h2>
          <div className="selection-group">
            <h3 className="group-title">Select a Language</h3>
            {renderDropdown(languages, bookLanguage, setBookLanguage, 'code')}
          </div>
          <div className="selection-group">
            <h3 className="group-title">Select a Genre</h3>
            {renderDropdown(bookGenres, bookGenre, setBookGenre, 'id')}
          </div>
        </div>

        {/* Save All Button */}
        <div className="settings-section">
          <button className="save-all-btn" onClick={handleSaveAll}>
            Save All Preferences
          </button>
        </div>

        {/* Watchlist Section */}
        <div className="settings-section">
          <h2>My Watchlist ({watchlist.length})</h2>
          {watchlist.length > 0 ? (
            <div className="items-grid">
              {watchlist.map((movie) => (
                <div key={movie.id} className="item-card">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    onClick={() => navigate(`/movies/${movie.id}`)}
                  />
                  <div className="item-info">
                    <h4 onClick={() => navigate(`/movies/${movie.id}`)}>
                      {movie.title}
                    </h4>
                    <p>{movie.release_date?.split('-')[0]}</p>
                    <button 
                      onClick={() => handleRemoveFromWatchlist(movie.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No movies in your watchlist yet.</p>
          )}
        </div>

        {/* Read Later Section */}
        <div className="settings-section">
          <h2>Read Later ({readLater.length})</h2>
          {readLater.length > 0 ? (
            <div className="items-grid">
              {readLater.map((book) => (
                <div key={book.id} className="item-card">
                  <img
                    src={book.imageLinks?.thumbnail?.replace(/^http:/, 'https:') || 'https://placehold.co/200x300'}
                    alt={book.title}
                    onClick={() => navigate(`/books/${book.id}`)}
                  />
                  <div className="item-info">
                    <h4 onClick={() => navigate(`/books/${book.id}`)}>
                      {book.title}
                    </h4>
                    <p>By {book.authors?.join(', ') || 'Unknown'}</p>
                    <button 
                      onClick={() => handleRemoveFromReadLater(book.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No books in your read later list yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

