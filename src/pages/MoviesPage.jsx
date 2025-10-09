import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import MovieRow from "../components/MovieRow";
import { useLanguage } from "../hooks/useLanguage";
import "./Movies.css";

const MoviesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const [genre, setGenre] = useState("");
  const [heroMovie, setHeroMovie] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const [topPicks, setTopPicks] = useState([]);
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const user = auth.currentUser;
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const genreName = localStorage.getItem("genreName") || "";
  const region = "IN"; // Moved to component scope

  const fetchMovies = useCallback(async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`API call failed with status: ${res.status}`);
      }
      const data = await res.json();
      return data.results;
    } catch (err) {
      console.error(err);
      setError("Failed to fetch movies. Please try again later.");
      return [];
    }
  }, []);

  useEffect(() => {
    const fetchGenrePreference = async () => {
      let userGenre = "";
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists() && userDoc.data().preferences) {
            userGenre = userDoc.data().preferences.genre || "";
          }
        } catch (err) {
          console.error("Error fetching user preferences:", err);
          setError("Could not load your genre preference.");
        }
      } else {
        userGenre = localStorage.getItem("preferredGenre") || "";
      }
      setGenre(userGenre);
    };
    fetchGenrePreference();
  }, [user]);

  useEffect(() => {
    const fetchAllCategories = async () => {
      if (!language || !genre) return;
      setLoading(true);
      setError(null);

      const today = new Date();
      const oneMonthAgo = new Date(new Date().setMonth(today.getMonth() - 1));
      const formatDate = (date) => date.toISOString().split('T')[0];

      const urls = {
        topPicks: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&with_original_language=${language}&with_genres=${genre}`,
        trending: `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=${language}`,
        latest: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=${language}&with_genres=${genre}&with_original_language=${language}&primary_release_date.gte=${formatDate(oneMonthAgo)}&primary_release_date.lte=${formatDate(today)}`,
        upcoming: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=${language}&with_genres=${genre}&with_original_language=${language}&primary_release_date.gte=${formatDate(today)}`,
      };

      try {
        const [topPicksResults, trendingResults, latestResults, upcomingResults] = await Promise.all([
          fetchMovies(urls.topPicks),
          fetchMovies(urls.trending),
          fetchMovies(urls.latest),
          fetchMovies(urls.upcoming),
        ]);
        
        const currentDate = new Date();
        const releasedTopPicks = topPicksResults.filter(movie => {
            if (!movie.release_date) return false;
            const releaseDate = new Date(movie.release_date);
            return releaseDate <= currentDate;
        });

        setHeroMovie(releasedTopPicks[0] || trendingResults[0] || latestResults[0]);
        setTopPicks(releasedTopPicks);
        setTrending(trendingResults);
        setLatest(latestResults);
        setUpcoming(upcomingResults);

      } catch (err) {
        console.error("Failed to fetch movie categories:", err);
        setError("There was a problem loading movie categories. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, [language, genre, fetchMovies, apiKey, region]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.length > 2) {
        setLoading(true);
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}&language=${language}&page=1&include_adult=false`;
        const results = await fetchMovies(url);
        setSearchResults(results);
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(fetchSearchResults, 500);
    return () => clearTimeout(debounceFetch);

  }, [searchQuery, fetchMovies, apiKey, language]);


  const HeroCard = ({ movie }) => {
    if (!movie) return null;
    const { title, overview, backdrop_path } = movie;
    const imageUrl = `https://image.tmdb.org/t/p/original${backdrop_path}`;

    return (
        <div className="hero-card" style={{ backgroundImage: `url(${imageUrl})` }} onClick={() => navigate(`/movies/${movie.id}`)}>
            <div className="hero-overlay">
                <div className="hero-content">
                    <h1>{title}</h1>
                    <p>{overview}</p>
                    <button className="hero-btn">More Info</button>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="movies-page-container">
      <header className="movies-page-header">
        <div className="search-container">
            <input
                type="text"
                placeholder="Search for movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </header>
      
      {error && <div className="error-message">{error}</div>}

      {loading ? (
          <div className="loading-movies">Curating your cinematic experience...</div>
      ) : (
        <main>
          {!searchQuery && <HeroCard movie={heroMovie} />}
          
          {searchQuery ? (
            <MovieRow title={`Results for "${searchQuery}"`} movies={searchResults} />
          ) : (
            <>
              <MovieRow title={`Top Picks in ${genreName}`} movies={topPicks} />
              <MovieRow title="Trending Now" movies={trending} />
              <MovieRow title="Latest Releases" movies={latest} />
              <MovieRow title="Upcoming Movies" movies={upcoming} />
            </>
          )}
        </main>
      )}
    </div>
  );
};

export default MoviesPage;
