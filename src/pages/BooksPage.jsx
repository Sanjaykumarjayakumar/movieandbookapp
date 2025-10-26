import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import BookRow from "../components/BookRow";
import "./BooksPage.css";
import BOOK_API_KEY from "../bookApiKey";

// ✅ Load API key from .env
const API_KEY = BOOK_API_KEY;
const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

const BooksPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [latestBooks, setLatestBooks] = useState([]);
  const [genrePicks, setGenrePicks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // ✅ State for preferences, initialized from user data or localStorage
  const [bookLanguage, setBookLanguage] = useState("en");
  const [bookGenre, setBookGenre] = useState("Fiction");

  // Load preferences from user data
  useEffect(() => {
    if (user && user.preferences) {
      setBookLanguage(user.preferences.bookLanguage || "en");
      setBookGenre(user.preferences.bookGenre || "Fiction");
    } else {
      setBookLanguage(localStorage.getItem("bookLanguage") || "en");
      setBookGenre(localStorage.getItem("bookGenre") || "Fiction");
    }
  }, [user]);

  // ✅ Generic fetch books helper, depends only on language
  const fetchBooks = useCallback(
    async (q, orderBy = "relevance") => {
      if (!API_KEY) {
        throw new Error("Google Books API key not set in .env");
      }

      const url = `${BASE_URL}?q=${encodeURIComponent(
        q
      )}&orderBy=${orderBy}&langRestrict=${bookLanguage}&maxResults=20&key=${API_KEY}`;
      
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data.items || [];
      } catch (err) {
        console.error("Book fetch error:", err);
        setError("Failed to fetch books. Check your API key or network.");
        return [];
      }
    },
    [bookLanguage] // Re-create this function only when language changes
  );

  // ✅ Load books on mount and when preferences change
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      setError(null);
      const [trending, latest, genre] = await Promise.all([
        fetchBooks("bestsellers"),                 // Trending in selected language
        fetchBooks("newest releases", "newest"),     // Latest in selected language
        fetchBooks(`subject:${bookGenre}`),         // Top Picks by genre in selected language
      ]);
      setTrendingBooks(trending);
      setLatestBooks(latest);
      setGenrePicks(genre);
      setIsLoading(false);
    };

    loadBooks();
  }, [fetchBooks, bookGenre]); // Re-run when genre changes or language changes (via fetchBooks)

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    setError(null);
    const results = await fetchBooks(query);
    setSearchResults(results);
    setIsLoading(false);
  };

  const getGenreDisplayName = () => {
    const genreMap = {
      Fiction: "Fiction",
      Mystery: "Mystery / Thriller",
      Fantasy: "Fantasy / Science Fiction",
      Romance: "Romance",
      History: "Historical / Biography",
      "Self-Help": "Self-Help / Psychology",
      YA: "Young Adult (YA)",
      Children: "Children’s Books",
      Comics: "Comics / Graphic Novels",
    };
    return genreMap[bookGenre] || bookGenre;
  };

  return (
    <div className="books-container">
      <header className="books-header">
        <h1>Book Discovery</h1>
        <form className="book-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by title, author, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={isLoading}>
            Search
          </button>
        </form>
      </header>

      <main className="book-results">
        {isLoading && <p className="loading-text">Loading books...</p>}
        {error && <p className="error-text">{error}</p>}

        {!isLoading && !error && (
          <>
            {searchResults.length > 0 && (
              <BookRow title="Search Results" books={searchResults} />
            )}
            {genrePicks.length > 0 && (
              <BookRow title={`Top Picks in ${getGenreDisplayName()}`} books={genrePicks} />
            )}
            {trendingBooks.length > 0 && (
              <BookRow title="Trending Now" books={trendingBooks} />
            )}
            {latestBooks.length > 0 && (
              <BookRow title="Latest Releases" books={latestBooks} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default BooksPage;
