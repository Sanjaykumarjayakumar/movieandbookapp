import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Preferences.css";

const PreferencePage = () => {
  const [language, setLanguage] = useState("");
  const [genre, setGenre] = useState("");
  const navigate = useNavigate();

  const handleSave = () => {
    // Save language and genre to localStorage
    localStorage.setItem("preferredLanguage", language);
    localStorage.setItem("preferredGenre", genre);
    navigate("/movies");
  };

  return (
    <div className="preferences-container">
      <div className="preferences-box">
        <div className="avatar-placeholder">👤</div>
        
        <label>Language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="">Select Language</option>
          <option value="ta">Tamil</option>
          <option value="en">English</option>
          <option value="te">Telugu</option>
          <option value="ml">Malayalam</option>
        </select>

        <label>Genre</label>
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">Select Genre</option>
          <option value="28">Action</option>
          <option value="35">Comedy</option>
          <option value="18">Drama</option>
          <option value="53">Thriller</option>
        </select>

        <button className="save-btn" onClick={handleSave}>Save & Continue</button>
      </div>
    </div>
  );
};

export default PreferencePage;
