import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../hooks/useLanguage';
import './PreferenceSetupPage.css';

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

const PreferenceSetupPage = () => {
  const { user, updatePreferences } = useAuth();
  const { setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [movieLanguage, setMovieLanguage] = useState("en");
  const [movieGenre, setMovieGenre] = useState("");
  const [bookLanguage, setBookLanguage] = useState("en");
  const [bookGenre, setBookGenre] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const renderDropdown = (items, selected, setter, keyField = 'id') => (
    <select 
      value={selected} 
      onChange={(e) => setter(e.target.value)}
      className="preference-dropdown"
    >
      <option value="">Select...</option>
      {items.map((item) => (
        <option key={item[keyField]} value={item[keyField]}>
          {item.name}
        </option>
      ))}
    </select>
  );

  const handleNext = () => {
    if (currentStep === 1 && (!movieLanguage || !movieGenre)) {
      alert("Please select both movie language and genre");
      return;
    }
    if (currentStep === 2 && (!bookLanguage || !bookGenre)) {
      alert("Please select both book language and genre");
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = async () => {
    if (!movieLanguage || !movieGenre || !bookLanguage || !bookGenre) {
      alert("Please complete all preferences");
      return;
    }

    setIsLoading(true);

    const preferences = {
      movieLanguage,
      movieGenre,
      bookLanguage,
      bookGenre,
      dateOfBirth,
    };

    // Update user preferences
    updatePreferences(preferences);
    
    // Set language context
    setLanguage(movieLanguage);
    
    // Set genre name for display
    const genreName = movieGenres.find(g => g.id === movieGenre)?.name;
    localStorage.setItem("genreName", genreName || "");

    setIsLoading(false);
    navigate('/movies');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="preference-step">
            <h2>Movie Preferences</h2>
            <p>Let's start with your movie preferences</p>
            
            <div className="preference-group">
              <h3>Select your preferred language for movies</h3>
              {renderDropdown(languages, movieLanguage, setMovieLanguage, 'code')}
            </div>
            
            <div className="preference-group">
              <h3>Select your favorite movie genre</h3>
              {renderDropdown(movieGenres, movieGenre, setMovieGenre, 'id')}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="preference-step">
            <h2>Book Preferences</h2>
            <p>Now let's set up your book preferences</p>
            
            <div className="preference-group">
              <h3>Select your preferred language for books</h3>
              {renderDropdown(languages, bookLanguage, setBookLanguage, 'code')}
            </div>
            
            <div className="preference-group">
              <h3>Select your favorite book genre</h3>
              {renderDropdown(bookGenres, bookGenre, setBookGenre, 'id')}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="preference-step">
            <h2>Personal Information</h2>
            <p>Almost done! Just a few more details</p>
            
            <div className="preference-group">
              <h3>Date of Birth (Optional)</h3>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="preference-date-input"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="preference-setup-container">
      <div className="preference-setup-content">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
        
        <div className="step-indicator">
          Step {currentStep} of 3
        </div>

        {renderStep()}

        <div className="preference-actions">
          {currentStep > 1 && (
            <button 
              className="preference-btn secondary" 
              onClick={handleBack}
            >
              Back
            </button>
          )}
          
          {currentStep < 3 ? (
            <button 
              className="preference-btn primary" 
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button 
              className="preference-btn primary" 
              onClick={handleFinish}
              disabled={isLoading}
            >
              {isLoading ? 'Setting up...' : 'Finish Setup'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreferenceSetupPage;
