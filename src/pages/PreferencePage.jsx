import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useLanguage } from "../hooks/useLanguage";
import "./Preferences.css";

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
  { id: "Children", name: "Children’s Books" },
  { id: "Comics", name: "Comics / Graphic Novels" },
];

const PreferencePage = () => {
  const [movieLanguage, setMovieLanguage] = useState("");
  const [movieGenre, setMovieGenre] = useState("");
  const [bookLanguage, setBookLanguage] = useState("");
  const [bookGenre, setBookGenre] = useState("");
  const { setLanguage } = useLanguage();
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchPreferences = async () => {
      let prefs = {};
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          prefs = userDoc.data().preferences || {};
        }
      } else {
        prefs.movieLanguage = localStorage.getItem("movieLanguage");
        prefs.movieGenre = localStorage.getItem("movieGenre");
        prefs.bookLanguage = localStorage.getItem("bookLanguage");
        prefs.bookGenre = localStorage.getItem("bookGenre");
      }
      setMovieLanguage(prefs.movieLanguage || "en");
      setMovieGenre(prefs.movieGenre || "");
      setBookLanguage(prefs.bookLanguage || "en");
      setBookGenre(prefs.bookGenre || "");
    };
    fetchPreferences();
  }, [user]);

  const handleSave = async () => {
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
    };

    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { preferences }, { merge: true });
    } else {
      localStorage.setItem("movieLanguage", movieLanguage);
      localStorage.setItem("movieGenre", movieGenre);
      localStorage.setItem("bookLanguage", bookLanguage);
      localStorage.setItem("bookGenre", bookGenre);
    }
    
    const genreName = movieGenres.find(g => g.id === movieGenre)?.name;
    localStorage.setItem("genreName", genreName || "");

    navigate("/movies");
  };

  const renderOptions = (items, selected, setter, keyField = 'id') => (
    <div className="options-grid">
      {items.map((item) => (
        <button
          key={item[keyField]}
          className={`option-btn ${selected === item[keyField] ? "selected" : ""}`}
          onClick={() => setter(item[keyField])}
        >
          {item.name}
        </button>
      ))}
    </div>
  );

  return (
    <div className="preferences-container">
      <div className="preferences-content">
        <h1 className="glow-text">Customize Your Universe</h1>
        <p className="subtitle">Choose your favorite languages and genres for movies and books.</p>
        
        <div className="preference-section">
          <h2 className="section-title">Movie Preferences</h2>
          <div className="selection-group">
            <h3 className="group-title">Select a Language</h3>
            {renderOptions(languages, movieLanguage, setMovieLanguage, 'code')}
          </div>
          <div className="selection-group">
            <h3 className="group-title">Select a Genre</h3>
            {renderOptions(movieGenres, movieGenre, setMovieGenre, 'id')}
          </div>
        </div>

        <div className="preference-section">
          <h2 className="section-title">Book Preferences</h2>
          <div className="selection-group">
            <h3 className="group-title">Select a Language</h3>
            {renderOptions(languages, bookLanguage, setBookLanguage, 'code')}
          </div>
          <div className="selection-group">
            <h3 className="group-title">Select a Genre</h3>
            {renderOptions(bookGenres, bookGenre, setBookGenre, 'id')}
          </div>
        </div>

        <button className="save-btn" onClick={handleSave}>
          Save and Explore
        </button>
      </div>
    </div>
  );
};

export default PreferencePage;
