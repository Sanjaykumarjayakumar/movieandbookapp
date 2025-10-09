import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import FinishSignUpPage from "./pages/FinishSignUpPage";
import PreferencePage from "./pages/PreferencePage";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import BooksPage from "./pages/BooksPage";
import BookDetailPage from "./pages/BookDetailPage";
import { LanguageProvider } from "./contexts/LanguageContext";
import Navbar from "./components/Navbar";
import "./App.css";

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <LanguageProvider>
      <Router>
        <div className="app-container">
          <Navbar user={user} />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/finishSignUp" element={<FinishSignUpPage />} />
              <Route path="/preferences" element={<PreferencePage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/movies/:id" element={<MovieDetailPage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;
